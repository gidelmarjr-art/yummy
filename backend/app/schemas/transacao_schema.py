from datetime import datetime
from typing import List

from pydantic import BaseModel


class TransacaoResponse(BaseModel):
    id: int
    pedido_id: int
    valor: float
    forma_pagamento: str
    status: str
    canal: str
    criado_em: datetime

    class Config:
        from_attributes = True


class MetricasTransacoes(BaseModel):
    totalRevenue: str
    numTransactions: str
    averageTicket: str


class PontoAnual(BaseModel):
    year: str
    amount: float


class PontoMensal(BaseModel):
    year: str
    revenue: float


class CanalReceita(BaseModel):
    id: int
    name: str
    category: str
    value: str
    percentage: str
    isPositive: bool
    bg: str
    iconColor: str
    type: str  # delivery | local | takeaway


class TransacaoRecente(BaseModel):
    id: str
    name: str
    price: str
    status: str
    isPositive: bool


class TransacoesDashboard(BaseModel):
    metrics: MetricasTransacoes
    yearlyData: List[PontoAnual]
    monthlyRevenueData: List[PontoMensal]
    channelsData: List[CanalReceita]
    recentTransactions: List[TransacaoRecente]
