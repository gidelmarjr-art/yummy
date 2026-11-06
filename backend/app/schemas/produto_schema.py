from datetime import datetime
from typing import List, Optional

from urllib.parse import urlparse

from pydantic import BaseModel, Field, field_validator


class FichaTecnicaItemInput(BaseModel):
    insumo_id: int
    quantidade_necessaria: float = Field(gt=0)


class FichaTecnicaItem(BaseModel):
    insumo_id: int
    insumo_nome: str
    unidade: str
    quantidade_necessaria: float

    class Config:
        from_attributes = True


def _validar_link_imagem(v: Optional[str]) -> Optional[str]:
    """Aceita só links http(s) completos; vazio vira nulo (sem imagem)."""
    if v is None:
        return None
    v = v.strip()
    if not v:
        return None
    if len(v) > 500:
        raise ValueError("O link da imagem é longo demais (máximo 500 caracteres).")
    partes = urlparse(v)
    if partes.scheme not in ("http", "https") or not partes.netloc:
        raise ValueError("Informe o link completo da imagem, começando com http:// ou https://")
    return v


class ProdutoCreate(BaseModel):
    nome: str
    categoria: str
    preco: float = Field(gt=0)
    status: str = "Em estoque"
    imagem_url: Optional[str] = None
    descricao: Optional[str] = None
    ficha_tecnica: List[FichaTecnicaItemInput] = []

    _checa_imagem = field_validator("imagem_url")(_validar_link_imagem)


class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    categoria: Optional[str] = None
    preco: Optional[float] = None
    status: Optional[str] = None
    imagem_url: Optional[str] = None
    descricao: Optional[str] = None
    ficha_tecnica: Optional[List[FichaTecnicaItemInput]] = None

    _checa_imagem = field_validator("imagem_url")(_validar_link_imagem)


class ProdutoResponse(BaseModel):
    id: int
    codigo: str
    nome: str
    categoria: str
    preco: float
    status: str
    imagem_url: Optional[str] = None
    descricao: Optional[str] = None
    criado_em: datetime
    ficha_tecnica: List[FichaTecnicaItem] = []

    class Config:
        from_attributes = True
