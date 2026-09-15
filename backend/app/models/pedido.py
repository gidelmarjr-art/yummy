from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.database import Base


class Pedido(Base):
    """Um pedido (mesa, delivery ou takeaway). Os itens ficam em
    ItemPedido; o pagamento, quando concluído, gera uma Transacao."""

    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True, index=True, nullable=False)

    # Pedido pode vir de um cliente com conta (self-checkout) ou ser
    # lançado manualmente pelo balcão/garçom (cliente_id fica nulo).
    cliente_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    cliente_nome = Column(String, nullable=False)

    local = Column(String, nullable=False)  # "Mesa 04" | "Entrega (Rua das Flores, 12)"
    canal = Column(String, nullable=False, default="local")  # local | delivery | takeaway
    status = Column(String, nullable=False, default="Novos")
    forma_pagamento = Column(String, nullable=True)
    total = Column(Numeric(10, 2), nullable=False, default=0)

    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cliente = relationship("Usuario")
    itens = relationship("ItemPedido", back_populates="pedido", cascade="all, delete-orphan")
    transacao = relationship("Transacao", back_populates="pedido", uselist=False)
