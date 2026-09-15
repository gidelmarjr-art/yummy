from collections import defaultdict
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import extract, func
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.pedido import Pedido
from app.models.transacao import Transacao
from app.schemas.transacao_schema import TransacoesDashboard
from app.security.dependencies import require_gerencia

router = APIRouter(prefix="/transacoes", tags=["Transações"])

MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
CANAL_META = {
    "delivery": {"name": "App Yummy (Delivery)", "category": "Entregas Online", "bg": "#ffe8ec", "iconColor": "#ff4d6d"},
    "local": {"name": "Mesa / Balcão", "category": "Consumo Presencial", "bg": "#e8f0fe", "iconColor": "#4285f4"},
    "takeaway": {"name": "Retirada (Takeaway)", "category": "Pedidos para Levar", "bg": "#fff8e1", "iconColor": "#ffb300"},
}


def _moeda(valor: float) -> str:
    return f"R$ {valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


@router.get("", response_model=TransacoesDashboard)
def obter_dashboard_transacoes(db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    aprovadas = db.query(Transacao).filter(Transacao.status == "Aprovado")

    total_receita = aprovadas.with_entities(func.coalesce(func.sum(Transacao.valor), 0)).scalar()
    num_transacoes = aprovadas.count()
    ticket_medio = (float(total_receita) / num_transacoes) if num_transacoes else 0

    metrics = {
        "totalRevenue": _moeda(float(total_receita)),
        "numTransactions": f"{num_transacoes:,}".replace(",", "."),
        "averageTicket": _moeda(ticket_medio),
    }

    por_ano = (
        db.query(extract("year", Transacao.criado_em).label("ano"), func.sum(Transacao.valor))
        .filter(Transacao.status == "Aprovado")
        .group_by("ano")
        .order_by("ano")
        .all()
    )
    yearly_data = [{"year": str(int(ano)), "amount": float(valor)} for ano, valor in por_ano]

    ano_atual = datetime.utcnow().year
    por_mes = (
        db.query(extract("month", Transacao.criado_em).label("mes"), func.sum(Transacao.valor))
        .filter(Transacao.status == "Aprovado", extract("year", Transacao.criado_em) == ano_atual)
        .group_by("mes")
        .order_by("mes")
        .all()
    )
    monthly_map = {int(mes): float(valor) for mes, valor in por_mes}
    monthly_data = [{"year": MESES[m - 1], "revenue": monthly_map.get(m, 0)} for m in range(1, 13) if m in monthly_map] \
        or [{"year": MESES[datetime.utcnow().month - 1], "revenue": 0}]

    por_canal = (
        db.query(Transacao.canal, func.sum(Transacao.valor))
        .filter(Transacao.status == "Aprovado")
        .group_by(Transacao.canal)
        .all()
    )
    total_canais = sum(float(v) for _, v in por_canal) or 1
    channels_data = []
    for idx, (canal, valor) in enumerate(por_canal, start=1):
        meta = CANAL_META.get(canal, {"name": canal, "category": "Outro canal", "bg": "#eee", "iconColor": "#999"})
        fatia = float(valor) / total_canais * 100
        channels_data.append(
            {
                "id": idx,
                "name": meta["name"],
                "category": meta["category"],
                "value": _moeda(float(valor)),
                "percentage": f"{fatia:.0f}% do total",
                "isPositive": fatia >= 30,
                "bg": meta["bg"],
                "iconColor": meta["iconColor"],
                "type": canal,
            }
        )

    recentes = (
        db.query(Transacao)
        .options(joinedload(Transacao.pedido))
        .order_by(Transacao.criado_em.desc())
        .limit(5)
        .all()
    )
    recent_transactions = [
        {
            "id": f"#{t.id:04d}",
            "name": t.pedido.cliente_nome if t.pedido else "—",
            "price": _moeda(float(t.valor)),
            "status": t.forma_pagamento if t.status == "Aprovado" else t.status,
            "isPositive": t.status == "Aprovado",
        }
        for t in recentes
    ]

    return {
        "metrics": metrics,
        "yearlyData": yearly_data,
        "monthlyRevenueData": monthly_data,
        "channelsData": channels_data,
        "recentTransactions": recent_transactions,
    }
