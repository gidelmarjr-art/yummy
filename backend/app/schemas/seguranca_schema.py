from datetime import datetime

from pydantic import BaseModel


class AlterarSenhaInput(BaseModel):
    senha_atual: str
    nova_senha: str


class SessaoResponse(BaseModel):
    id: int
    device: str
    location: str
    active: bool

    class Config:
        from_attributes = True
