from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


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


class ProdutoCreate(BaseModel):
    nome: str
    categoria: str
    preco: float = Field(gt=0)
    status: str = "Em estoque"
    ficha_tecnica: List[FichaTecnicaItemInput] = []


class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    categoria: Optional[str] = None
    preco: Optional[float] = None
    status: Optional[str] = None
    ficha_tecnica: Optional[List[FichaTecnicaItemInput]] = None


class ProdutoResponse(BaseModel):
    id: int
    codigo: str
    nome: str
    categoria: str
    preco: float
    status: str
    criado_em: datetime
    ficha_tecnica: List[FichaTecnicaItem] = []

    class Config:
        from_attributes = True
