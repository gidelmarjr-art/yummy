import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
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
  FaCog,
  FaBell,
  FaClock,
  FaDownload,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaMotorcycle,
  FaStore,
  FaBars,
  FaSun,
  FaMoon,
  FaChartPie,
  FaBan,
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import { useRealtimeDashboard } from "./useRealtimeDashboard";
import "../dashboards-shared.css";
import "./Relatorios.css";

export default function Relatorios() {
  const [period, setPeriod] = useState("7d");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tema, setTema] = useState("claro");
  const { metrics, weeklyData, paymentData, monthlyData, loading, erro } =
    useRealtimeDashboard();

  const pdfRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema);
  }, [tema]);

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

  const handleExportPDF = () => {
    const element = pdfRef.current;
    if (!element) return;

    setIsExporting(true);

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Relatorio_Gerencial_Yummy_${period}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => setIsExporting(false))
      .catch(() => setIsExporting(false));
  };

  const safeMetrics = metrics || {
    tempoAceitacao: 0,
    tempoPreparo: 0,
    cancelamentoDelivery: 0,
    cancelamentoLocal: 0,
  };

  const totalFaturadoPeriodo =
    period === "7d"
      ? (weeklyData || []).reduce(
          (acc, item) => acc + (item.deposit || 0) + (item.withdraw || 0),
          0,
        )
      : (monthlyData || []).reduce(
          (acc, item) => acc + (item.faturamento || 0),
          0,
        );

  return (
    <div
      className={`relatorios-page-layout bento-wrapper-root ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="relatorios-main-content">
        {/* Header */}
        <header className="relatorios-top-bar">
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
            <h1 className="page-heading">Relatórios e Indicadores</h1>
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
                alt="Avatar Yummy"
              />
            </div>
          </div>
        </header>

        {/* Dashboard em Tela */}
        <div className="relatorios-dashboard-body bento-body-container">
          {erro && <p className="dashboard-error-msg">{erro}</p>}

          {loading ? (
            <div className="loading-placeholder">Carregando relatórios...</div>
          ) : (
            <>
              {/* Barra de Filtros com Dropdown Customizado */}
              <div className="relatorios-filter-bar" style={{ "--i": 0 }}>
                <div
                  className="custom-dropdown-container"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="custom-dropdown-selected">
                    <div className="dropdown-selected-left">
                      <FaCalendarAlt className="calendar-icon" />
                      <span>
                        {period === "7d" && "Últimos 7 dias"}
                        {period === "30d" && "Últimos 30 dias"}
                        {period === "year" && "Este Ano"}
                      </span>
                    </div>
                    <span
                      className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
                    >
                      ▼
                    </span>
                  </div>

                  {isDropdownOpen && (
                    <div className="custom-dropdown-menu">
                      <div
                        className={`custom-dropdown-item ${period === "7d" ? "selected" : ""}`}
                        onClick={() => {
                          setPeriod("7d");
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="dot-indicator orange"></span>
                          <span>Últimos 7 dias</span>
                        </div>
                        {period === "7d" && (
                          <span className="check-mark">✓</span>
                        )}
                      </div>

                      <div
                        className={`custom-dropdown-item ${period === "30d" ? "selected" : ""}`}
                        onClick={() => {
                          setPeriod("30d");
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="dot-indicator blue"></span>
                          <span>Últimos 30 dias</span>
                        </div>
                        {period === "30d" && (
                          <span className="check-mark">✓</span>
                        )}
                      </div>

                      <div
                        className={`custom-dropdown-item ${period === "year" ? "selected" : ""}`}
                        onClick={() => {
                          setPeriod("year");
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="dot-indicator green"></span>
                          <span>Este Ano</span>
                        </div>
                        {period === "year" && (
                          <span className="check-mark">✓</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="btn-export-report"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                >
                  <FaDownload />{" "}
                  {isExporting ? "Gerando PDF..." : "Exportar Relatório"}
                </button>
              </div>

              {/* Métricas Operacionais Bento */}
              <section className="metrics-section">
                <h2 className="section-title-dark" style={{ "--i": 1 }}>
                  Métricas Operacionais
                </h2>
                <div className="operational-cards-grid bento-metrics-grid-3">
                  <div
                    className="metric-card bento-card card-featured"
                    style={{ "--i": 2 }}
                  >
                    <div className="metric-header-clean">
                      <span>Tempo Médio de Aceitação</span>
                      <div className="metric-icon-circle orange-bg">
                        <FaClock className="icon-orange" />
                      </div>
                    </div>
                    <h2 className="metric-value">
                      {safeMetrics.tempoAceitacao} Min
                    </h2>
                    <div className="metric-footer-clean">
                      <span className="trend-badge positive">
                        <FaArrowDown /> -1.2 min
                      </span>
                      <span className="trend-label"> vs. semana passada</span>
                    </div>
                  </div>

                  <div className="metric-card bento-card" style={{ "--i": 3 }}>
                    <div className="metric-header-clean">
                      <span>Tempo Médio de Preparo</span>
                      <div className="metric-icon-circle pink-bg">
                        <FaClock className="icon-pink" />
                      </div>
                    </div>
                    <h2 className="metric-value">
                      {safeMetrics.tempoPreparo} Min
                    </h2>
                    <div className="metric-footer-clean">
                      <span className="trend-badge negative">
                        <FaArrowUp /> +3 min
                      </span>
                      <span className="trend-label"> vs. meta</span>
                    </div>
                  </div>

                  <div
                    className="metric-card bento-card cancellation-card-inline"
                    style={{ "--i": 4 }}
                  >
                    <div className="metric-header-clean">
                      <span>Taxa de Cancelamento</span>
                      <div className="metric-icon-circle red-bg">
                        <FaBan className="icon-red" />
                      </div>
                    </div>

                    <div className="cancellation-inline-items">
                      <div className="cancellation-inline-row">
                        <span className="cancellation-type">
                          <FaMotorcycle className="type-icon delivery" />{" "}
                          Delivery
                        </span>
                        <strong className="cancellation-value">
                          {safeMetrics.cancelamentoDelivery}%
                        </strong>
                      </div>

                      <div className="cancellation-inline-row">
                        <span className="cancellation-type">
                          <FaStore className="type-icon local" /> Local
                        </span>
                        <strong className="cancellation-value">
                          {safeMetrics.cancelamentoLocal}%
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Linha 1: Gráficos Bento */}
              <div className="charts-double-row" style={{ "--i": 5 }}>
                <div className="chart-card bento-card">
                  <div className="chart-card-header">
                    <h3 className="section-title-clean">Faturamento Semanal</h3>
                    <div className="chart-legend">
                      <span className="legend-item">
                        <span className="dot deposit"></span> Depósito
                      </span>
                      <span className="legend-item">
                        <span className="dot withdraw"></span> Levantamento
                      </span>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: 210 }}>
                    <ResponsiveContainer>
                      <BarChart data={weeklyData || []} barGap={6}>
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          stroke="#868883"
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          domain={[0, 500]}
                          stroke="#868883"
                        />
                        <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                        <Bar
                          dataKey="deposit"
                          fill="#f59e0b"
                          radius={[6, 6, 0, 0]}
                        />
                        <Bar
                          dataKey="withdraw"
                          fill="#ed5b22"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card bento-card">
                  <div className="chart-card-header">
                    <h3 className="section-title-clean">
                      Pagamentos mais Usados
                    </h3>
                    <FaChartPie style={{ color: "#ed5b22" }} />
                  </div>
                  <div style={{ width: "100%", height: 210 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={paymentData || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={78}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, value }) => `${value}% ${name}`}
                        >
                          {(paymentData || []).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color || "#ed5b22"}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Linha 2: Faturamento Mensal Largura Total */}
              <div className="full-width-chart-row" style={{ "--i": 6 }}>
                <div className="chart-card bento-card">
                  <h3 className="section-title-clean">Faturamento Mensal</h3>
                  <div style={{ width: "100%", height: 220 }}>
                    <ResponsiveContainer>
                      <AreaChart data={monthlyData || []}>
                        <defs>
                          <linearGradient
                            id="colorFaturamento"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#ed5b22"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="#ed5b22"
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          stroke="#868883"
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          domain={[0, 800]}
                          stroke="#868883"
                        />
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
              </div>
            </>
          )}
        </div>
      </main>

      {/* Template Oculto para Exportação de PDF */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div
          ref={pdfRef}
          style={{
            padding: "20px",
            backgroundColor: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            color: "#1e293b",
            width: "277mm",
            boxSizing: "border-box",
          }}
        >
          {/* Header do PDF */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "2px solid #ed5b22",
              paddingBottom: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  color: "#ed5b22",
                  fontSize: "22px",
                  fontWeight: "800",
                }}
              >
                Yummy — Relatório Gerencial
              </h1>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748b",
                  fontSize: "12px",
                }}
              >
                Filtro Aplicado:{" "}
                <strong>
                  {period === "7d"
                    ? "Últimos 7 dias"
                    : period === "30d"
                      ? "Últimos 30 dias"
                      : "Este Ano"}
                </strong>
              </p>
            </div>
            <div
              style={{ textAlign: "right", color: "#64748b", fontSize: "12px" }}
            >
              <p style={{ margin: 0 }}>
                Data de Emissão: {new Date().toLocaleDateString("pt-BR")}
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  color: "#16a34a",
                  fontWeight: "700",
                }}
              >
                Total Acumulado: R${" "}
                {totalFaturadoPeriodo.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Métricas Operacionais no PDF */}
          <h3
            style={{
              fontSize: "13px",
              color: "#0f172a",
              marginBottom: "8px",
              fontWeight: "700",
            }}
          >
            1. Métricas Operacionais
          </h3>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <div
              style={{
                flex: 1,
                background: "#f8fafc",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#64748b",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                Tempo Médio de Aceitação
              </span>
              <h2
                style={{
                  fontSize: "20px",
                  color: "#0f172a",
                  margin: "4px 0",
                  fontWeight: "800",
                }}
              >
                {safeMetrics.tempoAceitacao} Min
              </h2>
              <span
                style={{
                  fontSize: "10px",
                  color: "#16a34a",
                  fontWeight: "700",
                }}
              >
                ↓ -1.2 min vs. semana passada
              </span>
            </div>

            <div
              style={{
                flex: 1,
                background: "#f8fafc",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#64748b",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                Tempo Médio de Preparo
              </span>
              <h2
                style={{
                  fontSize: "20px",
                  color: "#0f172a",
                  margin: "4px 0",
                  fontWeight: "800",
                }}
              >
                {safeMetrics.tempoPreparo} Min
              </h2>
              <span
                style={{
                  fontSize: "10px",
                  color: "#dc2626",
                  fontWeight: "700",
                }}
              >
                ↑ +3 min vs. meta
              </span>
            </div>

            <div
              style={{
                flex: 1,
                background: "#f8fafc",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#64748b",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                Taxa de Cancelamento
              </span>
              <div
                style={{
                  marginTop: "6px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                  }}
                >
                  <span>Delivery:</span>{" "}
                  <strong style={{ color: "#dc2626" }}>
                    {safeMetrics.cancelamentoDelivery}%
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                  }}
                >
                  <span>Local:</span>{" "}
                  <strong style={{ color: "#dc2626" }}>
                    {safeMetrics.cancelamentoLocal}%
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Detalhamento por Período selecionado */}
          <h3
            style={{
              fontSize: "13px",
              color: "#0f172a",
              marginBottom: "8px",
              fontWeight: "700",
            }}
          >
            2. Detalhamento de Valores por{" "}
            {period === "7d" ? "Dia (Semanal)" : "Mês (Anual/Mensal)"}
          </h3>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              padding: "10px",
              marginBottom: "16px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "11px",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid #e2e8f0",
                    color: "#64748b",
                  }}
                >
                  <th style={{ padding: "6px 8px" }}>
                    {period === "7d" ? "Dia da Semana" : "Mês"}
                  </th>
                  <th style={{ padding: "6px 8px" }}>
                    {period === "7d"
                      ? "Depósitos (R$)"
                      : "Faturamento Recebido (R$)"}
                  </th>
                  <th style={{ padding: "6px 8px" }}>
                    {period === "7d"
                      ? "Levantamentos / Vendas (R$)"
                      : "Margem Estimada"}
                  </th>
                  <th style={{ padding: "6px 8px" }}>Total do Período</th>
                </tr>
              </thead>
              <tbody>
                {period === "7d"
                  ? (weeklyData || []).map((row, idx) => {
                      const totalDia = (row.deposit || 0) + (row.withdraw || 0);
                      return (
                        <tr
                          key={idx}
                          style={{ borderBottom: "1px solid #f1f5f9" }}
                        >
                          <td style={{ padding: "6px 8px", fontWeight: "600" }}>
                            {row.day}
                          </td>
                          <td style={{ padding: "6px 8px" }}>
                            R${" "}
                            {(row.deposit || 0).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td style={{ padding: "6px 8px" }}>
                            R${" "}
                            {(row.withdraw || 0).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td
                            style={{
                              padding: "6px 8px",
                              fontWeight: "700",
                              color: "#ed5b22",
                            }}
                          >
                            R${" "}
                            {totalDia.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      );
                    })
                  : (monthlyData || []).map((row, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                      >
                        <td style={{ padding: "6px 8px", fontWeight: "600" }}>
                          {row.month}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          R${" "}
                          {(row.faturamento || 0).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            color: "#16a34a",
                            fontWeight: "600",
                          }}
                        >
                          78.5%
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            fontWeight: "700",
                            color: "#ed5b22",
                          }}
                        >
                          R${" "}
                          {(row.faturamento || 0).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Footer do PDF */}
          <div
            style={{
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "10px",
              marginTop: "12px",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "8px",
            }}
          >
            Yummy System © {new Date().getFullYear()} — Relatório Gerencial
            Automatizado
          </div>
        </div>
      </div>
    </div>
  );
}
