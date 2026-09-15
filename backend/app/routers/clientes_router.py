from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pedido import Pedido
from app.models.usuario import Usuario
from app.schemas.cliente_schema import ClienteDetalhe, ClienteResumo
from app.security.dependencies import require_gerencia

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("", response_model=List[ClienteResumo])
def listar_clientes(db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    contagem = (
        db.query(Pedido.cliente_id, func.count(Pedido.id).label("total"))
        .filter(Pedido.cliente_id.isnot(None))
        .group_by(Pedido.cliente_id)
        .all()
    )
    pedidos_por_cliente = {c.cliente_id: c.total for c in contagem}

    clientes = db.query(Usuario).filter(Usuario.perfil == "cliente").order_by(Usuario.id).all()
    return [
        ClienteResumo(
            id=c.id,
            name=c.nome_completo or c.usuario,
            email=c.usuario,
            phone=c.telefone or "—",
            ordersCount=pedidos_por_cliente.get(c.id, 0),
        )
        for c in clientes
    ]


@router.get("/{cliente_id}", response_model=ClienteDetalhe)
def obter_cliente(cliente_id: int, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    cliente = db.get(Usuario, cliente_id)
    if not cliente or cliente.perfil != "cliente":
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")

    total_pedidos = db.query(func.count(Pedido.id)).filter(Pedido.cliente_id == cliente_id).scalar()

    return ClienteDetalhe(
        id=cliente.id,
        name=cliente.nome_completo or cliente.usuario,
        email=cliente.usuario,
        phone=cliente.telefone or "—",
        ordersCount=total_pedidos or 0,
        endereco=cliente.endereco,
        cpf=cliente.cpf,
    )
