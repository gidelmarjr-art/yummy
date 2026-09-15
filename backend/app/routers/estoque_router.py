from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.insumo import Insumo
from app.schemas.insumo_schema import (
    InsumoCreate,
    InsumoResponse,
    InsumoRestock,
    InsumoUpdate,
)
from app.security.dependencies import require_gerencia
from app.services.estoque_service import (
    gerar_codigo_sequencial,
    insumo_para_dict,
    sincronizar_produtos_que_usam_insumo,
)

router = APIRouter(prefix="/estoque", tags=["Estoque"])


@router.get("", response_model=List[InsumoResponse])
def listar_insumos(db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    insumos = db.query(Insumo).order_by(Insumo.id).all()
    return [insumo_para_dict(i) for i in insumos]


@router.get("/{insumo_id}", response_model=InsumoResponse)
def obter_insumo(insumo_id: int, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    insumo = db.get(Insumo, insumo_id)
    if not insumo:
        raise HTTPException(status_code=404, detail="Insumo não encontrado.")
    return insumo_para_dict(insumo)


@router.post("", response_model=InsumoResponse, status_code=201)
def criar_insumo(dados: InsumoCreate, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    insumo = Insumo(
        codigo=gerar_codigo_sequencial(db, Insumo, prefixo="EST-", digitos=2),
        **dados.model_dump(),
    )
    db.add(insumo)
    db.commit()
    db.refresh(insumo)
    return insumo_para_dict(insumo)


@router.put("/{insumo_id}", response_model=InsumoResponse)
def atualizar_insumo(
    insumo_id: int, dados: InsumoUpdate, db: Session = Depends(get_db), _u=Depends(require_gerencia)
):
    insumo = db.get(Insumo, insumo_id)
    if not insumo:
        raise HTTPException(status_code=404, detail="Insumo não encontrado.")
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(insumo, campo, valor)
    db.commit()
    return insumo_para_dict(insumo)


@router.patch("/{insumo_id}/repor", response_model=InsumoResponse)
def repor_estoque(
    insumo_id: int,
    dados: InsumoRestock = InsumoRestock(),
    db: Session = Depends(get_db),
    _u=Depends(require_gerencia),
):
    """Botão '+20 Repor'. Também reativa produtos que tinham sido
    bloqueados automaticamente por falta desse insumo."""
    insumo = db.get(Insumo, insumo_id)
    if not insumo:
        raise HTTPException(status_code=404, detail="Insumo não encontrado.")
    insumo.quantidade = float(insumo.quantidade) + dados.quantidade_adicional
    sincronizar_produtos_que_usam_insumo(db, insumo)
    db.commit()
    db.refresh(insumo)
    return insumo_para_dict(insumo)


@router.delete("/{insumo_id}", status_code=204)
def excluir_insumo(insumo_id: int, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    insumo = db.get(Insumo, insumo_id)
    if not insumo:
        raise HTTPException(status_code=404, detail="Insumo não encontrado.")
    db.delete(insumo)
    db.commit()
