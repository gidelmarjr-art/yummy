from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.sessao import Sessao
from app.models.usuario import Usuario
from app.schemas.seguranca_schema import AlterarSenhaInput, SessaoResponse
from app.security.auth import gerar_hash_senha, verificar_senha
from app.security.dependencies import get_current_usuario

router = APIRouter(prefix="/seguranca", tags=["Segurança"])


@router.post("/alterar-senha")
def alterar_senha(
    dados: AlterarSenhaInput,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_usuario),
):
    if not verificar_senha(dados.senha_atual, usuario.senha):
        raise HTTPException(status_code=400, detail="Senha atual incorreta.")

    usuario.senha = gerar_hash_senha(dados.nova_senha)
    db.commit()
    return {"detail": "Senha atualizada com sucesso."}


@router.get("/sessoes", response_model=List[SessaoResponse])
def listar_sessoes(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_usuario),
):
    sessoes = (
        db.query(Sessao)
        .filter(Sessao.usuario_id == usuario.id, Sessao.ativo.is_(True))
        .order_by(Sessao.criado_em.desc())
        .all()
    )
    return [
        SessaoResponse(
            id=s.id,
            device=s.dispositivo or "Dispositivo desconhecido",
            location=s.localizacao or "Origem desconhecida",
            active=(idx == 0),  # a mais recente é considerada "este dispositivo"
        )
        for idx, s in enumerate(sessoes)
    ]


@router.delete("/sessoes/{sessao_id}")
def revogar_sessao(
    sessao_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_usuario),
):
    sessao = (
        db.query(Sessao)
        .filter(Sessao.id == sessao_id, Sessao.usuario_id == usuario.id)
        .first()
    )
    if not sessao:
        raise HTTPException(status_code=404, detail="Sessão não encontrada.")
    sessao.ativo = False
    db.commit()
    return {"detail": "Sessão encerrada."}
