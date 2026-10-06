from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.produto import Produto
from app.models.usuario import Usuario
from app.realtime import manager
from app.schemas.pedido_schema import PedidoClienteCreate, PedidoCreate, PedidoResponse, PedidoStatusUpdate
from app.security.dependencies import get_current_usuario, require_equipe_operacional, require_gerencia
from app.services.estoque_service import baixar_estoque_por_produto, gerar_codigo_sequencial
from app.services.pedido_service import (
    STATUS_QUE_BAIXA_ESTOQUE,
    calcular_total,
    criar_transacao_se_necessario,
    pedido_para_payload_realtime,
    proximo_status,
)

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def _carregar(query):
    return query.options(joinedload(Pedido.itens))


async def _criar_pedido(db: Session, cliente_id, cliente_nome, local, canal, forma_pagamento, itens_recebidos):
    pedido = Pedido(
        codigo=gerar_codigo_sequencial(db, Pedido), cliente_id=cliente_id,
        cliente_nome=cliente_nome, local=local, canal=canal,
        forma_pagamento=forma_pagamento, status="Novos",
    )
    db.add(pedido)
    db.flush()
    itens = []
    for item in itens_recebidos:
        itens.append(ItemPedido(
            pedido_id=pedido.id, produto_id=item.produto_id, nome_produto=item.nome_produto,
            quantidade=item.quantidade, preco_unitario=item.preco_unitario,
        ))
    db.add_all(itens)
    db.flush()
    pedido.itens = itens
    pedido.total = calcular_total(itens)
    db.commit()
    db.refresh(pedido)
    await manager.broadcast("dashboard", {"novoPedido": pedido_para_payload_realtime(pedido)})
    return pedido


@router.get("", response_model=List[PedidoResponse])
def listar_pedidos(
    status_filtro: str | None = None,
    db: Session = Depends(get_db),
    _u: Usuario = Depends(require_equipe_operacional),
):
    query = _carregar(db.query(Pedido))
    if status_filtro:
        query = query.filter(Pedido.status == status_filtro)
    return query.order_by(Pedido.criado_em.desc()).all()


@router.get("/meu", response_model=List[PedidoResponse])
def listar_meus_pedidos(db: Session = Depends(get_db), usuario: Usuario = Depends(get_current_usuario)):
    return _carregar(db.query(Pedido)).filter(Pedido.cliente_id == usuario.id).order_by(Pedido.criado_em.desc()).all()


@router.get("/meu/{pedido_id}", response_model=PedidoResponse)
def obter_meu_pedido(pedido_id: int, db: Session = Depends(get_db), usuario: Usuario = Depends(get_current_usuario)):
    pedido = _carregar(db.query(Pedido)).filter(Pedido.id == pedido_id, Pedido.cliente_id == usuario.id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")
    return pedido


@router.post("/meu", response_model=PedidoResponse, status_code=201)
async def criar_meu_pedido(dados: PedidoClienteCreate, db: Session = Depends(get_db), usuario: Usuario = Depends(get_current_usuario)):
    """Checkout do cliente: o cliente e os preços vêm do servidor, nunca do navegador."""
    itens_validados = []
    for item in dados.itens:
        if not item.produto_id:
            raise HTTPException(status_code=422, detail="Cada item do pedido precisa identificar um produto.")
        produto = db.get(Produto, item.produto_id)
        if not produto or produto.status != "Em estoque":
            raise HTTPException(status_code=422, detail=f"Produto indisponível: {item.nome_produto}.")
        itens_validados.append(ItemPedido(
            produto_id=produto.id, nome_produto=produto.nome, quantidade=item.quantidade,
            preco_unitario=produto.preco,
        ))
    return await _criar_pedido(db, usuario.id, usuario.nome_completo or usuario.usuario, dados.local, "app", dados.forma_pagamento, itens_validados)


@router.get("/{pedido_id}", response_model=PedidoResponse)
def obter_pedido(
    pedido_id: int, db: Session = Depends(get_db), _u: Usuario = Depends(require_equipe_operacional)
):
    pedido = _carregar(db.query(Pedido)).filter(Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")
    return pedido


@router.post("", response_model=PedidoResponse, status_code=201)
async def criar_pedido(
    dados: PedidoCreate,
    db: Session = Depends(get_db),
    _u: Usuario = Depends(require_equipe_operacional),
):
    """Lançamento manual de pedido (balcão/garçom). O checkout do cliente
    final via QR Code/app usa este mesmo endpoint mais adiante."""
    return await _criar_pedido(db, dados.cliente_id, dados.cliente_nome, dados.local, dados.canal, dados.forma_pagamento, dados.itens)


@router.patch("/{pedido_id}/avancar", response_model=PedidoResponse)
async def avancar_status(
    pedido_id: int,
    db: Session = Depends(get_db),
    _u: Usuario = Depends(require_equipe_operacional),
):
    """Move o pedido pro próximo status do fluxo (Novos -> Em preparo ->
    Prontos -> Entregues -> Concluídos), dando baixa no estoque e
    gerando a transação financeira nos momentos certos."""
    pedido = _carregar(db.query(Pedido)).filter(Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")

    novo_status = proximo_status(pedido.status)
    pedido.status = novo_status

    if novo_status in STATUS_QUE_BAIXA_ESTOQUE:
        for item in pedido.itens:
            if item.produto_id:
                produto = db.get(Produto, item.produto_id)
                baixar_estoque_por_produto(db, produto, item.quantidade)

    criar_transacao_se_necessario(db, pedido)

    db.commit()
    db.refresh(pedido)

    await manager.broadcast("dashboard", {"pedidoAtualizado": pedido_para_payload_realtime(pedido)})
    return pedido


@router.patch("/{pedido_id}/status", response_model=PedidoResponse)
async def definir_status(
    pedido_id: int,
    dados: PedidoStatusUpdate,
    db: Session = Depends(get_db),
    _u: Usuario = Depends(require_equipe_operacional),
):
    """Define um status específico diretamente (ex: 'Cancelado')."""
    pedido = _carregar(db.query(Pedido)).filter(Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")

    pedido.status = dados.status
    if dados.status in STATUS_QUE_BAIXA_ESTOQUE:
        for item in pedido.itens:
            if item.produto_id:
                produto = db.get(Produto, item.produto_id)
                baixar_estoque_por_produto(db, produto, item.quantidade)
    criar_transacao_se_necessario(db, pedido)

    db.commit()
    db.refresh(pedido)
    await manager.broadcast("dashboard", {"pedidoAtualizado": pedido_para_payload_realtime(pedido)})
    return pedido


@router.delete("/{pedido_id}", status_code=204)
def excluir_pedido(
    pedido_id: int, db: Session = Depends(get_db), _u: Usuario = Depends(require_gerencia)
):
    pedido = db.get(Pedido, pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")
    db.delete(pedido)
    db.commit()
