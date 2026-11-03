from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint

from app.database import Base


class Favorito(Base):
    """Prato favoritado por um cliente (coração no cardápio)."""

    __tablename__ = "favoritos"
    __table_args__ = (UniqueConstraint("usuario_id", "produto_id", name="uq_favorito_usuario_produto"),)

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(
        Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False, index=True
    )
    produto_id = Column(
        Integer, ForeignKey("produtos.id", ondelete="CASCADE"), nullable=False, index=True
    )
    criado_em = Column(DateTime, default=datetime.utcnow)