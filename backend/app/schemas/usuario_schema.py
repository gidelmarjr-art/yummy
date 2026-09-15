from typing import Literal

from pydantic import BaseModel, EmailStr

PERFIS_FUNCIONARIO = Literal["gerente", "admin", "cozinha", "caixa", "garcom"]


class UsuarioCreate(BaseModel):
    usuario: EmailStr
    senha: str
    nome_completo: str
    telefone: str
    cpf: str
    endereco: str


class FuncionarioCreate(BaseModel):
    """Usado pelo endpoint protegido que cria contas de equipe (não-cliente)."""
    usuario: str
    senha: str
    nome_completo: str
    perfil: PERFIS_FUNCIONARIO
    telefone: str | None = None


class UsuarioResponse(BaseModel):
    id: int
    usuario: str
    perfil: str

    class Config:
        from_attributes = True


class UsuarioMeResponse(UsuarioResponse):
    nome_completo: str | None = None
    telefone: str | None = None