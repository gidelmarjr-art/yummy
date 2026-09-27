import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  FaSearch,
  FaCog,
  FaBell,
  FaClock,
  FaDownload,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaMotorcycle,
  FaStore,
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import { useRealtimeDashboard } from "./useRealtimeDashboard";
import "../dashboards-shared.css";
import "./Relatorios.css";

export default function Relatorios() {
  const [period, setPeriod] = useState("7d");
  const { metrics, weeklyData, paymentData, monthlyData, loading, erro } =
    useRealtimeDashboard();

  const safeMetrics = metrics || {
    tempoAceitacao: 0,
    tempoPreparo: 0,
    cancelamentoDelivery: 0,
    cancelamentoLocal: 0,
  };

  return (
    <div className="relatorios-page-layout">
      <Sidebar activePage="Relatórios" />

      <main className="relatorios-main-content">
        {/* Header */}
        <header className="relatorios-top-bar">
          <h1 className="page-heading">Relatórios e Indicadores</h1>

          <div className="top-bar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Buscar indicador..." />
            </div>

            <button className="action-circle-btn" aria-label="Configurações">
              <FaCog />
            </button>
            <button className="action-circle-btn" aria-label="Notificações">
              <FaBell />
            </button>

            <div className="user-profile-avatar">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                alt="Avatar Yummy"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="relatorios-dashboard-body">
          {erro && <p className="dashboard-error-msg">{erro}</p>}

          {loading ? (
            <div className="loading-placeholder">Carregando relatórios...</div>
          ) : (
            <>
              {/* Barra de Filtros */}
              <div className="relatorios-filter-bar">
                <div className="filter-period-selector">
                  <FaCalendarAlt className="calendar-icon" />
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="year">Este Ano</option>
                  </select>
                </div>

                <button
                  className="btn-export-report"
                  onClick={() => alert("Gerando relatório...")}
                >
                  <FaDownload /> Exportar Relatório
                </button>
              </div>

              {/* Métricas Operacionais */}
              <section className="metrics-section">
                <h2 className="section-title-dark">Métricas Operacionais</h2>
                <div className="operational-cards-grid">
                  <div className="metric-card orange-card">
                    <div className="metric-header">
                      <span>Tempo Médio de Aceitação</span>
                      <div className="metric-icon-wrapper circle-white">
                        <FaClock />
                      </div>
                    </div>
                    <div className="metric-value">
                      {safeMetrics.tempoAceitacao} Min
                    </div>
                    <div className="metric-footer">
                      <span className="trend-badge positive">
                        <FaArrowDown /> -1.2 min
                      </span>
                      <span className="trend-label">vs. semana passada</span>
                    </div>
                  </div>

                  <div className="metric-card white-card">
                    <div className="metric-header">
                      <span>Tempo Médio de Preparo</span>
                      <div className="metric-icon-wrapper circle-orange">
                        <FaClock />
                      </div>
                    </div>
                    <div className="metric-value">
                      {safeMetrics.tempoPreparo} Min
                    </div>
                    <div className="metric-footer">
                      <span className="trend-badge negative">
                        <FaArrowUp /> +3 min
                      </span>
                      <span className="trend-label">vs. meta</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Linha 1: Faturamento Semanal + Formas de Pagamento */}
              <div className="charts-double-row">
                <div className="chart-card">
                  <div className="chart-card-header">
                    <h3>Faturamento Semanal</h3>
                    <div className="chart-legend">
                      <span className="legend-item">
                        <span className="dot deposit"></span> Depósito
                      </span>
                      <span className="legend-item">
                        <span className="dot withdraw"></span> Levantamento
                      </span>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                      <BarChart data={weeklyData || []} barGap={6}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} domain={[0, 500]} />
                        <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                        <Bar dataKey="deposit" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="withdraw" fill="#ed5b22" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Formas de Pagamento mais Usadas</h3>
                  <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={paymentData || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${value}% ${name}`}
                        >
                          {(paymentData || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || "#ed5b22"} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Linha 2: Faturamento Mensal + Cancelamento */}
              <div className="charts-double-row">
                <div className="chart-card">
                  <h3>Faturamento Mensal</h3>
                  <div style={{ width: "100%", height: 180 }}>
                    <ResponsiveContainer>
                      <AreaChart data={monthlyData || []}>
                        <defs>
                          <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ed5b22" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ed5b22" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} domain={[0, 800]} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="faturamento"
                          stroke="#ed5b22"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorFaturamento)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card cancellation-rate-card">
                  <h3>Taxa de Cancelamento</h3>
                  <div className="cancellation-items">
                    <div className="cancellation-row">
                      <div className="cancellation-type">
                        <FaMotorcycle className="type-icon delivery" />
                        <span>Delivery</span>
                      </div>
                      <strong className="cancellation-value">
                        {safeMetrics.cancelamentoDelivery}%
                      </strong>
                    </div>

                    <div className="cancellation-row">
                      <div className="cancellation-type">
                        <FaStore className="type-icon local" />
                        <span>Local</span>
                      </div>
                      <strong className="cancellation-value">
                        {safeMetrics.cancelamentoLocal}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}