from typing import List

from pydantic import BaseModel


# ---------- Dashboard Geral ----------

class MetricasGerais(BaseModel):
    totalSales: str
    activeOrders: int
    lowStockItems: int
    totalClients: int


class PedidoRecente(BaseModel):
    id: str
    customer: str
    summary: str
    status: str
    total: str


class AlertaEstoque(BaseModel):
    name: str
    qty: str
    status: str


class GeralDashboard(BaseModel):
    metrics: MetricasGerais
    recentOrders: List[PedidoRecente]
    stockAlerts: List[AlertaEstoque]


# ---------- Relatórios ----------

class MetricasOperacionais(BaseModel):
    tempoAceitacao: float
    tempoPreparo: float
    cancelamentoDelivery: float
    cancelamentoLocal: float


class PontoSemanal(BaseModel):
    day: str
    deposit: float
    withdraw: float


class FatiaPagamento(BaseModel):
    name: str
    value: float
    color: str


class PontoMensalFaturamento(BaseModel):
    month: str
    faturamento: float


class RelatoriosDashboard(BaseModel):
    metrics: MetricasOperacionais
    weeklyData: List[PontoSemanal]
    paymentData: List[FatiaPagamento]
    monthlyData: List[PontoMensalFaturamento]
