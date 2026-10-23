import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FaSearch,
  FaCog,
  FaBell,
  FaWallet,
  FaReceipt,
  FaSyncAlt,
  FaMotorcycle,
  FaStore,
  FaShoppingBag,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import { useRealtimeTransactions } from "./useRealtimeTransactions";
import "../dashboards-shared.css";
import "./Transacoes.css";

export default function Transacoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tema, setTema] = useState("claro");
  const {
    metrics,
    yearlyData,
    monthlyRevenueData,
    channelsData,
    recentTransactions,
    erro,
  } = useRealtimeTransactions();

  // Sincronizar data-tema no <html> se necessário
  React.useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema);
  }, [tema]);

  const alternarTema = (e) => {
    const novoTema = tema === "escuro" ? "claro" : "escuro";
    setTema(novoTema);
  };

  const renderChannelIcon = (type) => {
    switch (type) {
      case "delivery":
        return <FaMotorcycle />;
      case "local":
        return <FaStore />;
      case "takeaway":
        return <FaShoppingBag />;
      default:
        return <FaWallet />;
    }
  };

  return (
    <div className="transacoes-page-layout bento-wrapper-root">
      <Sidebar activePage="Transactions" />

      <main className="transacoes-main-content">
        {/* Header Superior */}
        <header className="transacoes-top-bar">
          <h1 className="page-heading">Transações Financeiras</h1>

          <div className="top-bar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar cliente ou pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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

        {/* Dashboard Body com Bento Grid */}
        <div className="transacoes-dashboard-body bento-body-container">
          {erro && <p className="dashboard-error-msg">{erro}</p>}

          {/* Top Metrics Cards (Bento style) */}
          <div className="metrics-cards-row bento-metrics-grid">
            <div
              className="metric-summary-card bento-card card-featured"
              style={{ "--i": 0 }}
            >
              <div className="metric-icon-circle orange-bg">
                <FaWallet className="icon-orange" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Faturamento Total</span>
                <strong className="metric-value">{metrics.totalRevenue}</strong>
              </div>
            </div>

            <div
              className="metric-summary-card bento-card"
              style={{ "--i": 1 }}
            >
              <div className="metric-icon-circle pink-bg">
                <FaReceipt className="icon-pink" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total de Transações</span>
                <strong className="metric-value">
                  {metrics.numTransactions}
                </strong>
              </div>
            </div>

            <div
              className="metric-summary-card bento-card"
              style={{ "--i": 2 }}
            >
              <div className="metric-icon-circle blue-bg">
                <FaSyncAlt className="icon-blue" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Ticket Médio</span>
                <strong className="metric-value">
                  {metrics.averageTicket}
                </strong>
              </div>
            </div>
          </div>

          {/* Middle Charts Row */}
          <div className="charts-two-columns" style={{ "--i": 3 }}>
            {/* Faturamento Anual */}
            <div className="transacoes-chart-card dashboard-card-container">
              <h3 className="section-title-clean">Faturamento Anual</h3>
              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={yearlyData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="rgba(0,0,0,0.06)"
                    />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      stroke="#868883"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 50000]}
                      ticks={[0, 10000, 20000, 30000, 40000, 50000]}
                      tickFormatter={(val) => `R$${val.toLocaleString()}`}
                      stroke="#868883"
                    />
                    <Tooltip
                      formatter={(val) => [
                        `R$ ${val.toLocaleString()}`,
                        "Faturamento",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#ed5b22"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#ffffff",
                        stroke: "#ed5b22",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6, fill: "#ed5b22" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Receita Mensal */}
            <div className="transacoes-chart-card dashboard-card-container highlight-border">
              <h3 className="section-title-clean">Receita Mensal</h3>
              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={monthlyRevenueData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="rgba(0,0,0,0.06)"
                    />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      stroke="#868883"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 40000]}
                      ticks={[0, 10000, 20000, 30000, 40000]}
                      tickFormatter={(val) => `R$${val.toLocaleString()}`}
                      stroke="#868883"
                    />
                    <Tooltip
                      formatter={(val) => [
                        `R$ ${val.toLocaleString()}`,
                        "Receita",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0d9488"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#ffffff",
                        stroke: "#0d9488",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6, fill: "#0d9488" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-two-columns" style={{ "--i": 4 }}>
            {/* Receita por Canal */}
            <div className="investments-list-section dashboard-card-container">
              <h3 className="section-title">Receita por Canal</h3>
              <div className="investments-list">
                {channelsData.map((item) => (
                  <div key={item.id} className="investment-item-card">
                    <div className="investment-left">
                      <div
                        className="investment-icon-box"
                        style={{
                          backgroundColor: item.bg,
                          color: item.iconColor,
                        }}
                      >
                        {renderChannelIcon(item.type)}
                      </div>
                      <div className="investment-names">
                        <strong>{item.name}</strong>
                        <span>{item.category}</span>
                      </div>
                    </div>

                    <div className="investment-right">
                      <div className="investment-val-group">
                        <strong>{item.value}</strong>
                        <span>Total no Canal</span>
                      </div>
                      <div className="investment-return-group">
                        <strong
                          className={
                            item.isPositive ? "text-positive" : "text-negative"
                          }
                        >
                          {item.percentage}
                        </strong>
                        <span>Crescimento</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transações Recentes */}
            <div className="trending-stock-section dashboard-card-container">
              <h3 className="section-title">Transações Recentes</h3>
              <div className="trending-table-wrapper">
                <table className="trending-table">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Cliente</th>
                      <th>Valor</th>
                      <th>Status / Pago em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="sl-col">{tx.id}</td>
                        <td className="name-col">{tx.name}</td>
                        <td className="price-col">{tx.price}</td>
                        <td
                          className={`return-col ${tx.isPositive ? "text-positive" : "text-negative"}`}
                        >
                          {tx.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
