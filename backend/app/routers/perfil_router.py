"""
Perfil do cliente logado: dados pessoais, endereços, cartões (só referência)
e favoritos. Todas as rotas exigem login e só enxergam/alteram dados do
PRÓPRIO usuário — o id do dono sempre vem do token, nunca do que o front manda.
"""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cartao_salvo import CartaoSalvo
from app.models.endereco import Endereco
from app.models.favorito import Favorito
from app.models.produto import Produto
from app.models.usuario import Usuario
from app.schemas.perfil_schema import (
    CartaoCreate,
    CartaoResponse,
    EnderecoCreate,
    EnderecoResponse,
    FavoritoResponse,
    PerfilResponse,
    PerfilUpdate,
)
from app.security.dependencies import get_current_usuario

router = APIRouter(prefix="/perfil", tags=["Perfil do cliente"])

MAX_ENDERECOS = 20
MAX_CARTOES = 10


# ---------------------------------------------------------------- dados pessoais
@router.get("", response_model=PerfilResponse)
def obter_perfil(usuario: Usuario = Depends(get_current_usuario)):
    return usuario


@router.put("", response_model=PerfilResponse)
def atualizar_perfil(
    dados: PerfilUpdate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_usuario),
):
    # O e-mail (usuario) é o login e fica de fora de propósito.
    usuario.nome_completo = dados.nome_completo
    usuario.telefone = (dados.telefone or "").strip() or None
    usuario.data_nascimento = dados.data_nascimento
    db.commit()
    db.refresh(usuario)
    return usuario


# --------------------------------------------------------------------- endereços
@router.get("/enderecos", response_model=List[EnderecoResponse])
def listar_enderecos(db: Session = Depends(get_db), usuario: Usuario = Depends(get_current_usuario)):
    return db.query(Endereco).filter(Endereco.usuario_id == usuario.id).order_by(Endereco.id).all()


@router.post("/enderecos", response_model=EnderecoResponse, status_code=201)
def criar_endereco(
    dados: EnderecoCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_usuario),
):
    total = db.query(Endereco).filter(Endereco.usuario_id == usuario.id).count()
    if total >= MAX_ENDERECOS:
        raise HTTPException(status_code=400, detail=f"Limite de {MAX_ENDERECOS} endereços atingido.")
    endereco = Endereco(
        usuario_id=usuario.id,
        apelido=dados.apelido.strip(),
        rua=dados.rua.strip(),
        numero=dados.numero.strip(),
        complemento=(dados.complemento or "").strip() or None,
        cidade=dados.cidade.strip(),
    )
    db.add(endereco)
    db.commit()
    db.refresh(endereco)
    return endereco


@router.delete("/enderecos/{endereco_id}", status_code=204)
def excluir_endereco(
    endereco_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_usuario),
):
    endereco = (
        db.query(Endereco)
        .filter(Endereco.id == endereco_id, Endereco.usuario_id == usuario.id)
        .first()
    )
    if not endereco:
        raise HTTPException(status_code=404, detail="Endereço não encontrado.")
    db.delete(endereco)
    db.commit()
    return Response(status_code=204)


# ----------------------------------------------------------------------- cartões
@router.get("/cartoes", response_model=List[CartaoResponse])
def listar_cartoes(db: Session = Depends(get_db), usuario: Usuario = Depends(get_current_usuario)):
    return (
        db.query(CartaoSalvo).filter(CartaoSalvo.usuario_id == usuario.id).order_by(CartaoSalvo.id).all()
    )


@router.post("/cartoes", response_model=CartaoResponse, status_code=201)
def criar_cartao(
    dados: CartaoCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_usuario),
):
    total = db.query(CartaoSalvo).filter(CartaoSalvo.usuario_id == usuario.id).count()
    if total >= MAX_CARTOES:
        raise HTTPException(status_code=400, detail=f"Limite de {MAX_CARTOES} cartões atingido.")
    cartao = CartaoSalvo(usuario_id=usuario.id, final=dados.final, bandeira=dados.bandeira)
    db.add(cartao)
    db.commit()
    db.refresh(cartao)
    return cartao


@router.delete("/cartoes/{cartao_id}", status_code=204)
def excluir_cartao(
    cartao_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_usuario),
):
    cartao = (
        db.query(CartaoSalvo)
        .filter(CartaoSalvo.id == cartao_id, CartaoSalvo.usuario_id == usuario.id)
        .first()
    )
    if not cartao:
        raise HTTPException(status_code=404, detail="Cartão não encontrado.")
    db.delete(cartao)
    db.commit()
    return Response(status_code=204)


# --------------------------------------------------------------------- favoritos
@router.get("/favoritos", response_model=List[FavoritoResponse])
def listar_favoritos(db: Session = Depends(get_db), usuario: Usuario = Depends(get_current_usuario)):
    return db.query(Favorito).filter(Favorito.usuario_id == usuario.id).order_by(Favorito.id).all()


@router.put("/favoritos/{produto_id}", response_model=FavoritoResponse)
def favoritar(
    produto_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_usuario),
):
    """Idempotente: favoritar um prato que já é favorito não duplica nem dá erro."""
    if not db.query(Produto.id).filter(Produto.id == produto_id).first():
        raise HTTPException(status_code=404, detail="Prato não encontrado.")
    favorito = (
        db.query(Favorito)
        .filter(Favorito.usuario_id == usuario.id, Favorito.produto_id == produto_id)
        .first()
    )
    if not favorito:
        favorito = Favorito(usuario_id=usuario.id, produto_id=produto_id)
        db.add(favorito)
        db.commit()
        db.refresh(favorito)
    return favorito


@router.delete("/favoritos/{produto_id}", status_code=204)
def desfavoritar(
    produto_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_usuario),
):
    """Idempotente: desfavoritar algo que não era favorito também responde 204."""
    db.query(Favorito).filter(
        Favorito.usuario_id == usuario.id, Favorito.produto_id == produto_id
    ).delete()
    db.commit()
    return Response(status_code=204)