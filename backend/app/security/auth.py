from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def gerar_hash_senha(senha: str):
    """Recebe uma senha em texto puro e devolve um hash embaralhado"""
    return pwd_context.hash(senha)

def verificar_senha(senha_pura: str, senha_hash: str):
    """Compara a senha digitada no login com o hash salvo no banco"""
    return pwd_context.verify(senha_pura, senha_hash)

    from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "sua_chave_secreta_aqui"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def gerar_hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)

def verificar_senha(senha_plana: str, senha_hashed: str) -> bool:
    return pwd_context.verify(senha_plana, senha_hashed)

def gerar_token_jwt(dados: dict) -> str:
    para_codificar = dados.copy()
    expiracao = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    para_codificar.update({"exp": expiracao})
    return jwt.encode(para_codificar, SECRET_KEY, algorithm=ALGORITHM)