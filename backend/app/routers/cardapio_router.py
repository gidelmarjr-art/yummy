from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.insumo import Insumo
from app.models.produto import Produto
from app.models.produto_insumo import ProdutoInsumo
from app.schemas.produto_schema import ProdutoCreate, ProdutoResponse, ProdutoUpdate
from app.security.dependencies import require_gerencia
from app.services.estoque_service import gerar_codigo_sequencial

router = APIRouter(prefix="/cardapio", tags=["Cardápio"])


def _carregar(query):
    return query.options(
        joinedload(Produto.ficha_tecnica).joinedload(ProdutoInsumo.insumo)
    )


def _aplicar_ficha_tecnica(db: Session, produto: Produto, ficha_tecnica) -> None:
    for linha in list(produto.ficha_tecnica):
        db.delete(linha)
    for item in ficha_tecnica:
        insumo = db.get(Insumo, item.insumo_id)
        if not insumo:
            raise HTTPException(status_code=404, detail=f"Insumo {item.insumo_id} não encontrado.")
        db.add(
            ProdutoInsumo(
                produto=produto,
                insumo=insumo,
                quantidade_necessaria=item.quantidade_necessaria,
            )
        )


# Leitura é pública: tanto o dashboard da empresa quanto o cardápio do
# cliente final (self-checkout) precisam consultar os mesmos itens.
@router.get("", response_model=List[ProdutoResponse])
def listar_produtos(categoria: str | None = None, db: Session = Depends(get_db)):
    query = _carregar(db.query(Produto))
    if categoria:
        query = query.filter(Produto.categoria == categoria)
    return query.order_by(Produto.id).all()


@router.get("/{produto_id}", response_model=ProdutoResponse)
def obter_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = _carregar(db.query(Produto)).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return produto


# Escrita é restrita à gerência (usada pelas telas de Cardápio e Cadastro de Pratos).
@router.post("", response_model=ProdutoResponse, status_code=201)
def criar_produto(dados: ProdutoCreate, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    produto = Produto(
        codigo=gerar_codigo_sequencial(db, Produto),
        nome=dados.nome,
        categoria=dados.categoria,
        preco=dados.preco,
        status=dados.status,
    )
    db.add(produto)
    db.flush()
    _aplicar_ficha_tecnica(db, produto, dados.ficha_tecnica)
    db.commit()
    db.refresh(produto)
    return _carregar(db.query(Produto)).filter(Produto.id == produto.id).first()


@router.put("/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(
    produto_id: int, dados: ProdutoUpdate, db: Session = Depends(get_db), _u=Depends(require_gerencia)
):
    produto = db.get(Produto, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")

    if dados.nome is not None:
        produto.nome = dados.nome
    if dados.categoria is not None:
        produto.categoria = dados.categoria
    if dados.preco is not None:
        produto.preco = dados.preco
    if dados.status is not None:
        produto.status = dados.status
    if dados.ficha_tecnica is not None:
        _aplicar_ficha_tecnica(db, produto, dados.ficha_tecnica)

    db.commit()
    return _carregar(db.query(Produto)).filter(Produto.id == produto_id).first()


@router.patch("/{produto_id}/alternar-status", response_model=ProdutoResponse)
def alternar_status(produto_id: int, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    """Alterna rapidamente entre 'Em estoque' e 'Esgotado' (botão de toggle da tela)."""
    produto = db.get(Produto, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    produto.status = "Esgotado" if produto.status == "Em estoque" else "Em estoque"
    db.commit()
    return _carregar(db.query(Produto)).filter(Produto.id == produto_id).first()


@router.delete("/{produto_id}", status_code=204)
def excluir_produto(produto_id: int, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    produto = db.get(Produto, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    db.delete(produto)
    db.commit()


@router.delete("", status_code=204)
def excluir_por_categoria(categoria: str, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    """Usado pelo botão 'Apagar tudo' da categoria ativa no Cardápio."""
    produtos = db.query(Produto).filter(Produto.categoria == categoria).all()
    for produto in produtos:
        db.delete(produto)
    db.commit()
