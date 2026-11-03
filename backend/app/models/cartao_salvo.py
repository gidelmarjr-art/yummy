from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.database import Base


class CartaoSalvo(Base):
    """
    Referência a um cartão do cliente (tela Perfil > Pagamentos).

    IMPORTANTE: guarda SOMENTE os 4 últimos dígitos e a bandeira. O número
    completo, a validade e o CVV nunca são enviados nem gravados aqui — para
    cobrar de verdade seria preciso um gateway de pagamento (que devolve um
    token), não este cadastro.
    """

    __tablename__ = "cartoes_salvos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(
        Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False, index=True
    )
    final = Column(String(4), nullable=False)
    bandeira = Column(String, nullable=True)
    criado_em = Column(DateTime, default=datetime.utcnow)