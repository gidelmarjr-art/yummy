import re
import unicodedata
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.categoria import Categoria
from app.models.produto import Produto
from app.schemas.categoria_schema import CategoriaCreate, CategoriaResponse, CategoriaUpdate
from app.security.dependencies import require_gerencia

router = APIRouter(prefix="/categorias", tags=["Categorias"])


def normalizar_slug(valor: str) -> str:
    normalizado = unicodedata.normalize("NFKD", valor).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", normalizado.lower()).strip("-")
    if not slug:
        raise HTTPException(status_code=422, detail="Informe um nome de categoria válido.")
    return slug


def _validar_unicidade(db: Session, slug: str, categoria_id: int | None = None):
    query = db.query(Categoria).filter(Categoria.slug == slug)
    if categoria_id:
        query = query.filter(Categoria.id != categoria_id)
    if query.first():
        raise HTTPException(status_code=409, detail="Já existe uma categoria com este identificador.")


@router.get("", response_model=List[CategoriaResponse])
def listar_categorias(incluir_inativas: bool = False, db: Session = Depends(get_db)):
    query = db.query(Categoria)
    if not incluir_inativas:
        query = query.filter(Categoria.ativo.is_(True))
    return query.order_by(Categoria.ordem, Categoria.nome).all()


@router.post("", response_model=CategoriaResponse, status_code=201)
def criar_categoria(dados: CategoriaCreate, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    slug = normalizar_slug(dados.slug or dados.nome)
    _validar_unicidade(db, slug)
    ordem = dados.ordem
    if ordem is None:
        ordem = (db.query(Categoria.ordem).order_by(Categoria.ordem.desc()).first() or [0])[0] + 1
    categoria = Categoria(nome=dados.nome.strip(), slug=slug, icone=dados.icone, ordem=ordem, ativo=dados.ativo)
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria


@router.put("/{categoria_id}", response_model=CategoriaResponse)
def atualizar_categoria(categoria_id: int, dados: CategoriaUpdate, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    categoria = db.get(Categoria, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada.")
    if dados.nome is not None:
        categoria.nome = dados.nome.strip()
    if dados.slug is not None:
        novo_slug = normalizar_slug(dados.slug)
        _validar_unicidade(db, novo_slug, categoria_id)
        if novo_slug != categoria.slug and db.query(Produto).filter(Produto.categoria == categoria.slug).first():
            raise HTTPException(status_code=409, detail="Não é possível mudar o slug enquanto houver pratos nesta categoria.")
        categoria.slug = novo_slug
    if dados.icone is not None:
        categoria.icone = dados.icone
    if dados.ordem is not None:
        categoria.ordem = dados.ordem
    if dados.ativo is not None:
        categoria.ativo = dados.ativo
    db.commit()
    db.refresh(categoria)
    return categoria


@router.delete("/{categoria_id}", status_code=204)
def excluir_categoria(categoria_id: int, db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    categoria = db.get(Categoria, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada.")
    if db.query(Produto).filter(Produto.categoria == categoria.slug).first():
        raise HTTPException(status_code=409, detail="Não é possível apagar uma categoria que ainda possui pratos.")
    db.delete(categoria)
    db.commit()
