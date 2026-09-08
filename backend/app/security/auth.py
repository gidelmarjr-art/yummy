from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def gerar_hash_senha(senha: str):
    """Recebe uma senha em texto puro e devolve um hash embaralhado"""
    return pwd_context.hash(senha)

def verificar_senha(senha_pura: str, senha_hash: str):
    """Compara a senha digitada no login com o hash salvo no banco"""
    return pwd_context.verify(senha_pura, senha_hash)