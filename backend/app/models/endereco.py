from sqlalchemy import Column, ForeignKey, Integer, String

from app.database import Base


class Endereco(Base):
    """Endereço de entrega salvo pelo cliente (tela Perfil > Endereços)."""

    __tablename__ = "enderecos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(
        Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False, index=True
    )
    apelido = Column(String, nullable=False)  # "Casa", "Trabalho"...
    rua = Column(String, nullable=False)
    numero = Column(String, nullable=False)
    complemento = Column(String, nullable=True)
    cidade = Column(String, nullable=False)