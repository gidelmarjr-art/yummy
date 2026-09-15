from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.database import Base


class Insumo(Base):
    """Insumo de estoque (ex: Blend de Carne Bovina). O status (Estável/
    Baixo/Crítico) é calculado a partir da quantidade atual — não é
    armazenado, para nunca ficar desatualizado."""

    __tablename__ = "insumos"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True, index=True, nullable=False)
    nome = Column(String, nullable=False)
    categoria = Column(String, nullable=False)
    quantidade = Column(Numeric(10, 3), nullable=False, default=0)
    unidade = Column(String, nullable=False, default="un")  # kg | un | L
    custo_unitario = Column(Numeric(10, 2), nullable=False, default=0)
    limite_baixo = Column(Numeric(10, 3), nullable=False, default=20)
    limite_critico = Column(Numeric(10, 3), nullable=False, default=5)
    criado_em = Column(DateTime, default=datetime.utcnow)

    usado_em = relationship("ProdutoInsumo", back_populates="insumo")

    def calcular_status(self) -> str:
        qtd = float(self.quantidade)
        if qtd <= float(self.limite_critico):
            return "Crítico"
        if qtd <= float(self.limite_baixo):
            return "Baixo"
        return "Estável"
