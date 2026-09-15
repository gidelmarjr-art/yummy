from sqlalchemy import Column, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.database import Base


class ItemPedido(Base):
    """Uma linha de um pedido. Guarda nome/preço no momento da venda
    (snapshot), pra não mudar o histórico se o produto for editado depois."""

    __tablename__ = "itens_pedido"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)
    nome_produto = Column(String, nullable=False)
    quantidade = Column(Integer, nullable=False, default=1)
    preco_unitario = Column(Numeric(10, 2), nullable=False)

    pedido = relationship("Pedido", back_populates="itens")
    produto = relationship("Produto")
