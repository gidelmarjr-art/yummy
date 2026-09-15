from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class InsumoCreate(BaseModel):
    nome: str
    categoria: str
    quantidade: float = Field(ge=0)
    unidade: str = "un"
    custo_unitario: float = Field(ge=0)
    limite_baixo: float = 20
    limite_critico: float = 5


class InsumoUpdate(BaseModel):
    nome: Optional[str] = None
    categoria: Optional[str] = None
    unidade: Optional[str] = None
    custo_unitario: Optional[float] = None
    limite_baixo: Optional[float] = None
    limite_critico: Optional[float] = None


class InsumoRestock(BaseModel):
    quantidade_adicional: float = Field(default=20, gt=0)


class InsumoResponse(BaseModel):
    id: int
    codigo: str
    nome: str
    categoria: str
    quantidade: float
    unidade: str
    custo_unitario: float
    status: str  # calculado: Estável | Baixo | Crítico
    criado_em: datetime

    class Config:
        from_attributes = True
