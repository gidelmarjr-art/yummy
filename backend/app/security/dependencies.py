"""
Dependências de FastAPI para autenticação e controle de acesso por papel.

Uso típico numa rota:

    @router.get("/estoque")
    def listar_estoque(
        db: Session = Depends(get_db),
        usuario: Usuario = Depends(require_perfil("gerente", "admin")),
    ):
        ...
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.sessao import Sessao
from app.models.usuario import Usuario
from app.security.auth import JWTError, decodificar_token

bearer_scheme = HTTPBearer(auto_error=False)

CREDENCIAIS_INVALIDAS = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Credenciais inválidas ou sessão expirada.",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_usuario(
    credenciais: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    """Extrai e valida o usuário logado a partir do header Authorization: Bearer <token>."""
    if credenciais is None:
        raise CREDENCIAIS_INVALIDAS

    try:
        payload = decodificar_token(credenciais.credentials)
    except JWTError:
        raise CREDENCIAIS_INVALIDAS

    nome_usuario = payload.get("sub")
    sid = payload.get("sid")
    if not nome_usuario:
        raise CREDENCIAIS_INVALIDAS

    usuario = db.query(Usuario).filter(Usuario.usuario == nome_usuario).first()
    if not usuario:
        raise CREDENCIAIS_INVALIDAS

    # Se o token tem uma sessão associada, ela precisa continuar ativa
    # (permite "desconectar" um dispositivo na tela de Segurança).
    if sid:
        sessao = db.query(Sessao).filter(Sessao.sid == sid).first()
        if not sessao or not sessao.ativo:
            raise CREDENCIAIS_INVALIDAS

    return usuario


def require_perfil(*perfis_permitidos: str):
    """Fábrica de dependência: só libera a rota para os perfis informados."""

    def verificador(usuario: Usuario = Depends(get_current_usuario)) -> Usuario:
        if usuario.perfil not in perfis_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Esta operação exige um dos perfis: {', '.join(perfis_permitidos)}.",
            )
        return usuario

    return verificador


# Atalhos usados com frequência pelos dashboards da empresa
require_gerencia = require_perfil("gerente", "admin")
require_equipe_operacional = require_perfil("gerente", "admin", "cozinha", "caixa", "garcom")
