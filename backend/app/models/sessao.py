from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Sessao(Base):
    """
    Uma sessão de login. Cada JWT emitido carrega o `sid` de uma linha
    aqui, o que permite "desconectar" um dispositivo (tela de Segurança)
    sem precisar de uma blocklist de tokens: basta marcar ativo=False.
    """

    __tablename__ = "sessoes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    sid = Column(String, unique=True, index=True, nullable=False)
    dispositivo = Column(String, nullable=True)
    localizacao = Column(String, nullable=True)
    criado_em = Column(DateTime, default=datetime.utcnow)
    ultimo_acesso = Column(DateTime, default=datetime.utcnow)
    ativo = Column(Boolean, default=True, nullable=False)

    usuario = relationship("Usuario")
