from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

STATUS_VALIDOS = ["Novos", "Em preparo", "Prontos", "Entregues", "Concluídos", "Cancelado"]


class ItemPedidoInput(BaseModel):
    produto_id: Optional[int] = None
    nome_produto: str
    quantidade: int = Field(gt=0)
    preco_unitario: float = Field(ge=0)


class PedidoCreate(BaseModel):
    cliente_nome: str
    cliente_id: Optional[int] = None
    local: str
    canal: str = "local"  # local | delivery | takeaway
    forma_pagamento: Optional[str] = None
    itens: List[ItemPedidoInput]


class PedidoStatusUpdate(BaseModel):
    status: str


class ItemPedidoResponse(BaseModel):
    id: int
    produto_id: Optional[int]
    nome_produto: str
    quantidade: int
    preco_unitario: float

    class Config:
        from_attributes = True


class PedidoResponse(BaseModel):
    id: int
    codigo: str
    cliente_id: Optional[int]
    cliente_nome: str
    local: str
    canal: str
    status: str
    forma_pagamento: Optional[str]
    total: float
    criado_em: datetime
    atualizado_em: datetime
    itens: List[ItemPedidoResponse] = []

    class Config:
        from_attributes = True
