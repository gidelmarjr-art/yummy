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
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import { useRealtimeTransactions } from "./useRealtimeTransactions";
import "./Transacoes.css";

export default function Transacoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const { metrics, yearlyData, monthlyRevenueData, channelsData, recentTransactions } =
    useRealtimeTransactions();

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
    <div className="transacoes-page-layout">
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
        <div className="transacoes-dashboard-body">
          {/* Top Metrics Cards */}
          <div className="metrics-cards-row">
            <div className="metric-summary-card">
              <div className="metric-icon-circle cyan-bg">
                <FaWallet className="icon-cyan" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Faturamento Total</span>
                <strong className="metric-value">{metrics.totalRevenue}</strong>
              </div>
            </div>

            <div className="metric-summary-card">
              <div className="metric-icon-circle pink-bg">
                <FaReceipt className="icon-pink" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total de Transações</span>
                <strong className="metric-value">{metrics.numTransactions}</strong>
              </div>
            </div>

            <div className="metric-summary-card">
              <div className="metric-icon-circle blue-bg">
                <FaSyncAlt className="icon-blue" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Ticket Médio</span>
                <strong className="metric-value">{metrics.averageTicket}</strong>
              </div>
            </div>
          </div>

          {/* Middle Charts Row */}
          <div className="charts-two-columns">
            {/* Faturamento Anual */}
            <div className="transacoes-chart-card">
              <h3>Faturamento Anual</h3>
              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer>
                  <LineChart data={yearlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 50000]}
                      ticks={[0, 10000, 20000, 30000, 40000, 50000]}
                      tickFormatter={(val) => `R$${val.toLocaleString()}`}
                    />
                    <Tooltip formatter={(val) => [`R$ ${val.toLocaleString()}`, "Faturamento"]} />
                    <Line
                      type="linear"
                      dataKey="amount"
                      stroke="#ffaa00"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#ffffff", stroke: "#ffaa00", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Receita Mensal */}
            <div className="transacoes-chart-card highlight-border">
              <h3>Receita Mensal</h3>
              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer>
                  <LineChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 40000]}
                      ticks={[0, 10000, 20000, 30000, 40000]}
                      tickFormatter={(val) => `R$${val.toLocaleString()}`}
                    />
                    <Tooltip formatter={(val) => [`R$ ${val.toLocaleString()}`, "Receita"]} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#00d2b5"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: "#00d2b5" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-two-columns">
            {/* Receita por Canal */}
            <div className="investments-list-section">
              <h3>Receita por Canal</h3>
              <div className="investments-list">
                {channelsData.map((item) => (
                  <div key={item.id} className="investment-item-card">
                    <div className="investment-left">
                      <div
                        className="investment-icon-box"
                        style={{ backgroundColor: item.bg, color: item.iconColor }}
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
                        <strong className={item.isPositive ? "text-positive" : "text-negative"}>
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
            <div className="trending-stock-section">
              <h3>Transações Recentes</h3>
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
                        <td className={`return-col ${tx.isPositive ? "text-positive" : "text-negative"}`}>
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