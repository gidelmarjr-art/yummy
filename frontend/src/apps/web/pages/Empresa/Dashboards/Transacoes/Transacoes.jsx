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
  FaCog,
  FaBell,
  FaWallet,
  FaReceipt,
  FaSyncAlt,
  FaMotorcycle,
  FaStore,
  FaShoppingBag,
  FaBars,
  FaChartLine,
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import TopHeader from "../../../../components/TopHeader/TopHeader";
import { useRealtimeTransactions } from "./useRealtimeTransactions";
import "../dashboards-shared.css";
import "./Transacoes.css";

export default function Transacoes() {
  const [searchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    metrics,
    yearlyData,
    monthlyRevenueData,
    channelsData,
    recentTransactions,
    erro,
  } = useRealtimeTransactions();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
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

  const transacoesFiltradas = recentTransactions.filter(
    (tx) =>
      tx.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id?.toString().includes(searchTerm),
  );

  return (
    <div
      className={`transacoes-page-layout bento-wrapper-root ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="transacoes-main-content">
        <TopHeader title="Transações Financeiras" isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="transacoes-dashboard-body bento-body-container">
          {erro && <p className="dashboard-error-msg">{erro}</p>}

          <div className="metrics-cards-row bento-metrics-grid">
            <div
              className="metric-summary-card bento-card card-featured"
              style={{ "--i": 0 }}
            >
              <div className="metric-header-clean">
                <span>Faturamento Total</span>
                <div className="metric-icon-circle orange-bg">
                  <FaWallet className="icon-orange" />
                </div>
              </div>
              <h2 className="metric-value">{metrics.totalRevenue}</h2>
              <span className="metric-footer-clean">
                Acumulado na plataforma
              </span>
            </div>

            <div
              className="metric-summary-card bento-card"
              style={{ "--i": 1 }}
            >
              <div className="metric-header-clean">
                <span>Total Transações</span>
                <div className="metric-icon-circle pink-bg">
                  <FaReceipt className="icon-pink" />
                </div>
              </div>
              <h2 className="metric-value">{metrics.numTransactions}</h2>
              <span className="metric-footer-clean">Pedidos concluídos</span>
            </div>

            <div
              className="metric-summary-card bento-card"
              style={{ "--i": 2 }}
            >
              <div className="metric-header-clean">
                <span>Ticket Médio</span>
                <div className="metric-icon-circle blue-bg">
                  <FaSyncAlt className="icon-blue" />
                </div>
              </div>
              <h2 className="metric-value">{metrics.averageTicket}</h2>
              <span className="metric-footer-clean">Média por pedido</span>
            </div>

            <div
              className="metric-summary-card bento-card"
              style={{ "--i": 3 }}
            >
              <div className="metric-header-clean">
                <span>Margem Estimada</span>
                <div className="metric-icon-circle green-bg">
                  <FaChartLine className="icon-green" />
                </div>
              </div>
              <h2 className="metric-value">78.5%</h2>
              <span
                className="metric-footer-clean"
                style={{ color: "#16a34a" }}
              >
                Rendimento saudável
              </span>
            </div>
          </div>

          <div className="charts-two-columns" style={{ "--i": 4 }}>
            <div className="transacoes-chart-card dashboard-card-container">
              <h3 className="section-title">Faturamento Anual</h3>
              <div className="chart-container-wrapper">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart
                    data={yearlyData}
                    margin={{ top: 15, right: 20, left: 25, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="rgba(0,0,0,0.08)"
                    />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      stroke="#868883"
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 50000]}
                      ticks={[0, 10000, 20000, 30000, 40000, 50000]}
                      tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                      stroke="#868883"
                      dx={-5}
                    />
                    <Tooltip
                      formatter={(val) => [
                        `R$ ${Number(val).toLocaleString("pt-BR")}`,
                        "Faturamento",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#ed5b22"
                      strokeWidth={3}
                      dot={{
                        r: 4.5,
                        fill: "#ffffff",
                        stroke: "#ed5b22",
                        strokeWidth: 2.5,
                      }}
                      activeDot={{ r: 7, fill: "#ed5b22" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="transacoes-chart-card dashboard-card-container card-featured-border">
              <h3 className="section-title">Receita Mensal</h3>
              <div className="chart-container-wrapper">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart
                    data={monthlyRevenueData}
                    margin={{ top: 15, right: 20, left: 25, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="rgba(0,0,0,0.08)"
                    />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      stroke="#868883"
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 40000]}
                      ticks={[0, 10000, 20000, 30000, 40000]}
                      tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                      stroke="#868883"
                      dx={-5}
                    />
                    <Tooltip
                      formatter={(val) => [
                        `R$ ${Number(val).toLocaleString("pt-BR")}`,
                        "Receita",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0d9488"
                      strokeWidth={3}
                      dot={{
                        r: 4.5,
                        fill: "#ffffff",
                        stroke: "#0d9488",
                        strokeWidth: 2.5,
                      }}
                      activeDot={{ r: 7, fill: "#0d9488" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bottom-two-columns" style={{ "--i": 5 }}>
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
                    {transacoesFiltradas.map((tx) => (
                      <tr key={tx.id}>
                        <td className="sl-col">#{tx.id}</td>
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
