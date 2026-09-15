from sqlalchemy import Column, ForeignKey, Integer, Numeric
from sqlalchemy.orm import relationship

from app.database import Base


class ProdutoInsumo(Base):
    """Uma linha da ficha técnica: quanto de um insumo é gasto ao vender
    1 unidade de um produto. Ex: 1x X-Burger -> 150g de Carne."""

    __tablename__ = "produto_insumos"

    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    insumo_id = Column(Integer, ForeignKey("insumos.id"), nullable=False)
    quantidade_necessaria = Column(Numeric(10, 3), nullable=False)

    produto = relationship("Produto", back_populates="ficha_tecnica")
    insumo = relationship("Insumo", back_populates="usado_em")

    @property
    def insumo_nome(self) -> str:
        return self.insumo.nome

    @property
    def unidade(self) -> str:
        return self.insumo.unidade
