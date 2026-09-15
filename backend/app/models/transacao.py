from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.database import Base


class Transacao(Base):
    """Registro financeiro de um pedido concluído/pago. Alimenta as telas
    de Transações e Relatórios (faturamento, ticket médio, canal etc.)."""

    __tablename__ = "transacoes"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), unique=True, nullable=False)
    valor = Column(Numeric(10, 2), nullable=False)
    forma_pagamento = Column(String, nullable=False)  # Pix | Crédito | Débito | Dinheiro
    status = Column(String, nullable=False, default="Aprovado")  # Aprovado | Estornado | Cancelado | Pendente
    canal = Column(String, nullable=False)  # local | delivery | takeaway
    criado_em = Column(DateTime, default=datetime.utcnow)

    pedido = relationship("Pedido", back_populates="transacao")
