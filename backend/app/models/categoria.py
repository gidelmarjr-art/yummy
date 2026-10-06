from sqlalchemy import Boolean, Column, Integer, String

from app.database import Base


class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False, unique=True)
    slug = Column(String, nullable=False, unique=True, index=True)
    icone = Column(String, nullable=True)
    ordem = Column(Integer, nullable=False, default=0)
    ativo = Column(Boolean, nullable=False, default=True)
