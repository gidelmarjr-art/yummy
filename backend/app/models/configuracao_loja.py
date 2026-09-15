from sqlalchemy import Boolean, Column, Integer, String

from app.database import Base


class ConfiguracaoLoja(Base):
    """Configurações gerais do estabelecimento. Sempre uma única linha
    (id=1) — é criada automaticamente se não existir."""

    __tablename__ = "configuracao_loja"

    id = Column(Integer, primary_key=True)
    nome_loja = Column(String, nullable=False, default="Yummy")
    telefone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    endereco = Column(String, nullable=True)
    taxa_servico = Column(String, nullable=True, default="0%")

    alerta_novos_pedidos = Column(Boolean, nullable=False, default=True)
    relatorios_email = Column(Boolean, nullable=False, default=False)
    sons_alerta = Column(Boolean, nullable=False, default=True)
