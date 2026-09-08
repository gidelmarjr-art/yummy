from pydantic import BaseModel, EmailStr

class UsuarioCreate(BaseModel):
    usuario: EmailStr
    senha: str
    nome_completo: str
    telefone: str
    cpf: str
    endereco: str

class UsuarioResponse(BaseModel):
    id: int
    usuario: str
    perfil: str

    class Config:
        from_attributes = True