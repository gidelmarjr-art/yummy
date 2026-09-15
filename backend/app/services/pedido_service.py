from sqlalchemy.orm import Session

from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.transacao import Transacao

PROXIMO_STATUS = {
    "Novos": "Em preparo",
    "Em preparo": "Prontos",
    "Prontos": "Entregues",
    "Entregues": "Concluídos",
}

STATUS_QUE_BAIXA_ESTOQUE = {"Em preparo"}
STATUS_QUE_GERA_TRANSACAO = {"Concluídos"}


def proximo_status(status_atual: str) -> str:
    return PROXIMO_STATUS.get(status_atual, "Concluídos")


def calcular_total(itens: list[ItemPedido]) -> float:
    return round(sum(float(i.preco_unitario) * i.quantidade for i in itens), 2)


def criar_transacao_se_necessario(db: Session, pedido: Pedido) -> Transacao | None:
    if pedido.status not in STATUS_QUE_GERA_TRANSACAO:
        return None
    if pedido.transacao is not None:
        return pedido.transacao

    transacao = Transacao(
        pedido_id=pedido.id,
        valor=pedido.total,
        forma_pagamento=pedido.forma_pagamento or "Dinheiro",
        status="Aprovado",
        canal=pedido.canal,
    )
    db.add(transacao)
    return transacao


def pedido_para_payload_realtime(pedido: Pedido) -> dict:
    return {
        "id": pedido.codigo,
        "customer": pedido.cliente_nome,
        "summary": ", ".join(f"{i.quantidade}x {i.nome_produto}" for i in pedido.itens),
        "status": pedido.status,
        "total": f"R$ {float(pedido.total):.2f}".replace(".", ","),
    }
