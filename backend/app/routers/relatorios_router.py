from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pedido import Pedido
from app.models.transacao import Transacao
from app.schemas.relatorio_schema import RelatoriosDashboard
from app.security.dependencies import require_gerencia

router = APIRouter(prefix="/relatorios", tags=["Relatórios"])

DIAS_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]
MESES_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
CORES_PAGAMENTO = {
    "Crédito": "#ff4d00",
    "Pix": "#ffaa00",
    "Débito": "#fce4d6",
    "Dinheiro": "#e63900",
}


def _percentual(numerador: int, denominador: int) -> float:
    return round((numerador / denominador) * 100, 1) if denominador else 0.0


@router.get("", response_model=RelatoriosDashboard)
def obter_relatorios(db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    # --- Métricas operacionais ---
    # Observação: como ainda não guardamos o timestamp de cada transição de
    # status separadamente, o tempo médio de preparo é aproximado pela
    # diferença entre criação e última atualização dos pedidos já prontos.
    pedidos_prontos_em_diante = (
        db.query(Pedido)
        .filter(Pedido.status.in_(["Prontos", "Entregues", "Concluídos"]))
        .all()
    )
    if pedidos_prontos_em_diante:
        duracoes = [
            (p.atualizado_em - p.criado_em).total_seconds() / 60 for p in pedidos_prontos_em_diante
        ]
        tempo_preparo = round(sum(duracoes) / len(duracoes), 1)
    else:
        tempo_preparo = 0.0

    total_delivery = db.query(func.count(Pedido.id)).filter(Pedido.canal == "delivery").scalar()
    cancel_delivery = (
        db.query(func.count(Pedido.id))
        .filter(Pedido.canal == "delivery", Pedido.status == "Cancelado")
        .scalar()
    )
    total_local = db.query(func.count(Pedido.id)).filter(Pedido.canal == "local").scalar()
    cancel_local = (
        db.query(func.count(Pedido.id))
        .filter(Pedido.canal == "local", Pedido.status == "Cancelado")
        .scalar()
    )

    metrics = {
        "tempoAceitacao": 5.0,  # placeholder até termos timestamp de aceitação separado
        "tempoPreparo": tempo_preparo,
        "cancelamentoDelivery": _percentual(cancel_delivery, total_delivery),
        "cancelamentoLocal": _percentual(cancel_local, total_local),
    }

    # --- Faturamento x cancelamento dos últimos 7 dias ---
    hoje = datetime.utcnow().date()
    weekly_data = []
    for offset in range(6, -1, -1):
        dia = hoje - timedelta(days=offset)
        deposito = (
            db.query(func.coalesce(func.sum(Transacao.valor), 0))
            .filter(func.date(Transacao.criado_em) == dia, Transacao.status == "Aprovado")
            .scalar()
        )
        estornado = (
            db.query(func.coalesce(func.sum(Pedido.total), 0))
            .filter(func.date(Pedido.atualizado_em) == dia, Pedido.status == "Cancelado")
            .scalar()
        )
        weekly_data.append(
            {
                "day": DIAS_PT[dia.weekday()],
                "deposit": float(deposito),
                "withdraw": float(estornado),
            }
        )

    # --- Formas de pagamento mais usadas ---
    por_forma = (
        db.query(Transacao.forma_pagamento, func.sum(Transacao.valor))
        .filter(Transacao.status == "Aprovado")
        .group_by(Transacao.forma_pagamento)
        .all()
    )
    total_pago = sum(float(v) for _, v in por_forma) or 1
    payment_data = [
        {
            "name": forma,
            "value": round(float(valor) / total_pago * 100, 1),
            "color": CORES_PAGAMENTO.get(forma, "#cccccc"),
        }
        for forma, valor in por_forma
    ]

    # --- Faturamento mensal (últimos 7 meses corridos) ---
    monthly_data = []
    ano_atual, mes_atual = hoje.year, hoje.month
    for offset in range(6, -1, -1):
        mes_idx = mes_atual - offset
        ano = ano_atual
        while mes_idx <= 0:
            mes_idx += 12
            ano -= 1
        total_mes = (
            db.query(func.coalesce(func.sum(Transacao.valor), 0))
            .filter(
                extract("year", Transacao.criado_em) == ano,
                extract("month", Transacao.criado_em) == mes_idx,
                Transacao.status == "Aprovado",
            )
            .scalar()
        )
        monthly_data.append({"month": MESES_PT[mes_idx - 1], "faturamento": float(total_mes)})

    return {
        "metrics": metrics,
        "weeklyData": weekly_data,
        "paymentData": payment_data,
        "monthlyData": monthly_data,
    }
