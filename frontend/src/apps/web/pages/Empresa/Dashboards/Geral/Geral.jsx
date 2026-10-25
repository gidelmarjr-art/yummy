import React, { useEffect, useRef, useState } from "react";
import { FaUtensils, FaBoxes, FaUsers, FaDollarSign } from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import TopHeader from "../../../../components/TopHeader/TopHeader";
import { useContagem } from "./useContagem";
import { getGeral } from "../../../../services/api";
import "../dashboards-shared.css";
import "./Geral.css";

// O gráfico é desenhado no tamanho real do espaço disponível (em pixels), para
// que os pontos, os números do eixo e os nomes dos dias fiquem alinhados em
// qualquer largura e altura de tela.
const PASSO_EIXO_Y = 250; // um traço do eixo vertical a cada R$ 250
const TOPO_EIXO_Y = 3000; // o eixo vai até R$ 3.000 (cresce se algum valor passar disso)
const MARGEM_ESQ = 56; // espaço para os números do eixo Y
const MARGEM_DIR = 8;
const MARGEM_PONTOS = 24; // afastamento dos pontos das pontas do gráfico
const MARGEM_TOPO = 12;
const MARGEM_BASE = 8;
const ESPACO_MIN_ROTULO = 18; // altura mínima (px) entre dois números do eixo Y

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
  const svgRef = useRef(null);
  const [tamanhoGrafico, setTamanhoGrafico] = useState({
    largura: 680,
    altura: 260,
  });

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

  // Mede o gráfico e acompanha mudanças (redimensionar a janela, abrir/fechar o menu lateral).
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return undefined;

    const medir = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setTamanhoGrafico((atual) =>
          atual.largura === width && atual.altura === height
            ? atual
            : { largura: width, altura: height },
        );
      }
    };

    medir();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", medir);
      return () => window.removeEventListener("resize", medir);
    }
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  const { largura: larguraGrafico, altura: alturaGrafico } = tamanhoGrafico;

  const pontosBase = [
    { dia: "Seg", valor: 350 },
    { dia: "Ter", valor: 520 },
    { dia: "Qua", valor: 700 },
    { dia: "Qui", valor: 610 },
    { dia: "Sex", valor: 980 },
    { dia: "Sáb", valor: 1232 },
    { dia: "Dom", valor: numFaturamento || 1050 },
  ];

  // Eixo Y: de 0 até 3.000 em passos de 250 (ou mais, se algum valor ultrapassar).
  const maxValor = Math.max(...pontosBase.map((p) => p.valor));
  const topoY = Math.max(
    TOPO_EIXO_Y,
    Math.ceil(maxValor / PASSO_EIXO_Y) * PASSO_EIXO_Y,
  );
  const alturaUtil = alturaGrafico - MARGEM_TOPO - MARGEM_BASE;
  const yDoValor = (valor) => MARGEM_TOPO + (1 - valor / topoY) * alturaUtil;

  // Em telas baixas mostra só parte dos números (500 em 500, ou 1.000 em 1.000)
  // para eles não ficarem amontoados.
  const pxPorPasso = alturaUtil / (topoY / PASSO_EIXO_Y);
  const saltoRotulo =
    pxPorPasso >= ESPACO_MIN_ROTULO
      ? 1
      : pxPorPasso * 2 >= ESPACO_MIN_ROTULO
        ? 2
        : 4;
  const marcasY = Array.from(
    { length: topoY / PASSO_EIXO_Y + 1 },
    (_, i) => i * PASSO_EIXO_Y,
  ).filter((_, i) => i % saltoRotulo === 0);

  // Os pontos se distribuem igualmente por toda a largura disponível.
  const xInicial = MARGEM_ESQ + MARGEM_PONTOS;
  const xFinal = larguraGrafico - MARGEM_DIR - MARGEM_PONTOS;
  const passoX = (xFinal - xInicial) / (pontosBase.length - 1);
  const dadosGrafico = pontosBase.map((p, i) => ({
    ...p,
    x: xInicial + i * passoX,
    y: yDoValor(p.valor),
  }));

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
                <div
                  className="svg-chart-container"
                  onMouseLeave={() => setPontoAtivoChart(null)}
                >
                  <div className="svg-plot">
                    <svg
                      ref={svgRef}
                      viewBox={`0 0 ${larguraGrafico} ${alturaGrafico}`}
                      className="bento-svg-chart"
                    >
                      <g className="chart-grid-lines">
                        {marcasY.map((valor) => (
                          <line
                            key={valor}
                            x1={MARGEM_ESQ}
                            y1={yDoValor(valor)}
                            x2={larguraGrafico - MARGEM_DIR}
                            y2={yDoValor(valor)}
                          />
                        ))}
                      </g>

                      <g className="chart-y-labels">
                        {marcasY.map((valor) => (
                          <text
                            key={valor}
                            className="chart-y-label"
                            x={MARGEM_ESQ - 10}
                            y={yDoValor(valor)}
                            textAnchor="end"
                            dominantBaseline="middle"
                          >
                            {valor.toLocaleString("pt-BR")}
                          </text>
                        ))}
                      </g>

                      <path
                        d={pathD}
                        pathLength="1"
                        className="chart-line-smooth"
                      />

                      {dadosGrafico.map((d, idx) => (
                        <g
                          key={idx}
                          onMouseEnter={() => setPontoAtivoChart(idx)}
                        >
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
                  </div>

                  {pontoAtivoChart !== null && (
                    <div
                      className="chart-tooltip-floating"
                      style={{
                        left: `${dadosGrafico[pontoAtivoChart].x}px`,
                        top: `${dadosGrafico[pontoAtivoChart].y}px`,
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
                        style={{ left: `${d.x}px` }}
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
