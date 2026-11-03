from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator


class PerfilResponse(BaseModel):
    id: int
    usuario: str  # e-mail de login (não editável aqui)
    perfil: str
    nome_completo: str | None = None
    telefone: str | None = None
    data_nascimento: date | None = None

    class Config:
        from_attributes = True


class PerfilUpdate(BaseModel):
    nome_completo: str = Field(min_length=1, max_length=120)
    telefone: str | None = Field(default=None, max_length=30)
    data_nascimento: date | None = None

    @field_validator("nome_completo")
    @classmethod
    def _nome_sem_espacos_nas_pontas(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Informe o nome completo.")
        return v

    @field_validator("data_nascimento")
    @classmethod
    def _nascimento_no_passado(cls, v: date | None) -> date | None:
        if v is not None and v > date.today():
            raise ValueError("A data de nascimento não pode estar no futuro.")
        return v


class EnderecoCreate(BaseModel):
    apelido: str = Field(min_length=1, max_length=40)
    rua: str = Field(min_length=1, max_length=160)
    numero: str = Field(min_length=1, max_length=20)
    complemento: str | None = Field(default=None, max_length=80)
    cidade: str = Field(min_length=1, max_length=80)


class EnderecoResponse(EnderecoCreate):
    id: int

    class Config:
        from_attributes = True


class CartaoCreate(BaseModel):
    # Apenas os 4 últimos dígitos: número completo é recusado de propósito.
    final: str = Field(pattern=r"^\d{4}$")
    bandeira: str | None = Field(default=None, max_length=30)


class CartaoResponse(BaseModel):
    id: int
    final: str
    bandeira: str | None = None

    class Config:
        from_attributes = True


class FavoritoResponse(BaseModel):
    produto_id: int
    criado_em: datetime | None = None

    class Config:
        from_attributes = True