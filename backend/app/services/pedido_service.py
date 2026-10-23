from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.produto import Produto
from app.models.transacao import Transacao
from app.models.usuario import Usuario

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


def cancelar_pedido_service(db: Session, pedido: Pedido, usuario: Usuario, motivo: str | None = None) -> Pedido:
    """
    Regra de negócio centralizada para cancelamento de pedidos.
    Valida permissões, status permitidos e estorna o estoque se necessário.
    """
    if pedido.status == "Cancelado":
        raise HTTPException(status_code=400, detail="Este pedido já está cancelado.")
    
    if pedido.status in {"Entregues", "Concluídos"}:
        raise HTTPException(status_code=400, detail="Não é possível cancelar um pedido que já foi entregue ou concluído.")

    is_cliente = usuario.id == pedido.cliente_id
    
    if is_cliente:
        if pedido.status != "Novos":
            raise HTTPException(
                status_code=403, 
                detail="Seu pedido já começou a ser preparado e não pode mais ser cancelado por aqui. Entre em contato com o estabelecimento."
            )

    # Se o pedido já havia baixado o estoque (estava em "Em preparo"), devolvemos os itens
    if pedido.status in STATUS_QUE_BAIXA_ESTOQUE:
        for item in pedido.itens:
            if item.produto_id:
                produto = db.get(Produto, item.produto_id)
                if produto:
                    produto.quantidade_estoque += item.quantidade
                    if produto.status == "Esgotado" and produto.quantidade_estoque > 0:
                        produto.status = "Em estoque"

    pedido.status = "Cancelado"
    
    db.commit()
    db.refresh(pedido)
    return pedido


def pedido_para_payload_realtime(pedido: Pedido) -> dict:
    return {
        "id": pedido.codigo,
        "customer": pedido.cliente_nome,
        "summary": ", ".join(f"{i.quantidade}x {i.nome_produto}" for i in pedido.itens),
        "status": pedido.status,
        "total": f"R$ {float(pedido.total):.2f}".replace(".", ","),
    }