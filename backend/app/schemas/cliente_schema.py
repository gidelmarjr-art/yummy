from typing import List, Optional

from pydantic import BaseModel


class ClienteResumo(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    ordersCount: int


class ClienteDetalhe(ClienteResumo):
    endereco: Optional[str] = None
    cpf: Optional[str] = None


class ClientesResponse(BaseModel):
    clientes: List[ClienteResumo]
