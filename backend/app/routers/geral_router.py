from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.insumo import Insumo
from app.models.pedido import Pedido
from app.models.usuario import Usuario
from app.schemas.relatorio_schema import GeralDashboard
from app.security.dependencies import require_gerencia
from app.services.estoque_service import insumo_para_dict

router = APIRouter(prefix="/geral", tags=["Geral"])

STATUS_ATIVOS = ["Novos", "Em preparo", "Prontos", "Entregues"]


def _moeda(valor: float) -> str:
    return f"R$ {valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


@router.get("", response_model=GeralDashboard)
def obter_dashboard_geral(db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    inicio_do_dia = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    faturamento_hoje = (
        db.query(func.coalesce(func.sum(Pedido.total), 0))
        .filter(Pedido.status == "Concluídos", Pedido.atualizado_em >= inicio_do_dia)
        .scalar()
    )

    pedidos_ativos = db.query(func.count(Pedido.id)).filter(Pedido.status.in_(STATUS_ATIVOS)).scalar()

    insumos = db.query(Insumo).all()
    alertas = [i for i in insumos if i.calcular_status() != "Estável"]

    total_clientes = db.query(func.count(Usuario.id)).filter(Usuario.perfil == "cliente").scalar()

    recentes = (
        db.query(Pedido)
        .options(joinedload(Pedido.itens))
        .order_by(Pedido.criado_em.desc())
        .limit(4)
        .all()
    )

    return {
        "metrics": {
            "totalSales": _moeda(float(faturamento_hoje)),
            "activeOrders": pedidos_ativos or 0,
            "lowStockItems": len(alertas),
            "totalClients": total_clientes or 0,
        },
        "recentOrders": [
            {
                "id": p.codigo,
                "customer": p.cliente_nome,
                "summary": ", ".join(f"{i.quantidade}x {i.nome_produto}" for i in p.itens) or "—",
                "status": p.status,
                "total": _moeda(float(p.total)),
            }
            for p in recentes
        ],
        "stockAlerts": [
            {
                "name": i.nome,
                "qty": f"{float(i.quantidade):g} {i.unidade}",
                "status": i.calcular_status(),
            }
            for i in sorted(alertas, key=lambda x: float(x.quantidade))[:5]
        ],
    }
