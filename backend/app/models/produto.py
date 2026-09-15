from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.database import Base


class Produto(Base):
    """Item do cardápio (ex: X-Burger). A composição de insumos fica em
    ProdutoInsumo (ficha técnica)."""

    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True, index=True, nullable=False)
    nome = Column(String, nullable=False)
    categoria = Column(String, nullable=False)
    preco = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False, default="Em estoque")  # "Em estoque" | "Esgotado"
    criado_em = Column(DateTime, default=datetime.utcnow)

    ficha_tecnica = relationship(
        "ProdutoInsumo", back_populates="produto", cascade="all, delete-orphan"
    )
