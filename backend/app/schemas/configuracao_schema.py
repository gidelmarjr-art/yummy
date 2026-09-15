from typing import Optional

from pydantic import BaseModel


class ConfiguracaoLojaUpdate(BaseModel):
    nome_loja: str
    telefone: str
    email: str
    endereco: str
    taxa_servico: str
    alerta_novos_pedidos: bool
    relatorios_email: bool
    sons_alerta: bool


class ConfiguracaoLojaResponse(BaseModel):
    nome_loja: str
    telefone: Optional[str] = ""
    email: Optional[str] = ""
    endereco: Optional[str] = ""
    taxa_servico: Optional[str] = "0%"
    alerta_novos_pedidos: bool
    relatorios_email: bool
    sons_alerta: bool

    class Config:
        from_attributes = True
