from typing import Optional

from pydantic import BaseModel, Field


class CategoriaCreate(BaseModel):
    nome: str = Field(min_length=1, max_length=100)
    slug: Optional[str] = Field(default=None, max_length=100)
    icone: Optional[str] = Field(default=None, max_length=100)
    ordem: Optional[int] = Field(default=None, ge=0)
    ativo: bool = True


class CategoriaUpdate(BaseModel):
    nome: Optional[str] = Field(default=None, min_length=1, max_length=100)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=100)
    icone: Optional[str] = Field(default=None, max_length=100)
    ordem: Optional[int] = Field(default=None, ge=0)
    ativo: Optional[bool] = None


class CategoriaResponse(BaseModel):
    id: int
    nome: str
    slug: str
    icone: Optional[str]
    ordem: int
    ativo: bool

    class Config:
        from_attributes = True
