import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.sessao import Sessao
from app.models.usuario import Usuario
from app.schemas.usuario_schema import (
    FuncionarioCreate,
    UsuarioCreate,
    UsuarioMeResponse,
    UsuarioResponse,
)
from app.security.auth import (
    JWTError,
    decodificar_token,
    gerar_hash_senha,
    gerar_token_jwt,
    verificar_senha,
)
from app.security.dependencies import bearer_scheme, get_current_usuario, require_perfil

router = APIRouter(prefix="/auth", tags=["Autenticação"])


class LoginSchema(BaseModel):
    usuario: str
    senha: str


@router.post("/cadastrar", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_usuario(dados: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.usuario == dados.usuario).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="Usuário já cadastrado.")

    novo_usuario = Usuario(
        usuario=dados.usuario,
        senha=gerar_hash_senha(dados.senha),
        nome_completo=dados.nome_completo,
        telefone=dados.telefone,
        cpf=dados.cpf,
        endereco=dados.endereco,
        perfil="cliente",
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario


@router.post("/funcionarios", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_funcionario(
    dados: FuncionarioCreate,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(require_perfil("admin")),
):
    """Cria uma conta de equipe (gerente/cozinha/caixa/garçom). Só um
    admin já logado pode criar outras contas de equipe."""
    db_usuario = db.query(Usuario).filter(Usuario.usuario == dados.usuario).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="Usuário já cadastrado.")

    novo_usuario = Usuario(
        usuario=dados.usuario,
        senha=gerar_hash_senha(dados.senha),
        nome_completo=dados.nome_completo,
        telefone=dados.telefone,
        perfil=dados.perfil,
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario


@router.post("/login", summary="Realizar login do usuário")
def login(dados_login: LoginSchema, request: Request, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.usuario == dados_login.usuario).first()

    if not usuario or not verificar_senha(dados_login.senha, usuario.senha):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
        )

    sid = uuid.uuid4().hex
    sessao = Sessao(
        usuario_id=usuario.id,
        sid=sid,
        dispositivo=request.headers.get("user-agent", "Dispositivo desconhecido"),
        localizacao=f"IP {request.client.host}" if request.client else "Origem desconhecida",
    )
    db.add(sessao)
    db.commit()

    token = gerar_token_jwt({"sub": usuario.usuario, "perfil": usuario.perfil, "sid": sid})
    return {"access_token": token, "token_type": "bearer", "perfil": usuario.perfil}


@router.post("/logout")
def logout(
    credenciais=Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    try:
        payload = decodificar_token(credenciais.credentials)
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido.")

    sid = payload.get("sid")
    if sid:
        sessao = db.query(Sessao).filter(Sessao.sid == sid).first()
        if sessao:
            sessao.ativo = False
            db.commit()
    return {"detail": "Sessão encerrada."}


@router.get("/me", response_model=UsuarioMeResponse)
def meus_dados(usuario: Usuario = Depends(get_current_usuario)):
    return usuario
