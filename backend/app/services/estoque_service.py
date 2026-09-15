import random
from typing import Optional

from sqlalchemy.orm import Session

from app.models.insumo import Insumo
from app.models.produto import Produto


def gerar_codigo_sequencial(db: Session, model, campo="codigo", prefixo="", digitos=3) -> str:
    """Gera um código curto tipo '131.' ou 'EST-07', olhando pro maior já
    existente do mesmo formato pra não colidir."""
    total = db.query(model).count()
    numero = 100 + total + random.randint(0, 8)
    if prefixo:
        return f"{prefixo}{numero:0{digitos}d}"
    return f"{numero}."


def insumo_para_dict(insumo: Insumo) -> dict:
    return {
        "id": insumo.id,
        "codigo": insumo.codigo,
        "nome": insumo.nome,
        "categoria": insumo.categoria,
        "quantidade": float(insumo.quantidade),
        "unidade": insumo.unidade,
        "custo_unitario": float(insumo.custo_unitario),
        "status": insumo.calcular_status(),
        "criado_em": insumo.criado_em,
    }


def baixar_estoque_por_produto(db: Session, produto: Optional[Produto], quantidade_vendida: int) -> None:
    """Dá baixa nos insumos da ficha técnica de um produto vendido.
    Se um insumo ficar negativo, trava em zero (não deixa passar do fundo do poço)."""
    if produto is None:
        return
    for linha in produto.ficha_tecnica:
        insumo = linha.insumo
        consumo = float(linha.quantidade_necessaria) * quantidade_vendida
        nova_quantidade = float(insumo.quantidade) - consumo
        insumo.quantidade = max(0, nova_quantidade)
        db.add(insumo)
    sincronizar_disponibilidade_produto(produto)
    db.add(produto)


def produto_tem_insumo_suficiente(produto: Produto, quantidade: int = 1) -> bool:
    for linha in produto.ficha_tecnica:
        if float(linha.insumo.quantidade) < float(linha.quantidade_necessaria) * quantidade:
            return False
    return True


def sincronizar_disponibilidade_produto(produto: Produto) -> None:
    """Bloqueio automático (README): se faltar insumo pra fazer mais 1
    unidade, o produto some do cardápio sozinho. Só reativa produtos que
    tinham sido bloqueados automaticamente por falta de estoque — se
    alguém marcou "Esgotado" na mão sem ficha técnica, isso não mexe."""
    if not produto.ficha_tecnica:
        return
    if not produto_tem_insumo_suficiente(produto):
        produto.status = "Esgotado"
    elif produto.status == "Esgotado":
        produto.status = "Em estoque"


def sincronizar_produtos_que_usam_insumo(db: Session, insumo: Insumo) -> None:
    """Chamado após repor um insumo: reativa produtos que estavam
    bloqueados só por causa dele."""
    for linha in insumo.usado_em:
        sincronizar_disponibilidade_produto(linha.produto)
        db.add(linha.produto)
