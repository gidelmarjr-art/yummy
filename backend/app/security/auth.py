"""
Núcleo de segurança: hashing de senha e emissão/leitura de JWT.

Este arquivo antes tinha código duplicado (funções redefinidas duas vezes,
um `return` órfão no meio do arquivo). Foi limpo para ter uma única fonte
de verdade por função.
"""
import os
from datetime import datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "sua_chave_secreta_aqui")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def gerar_hash_senha(senha: str) -> str:
    """Recebe uma senha em texto puro e devolve um hash embaralhado."""
    return pwd_context.hash(senha)


def verificar_senha(senha_plana: str, senha_hash: str) -> bool:
    """Compara a senha digitada no login com o hash salvo no banco."""
    return pwd_context.verify(senha_plana, senha_hash)


def gerar_token_jwt(dados: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    """Gera um JWT a partir de um dicionário de claims (ex: sub, perfil, sid)."""
    para_codificar = dados.copy()
    expiracao = datetime.utcnow() + timedelta(minutes=expires_minutes)
    para_codificar.update({"exp": expiracao})
    return jwt.encode(para_codificar, SECRET_KEY, algorithm=ALGORITHM)


def decodificar_token(token: str) -> dict:
    """Decodifica e valida um JWT. Levanta jose.JWTError se inválido/expirado."""
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


__all__ = [
    "JWTError",
    "gerar_hash_senha",
    "verificar_senha",
    "gerar_token_jwt",
    "decodificar_token",
]
