import React, { useEffect, useState } from "react";
import { FaUtensils, FaBoxes, FaUsers, FaDollarSign } from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import TopHeader from "../../../../components/TopHeader/TopHeader";
import { useContagem } from "./useContagem";
import { getGeral } from "../../../../services/api";
import "../dashboards-shared.css";
import "./Geral.css";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalSales: "R$ 0,00",
    activeOrders: 0,
    lowStockItems: 0,
    totalClients: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pontoAtivoChart, setPontoAtivoChart] = useState(null);

  const numFaturamento =
    parseFloat(metrics.totalSales.replace(/[^\d,]/g, "").replace(",", ".")) ||
    0;

  const fatAnimado = useContagem(numFaturamento);
  const pedAnimado = useContagem(metrics.activeOrders);
  const insAnimado = useContagem(metrics.lowStockItems);
  const cliAnimado = useContagem(metrics.totalClients);

  useEffect(() => {
    getGeral()
      .then((data) => {
        setMetrics(data.metrics);
        setRecentOrders(data.recentOrders);
        setStockAlerts(data.stockAlerts);
      })
      .catch((err) => setErro(err.detail || err.message))
      .finally(() => setCarregando(false));
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const dadosGrafico = [
    { dia: "Seg", valor: 350, x: 25, y: 77.5 },
    { dia: "Ter", valor: 520, x: 80, y: 66.8 },
    { dia: "Qua", valor: 700, x: 135, y: 55.0 },
    { dia: "Qui", valor: 610, x: 190, y: 60.8 },
    { dia: "Sex", valor: 980, x: 245, y: 37.0 },
    { dia: "Sáb", valor: 1232, x: 300, y: 10.0 },
    { dia: "Dom", valor: numFaturamento || 1050, x: 355, y: 32.5 },
  ];

  const pathD =
    `M ${dadosGrafico[0].x},${dadosGrafico[0].y} ` +
    dadosGrafico
      .slice(1)
      .map((p, i) => {
        const prev = dadosGrafico[i];
        const cx1 = prev.x + (p.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (p.x - prev.x) / 2;
        const cy2 = p.y;
        return `C ${cx1},${cy1} ${cx2},${cy2} ${p.x},${p.y}`;
      })
      .join(" ");

  return (
    <div
      className={`dashboard-page-layout bento-wrapper-root ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="dashboard-main-content">
        <TopHeader
          title="Dashboard Geral"
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="dashboard-body-content bento-body-container">
          {erro && <p className="dashboard-error-msg">{erro}</p>}

          <div className="metrics-grid bento-metrics-grid">
            <div
              className="metric-card bento-card card-featured"
              style={{ "--i": 0 }}
            >
              <div className="metric-header">
                <span>Faturamento Hoje</span>
                <span className="metric-icon-wrapper">
                  <FaDollarSign />
                </span>
              </div>
              <h2 className="metric-value">
                {carregando
                  ? "…"
                  : `R$ ${fatAnimado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </h2>
              <span className="metric-footer">Concluído hoje</span>
            </div>

            <div className="metric-card bento-card" style={{ "--i": 1 }}>
              <div className="metric-header">
                <span>Pedidos Ativos</span>
                <span className="metric-icon-wrapper">
                  <FaUtensils />
                </span>
              </div>
              <h2 className="metric-value">
                {carregando ? "…" : Math.round(pedAnimado)}
              </h2>
              <div className="status-live-indicator">
                <span className="pulse-ring" />
                <span className="status-text" style={{ color: "#ed5b22" }}>
                  Em andamento na cozinha
                </span>
              </div>
            </div>

            <div className="metric-card bento-card" style={{ "--i": 2 }}>
              <div className="metric-header">
                <span>Alertas de Estoque</span>
                <span className="metric-icon-wrapper alert-icon">
                  <FaBoxes />
                </span>
              </div>
              <h2 className="metric-value warning-color">
                {carregando ? "…" : Math.round(insAnimado)}
              </h2>
              <span className="metric-footer" style={{ color: "#dc2626" }}>
                Itens precisando de reposição
              </span>
            </div>

            <div className="metric-card bento-card" style={{ "--i": 3 }}>
              <div className="metric-header">
                <span>Total Clientes</span>
                <span className="metric-icon-wrapper">
                  <FaUsers />
                </span>
              </div>
              <h2 className="metric-value">
                {carregando ? "…" : Math.round(cliAnimado)}
              </h2>
              <span className="metric-footer">Cadastrados na plataforma</span>
            </div>
          </div>

          <div className="middle-section-grid">
            <div
              className="dashboard-card-container bento-chart-box"
              style={{ "--i": 4 }}
            >
              <div className="chart-header-title">
                <h3 className="section-title-clean">Fluxo de Vendas Semanal</h3>
              </div>

              <div className="points-chart-wrapper">
                <div className="chart-y-axis">
                  <span>1.232</span>
                  <span>1.050</span>
                  <span>700</span>
                  <span>350</span>
                  <span>0</span>
                </div>

                <div
                  className="svg-chart-container"
                  onMouseLeave={() => setPontoAtivoChart(null)}
                >
                  <svg viewBox="0 0 400 120" className="bento-svg-chart">
                    <g className="chart-grid-lines">
                      <line x1="0" y1="10" x2="400" y2="10" />
                      <line x1="0" y1="32.5" x2="400" y2="32.5" />
                      <line x1="0" y1="55" x2="400" y2="55" />
                      <line x1="0" y1="77.5" x2="400" y2="77.5" />
                      <line x1="0" y1="100" x2="400" y2="100" />
                    </g>

                    <path
                      d={pathD}
                      pathLength="1"
                      className="chart-line-smooth"
                    />

                    {dadosGrafico.map((d, idx) => (
                      <g key={idx} onMouseEnter={() => setPontoAtivoChart(idx)}>
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r="14"
                          fill="transparent"
                          style={{ cursor: "pointer" }}
                        />
                        <circle
                          cx={d.x}
                          cy={d.y}
                          r={pontoAtivoChart === idx ? 6 : 4.5}
                          className={`points-chart-node ${pontoAtivoChart === idx ? "active" : ""}`}
                        />
                      </g>
                    ))}
                  </svg>

                  {pontoAtivoChart !== null && (
                    <div
                      className="chart-tooltip-floating"
                      style={{
                        left: `${(dadosGrafico[pontoAtivoChart].x / 400) * 100}%`,
                        top: `${(dadosGrafico[pontoAtivoChart].y / 120) * 100}%`,
                      }}
                    >
                      <strong>{dadosGrafico[pontoAtivoChart].dia}</strong>
                      <span>
                        R${" "}
                        {dadosGrafico[pontoAtivoChart].valor.toLocaleString(
                          "pt-BR",
                        )}
                      </span>
                    </div>
                  )}

                  <div className="chart-x-axis">
                    {dadosGrafico.map((d, i) => (
                      <span
                        key={i}
                        className={pontoAtivoChart === i ? "active" : ""}
                        style={{ left: `${(d.x / 400) * 100}%` }}
                      >
                        {d.dia}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="dashboard-card-container stock-alerts-container"
              style={{ "--i": 5 }}
            >
              <h3 className="section-title">Insumos Críticos</h3>
              <div className="stock-alerts-list">
                {!carregando && stockAlerts.length === 0 && (
                  <p className="dashboard-empty-msg">
                    Nenhum alerta — estoque saudável.
                  </p>
                )}
                {stockAlerts
                  .slice()
                  .sort((a, b) => {
                    if (a.status === "Crítico" && b.status !== "Crítico")
                      return -1;
                    if (b.status === "Crítico" && a.status !== "Crítico")
                      return 1;
                    return 0;
                  })
                  .map((stock, idx) => (
                    <div key={idx} className="stock-alert-item">
                      <div className="order-info-group">
                        <strong className="stock-name">{stock.name}</strong>
                        <span className="order-detail-sub">
                          Qtd atual: {stock.qty}
                        </span>
                      </div>

                      <span
                        className={
                          stock.status === "Crítico"
                            ? "stock-badge-critical"
                            : "stock-badge-low"
                        }
                      >
                        {stock.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div
            className="dashboard-card-container full-width-orders-card"
            style={{ "--i": 6 }}
          >
            <h3 className="section-title">Últimos Pedidos em Tempo Real</h3>
            <div className="recent-orders-list">
              {!carregando && recentOrders.length === 0 && (
                <p className="dashboard-empty-msg">Nenhum pedido ainda.</p>
              )}
              {recentOrders.map((order) => (
                <div key={order.id} className="recent-order-item">
                  <div className="order-info-group">
                    <strong className="order-client">
                      #{order.id} - {order.customer}
                    </strong>
                    <span className="order-detail-sub">{order.summary}</span>
                  </div>

                  <span
                    className={`status-pill status-${order.status.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {order.status}
                  </span>

                  <span className="order-price">{order.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
