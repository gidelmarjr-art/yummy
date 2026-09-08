from pydantic import BaseModel

class UsuarioCreate(BaseModel):
    usuario: str
    senha: str

class UsuarioResponse(BaseModel):
    id: int
    usuario: str
    perfil: str

    class Config:
        from_attributes = True