import React, { useEffect, useState, useRef } from "react";
import {
  FaCog,
  FaBell,
  FaUtensils,
  FaBoxes,
  FaUsers,
  FaDollarSign,
  FaBars,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import { getGeral } from "../../../../services/api";
import "../dashboards-shared.css";
import "./Geral.css";

// Hook de contagem animada numérica
function useContagem(alvoNum, duracao = 1100) {
  const reduzido =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [valor, setValor] = useState(reduzido ? alvoNum : 0);
  const atual = useRef(valor);

  useEffect(() => {
    if (reduzido) {
      setValor(alvoNum);
      return;
    }
    const de = atual.current;
    const inicio = performance.now();
    let q;
    const passo = (t) => {
      const p = Math.min((t - inicio) / duracao, 1);
      atual.current = de + (alvoNum - de) * (1 - (1 - p) ** 4);
      setValor(atual.current);
      if (p < 1) q = requestAnimationFrame(passo);
    };
    q = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(q);
  }, [alvoNum, duracao, reduzido]);

  return valor;
}

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
  const [tema, setTema] = useState("escuro");
  const [pontoAtivoChart, setPontoAtivoChart] = useState(null);

  // Extrair valor numérico puro do faturamento (ex: "R$ 102,60" -> 102.60)
  const numFaturamento =
    parseFloat(metrics.totalSales.replace(/[^\d,]/g, "").replace(",", ".")) ||
    0;

  const fatAnimado = useContagem(numFaturamento);
  const pedAnimado = useContagem(metrics.activeOrders);
  const insAnimado = useContagem(metrics.lowStockItems);
  const cliAnimado = useContagem(metrics.totalClients);

  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema);
  }, [tema]);

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

  const alternarTema = (e) => {
    const novoTema = tema === "escuro" ? "claro" : "escuro";
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;
    const raioFinal = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const aplicar = () => {
      setTema(novoTema);
      document.documentElement.setAttribute("data-tema", novoTema);
    };

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      aplicar();
      return;
    }

    const transition = document.startViewTransition(() => aplicar());
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${raioFinal}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 750,
          easing: "cubic-bezier(.65,0,.35,1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  const dadosGrafico = [
    { dia: "Seg", valor: 2100, x: 20, y: 80 },
    { dia: "Ter", valor: 2850, x: 80, y: 62 },
    { dia: "Qua", valor: 3400, x: 140, y: 48 },
    { dia: "Qui", valor: 3100, x: 200, y: 55 },
    { dia: "Sex", valor: 4900, x: 260, y: 15 },
    { dia: "Sáb", valor: 5600, x: 320, y: 5 },
    { dia: "Dom", valor: numFaturamento || 4280, x: 380, y: 28 },
  ];

  return (
    <div
      className={`dashboard-page-layout bento-wrapper-root ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}
    >
      {/* Sua Sidebar Original mantida intacta */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="dashboard-main-content">
        {/* Header Superior original */}
        <header className="dashboard-top-bar">
          <div className="top-bar-left">
            {!isSidebarOpen && (
              <button
                className="toggle-sidebar-btn"
                onClick={toggleSidebar}
                aria-label="Abrir menu"
              >
                <FaBars />
              </button>
            )}
            <h1 className="page-heading">Dashboard Geral</h1>
          </div>

          <div className="top-bar-right">
            <button
              className="action-circle-btn"
              onClick={alternarTema}
              aria-label="Alternar Tema"
            >
              {tema === "escuro" ? <FaSun /> : <FaMoon />}
            </button>
            <button className="action-circle-btn" aria-label="Configurações">
              <FaCog />
            </button>
            <button className="action-circle-btn" aria-label="Notificações">
              <FaBell />
            </button>

            <div className="user-profile-avatar">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                alt="Avatar"
              />
            </div>
          </div>
        </header>

        {/* Corpo com visual Bento Grid e animações do brief */}
        <div className="dashboard-body-content bento-body-container">
          {erro && <p className="dashboard-error-msg">{erro}</p>}

          {/* Grid de 4 Cards Superiores (Bento) */}
          <div className="metrics-grid bento-metrics-grid">
            {/* Cartão 1: Faturamento (Destaque com gradiente sálvia) */}
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

            {/* Cartão 2: Pedidos Ativos */}
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
                <span className="status-text" style={{ color: "#ea580c" }}>
                  Em andamento na cozinha
                </span>
              </div>
            </div>

            {/* Cartão 3: Alertas de Estoque */}
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

            {/* Cartão 4: Total Clientes */}
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

          {/* Gráfico de Vendas SVG Interativo */}
          <div
            className="dashboard-card-container bento-chart-box"
            style={{ "--i": 4 }}
          >
            <h3 className="section-title">Fluxo de Vendas Semanal</h3>
            <div
              className="svg-chart-container"
              onMouseLeave={() => setPontoAtivoChart(null)}
            >
              <svg viewBox="0 0 400 120" className="bento-svg-chart">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--salvia, #8fb39a)"
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--salvia, #8fb39a)"
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>
                <polygon
                  points="20,100 20,80 80,62 140,48 200,55 260,15 320,5 380,28 380,100"
                  fill="url(#chartGrad)"
                  className="area-fade"
                />
                <path
                  d="M 20,80 C 50,70 50,62 80,62 C 110,62 110,48 140,48 C 170,48 170,55 200,55 C 230,55 230,15 260,15 C 290,15 290,5 320,5 C 350,5 350,28 380,28"
                  pathLength="1"
                  className="chart-line-smooth"
                />
                {dadosGrafico.map((d, idx) => (
                  <g key={idx} onMouseEnter={() => setPontoAtivoChart(idx)}>
                    <rect
                      x={d.x - 12}
                      y={d.y}
                      width="24"
                      height={100 - d.y}
                      className="chart-bar-item"
                      style={{ "--i": idx }}
                    />
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r={pontoAtivoChart === idx ? 5 : 3.5}
                      className={`chart-point-dot ${pontoAtivoChart === idx ? "active" : ""}`}
                    />
                  </g>
                ))}
              </svg>
              {pontoAtivoChart !== null && (
                <div
                  className="chart-tooltip-floating"
                  style={{
                    left: `${(dadosGrafico[pontoAtivoChart].x / 400) * 100}%`,
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
            </div>
            <div className="chart-x-axis">
              {dadosGrafico.map((d, i) => (
                <span key={i} className={pontoAtivoChart === i ? "active" : ""}>
                  {d.dia}
                </span>
              ))}
            </div>
          </div>

          {/* Seções Inferiores: Últimos Pedidos & Insumos Críticos */}
          <div className="dashboard-sections-grid">
            <div className="dashboard-card-container" style={{ "--i": 5 }}>
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

            <div className="dashboard-card-container" style={{ "--i": 6 }}>
              <h3 className="section-title">Insumos Críticos</h3>
              <div className="stock-alerts-list">
                {!carregando && stockAlerts.length === 0 && (
                  <p className="dashboard-empty-msg">
                    Nenhum alerta — estoque saudável.
                  </p>
                )}
                {stockAlerts.map((stock, idx) => (
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
        </div>
      </main>
    </div>
  );
}
