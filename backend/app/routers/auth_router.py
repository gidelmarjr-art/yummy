from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.usuario_schema import UsuarioCreate, UsuarioResponse
from app.models.usuario import Usuario
from app.security.auth import verificar_senha, gerar_token_jwt, gerar_hash_senha

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"]
)

@router.post("/cadastrar", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_usuario(dados: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.usuario == dados.usuario).first()
    if db_usuario:
        raise HTTPException(
            status_code=400,
            detail="Usuário já cadastrado."
        )
    
    senha_hash = gerar_hash_senha(dados.senha)
    
    # Criando o usuário com todos os campos do formulário preenchidos
    novo_usuario = Usuario(
        usuario=dados.usuario,
        senha=senha_hash,
        nome_completo=dados.nome_completo,
        telefone=dados.telefone,
        cpf=dados.cpf,
        endereco=dados.endereco,
        perfil="cliente"  # Garante o perfil padrão
    )
    
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    
    return novo_usuario

@router.post("/login", summary="Realizar login do usuário")
def login(dados_login: UsuarioCreate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.usuario == dados_login.usuario).first()
    
    if not usuario or not verificar_senha(dados_login.senha, usuario.senha):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos"
        )
    
    token = gerar_token_jwt({"sub": usuario.usuario})
    return {"access_token": token, "token_type": "bearer"}