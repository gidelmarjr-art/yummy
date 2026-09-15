import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaCog,
  FaBell,
  FaUtensils,
  FaBoxes,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
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

  return (
    <div className="dashboard-page-layout">
      <Sidebar />

      <main className="dashboard-main-content">
        {/* Header Superior */}
        <header className="dashboard-top-bar">
          <h1 className="page-heading">Dashboard Geral</h1>

          <div className="top-bar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Pesquisar no sistema..." />
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
                alt="Avatar"
              />
            </div>
          </div>
        </header>

        {/* Corpo Laranja */}
        <div className="dashboard-body-content">
          {erro && <p className="dashboard-error-msg">{erro}</p>}

          {/* Métricas Principais */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span>Faturamento Hoje</span>
                <span className="metric-icon-wrapper"><FaDollarSign /></span>
              </div>
              <h2 className="metric-value">{carregando ? "…" : metrics.totalSales}</h2>
              <span className="metric-footer">Concluído hoje</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Pedidos Ativos</span>
                <span className="metric-icon-wrapper"><FaUtensils /></span>
              </div>
              <h2 className="metric-value">{carregando ? "…" : metrics.activeOrders}</h2>
              <span className="metric-footer" style={{ color: "#c2410c" }}>Em andamento na cozinha</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Alertas de Estoque</span>
                <span className="metric-icon-wrapper"><FaBoxes /></span>
              </div>
              <h2 className="metric-value">{carregando ? "…" : metrics.lowStockItems}</h2>
              <span className="metric-footer" style={{ color: "#b91c1c" }}>Itens precisando de reposição</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Total Clientes</span>
                <span className="metric-icon-wrapper"><FaUsers /></span>
              </div>
              <h2 className="metric-value">{carregando ? "…" : metrics.totalClients}</h2>
              <span className="metric-footer">Cadastrados na plataforma</span>
            </div>
          </div>

          {/* Seções Inferiores (Grids com Pedidos Recentes e Alertas) */}
          <div className="dashboard-sections-grid">
            {/* Bloco de Pedidos Recentes */}
            <div className="dashboard-card-container">
              <h3 className="section-title">Últimos Pedidos em Tempo Real</h3>
              <div className="recent-orders-list">
                {!carregando && recentOrders.length === 0 && (
                  <p className="dashboard-empty-msg">Nenhum pedido ainda.</p>
                )}
                {recentOrders.map((order) => (
                  <div key={order.id} className="recent-order-item">
                    <div className="order-info-group">
                      <strong className="order-client">#{order.id} - {order.customer}</strong>
                      <span className="order-detail-sub">{order.summary}</span>
                    </div>

                    <span className={`status-pill status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {order.status}
                    </span>

                    <span className="order-price">{order.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloco de Alertas de Estoque */}
            <div className="dashboard-card-container">
              <h3 className="section-title">Insumos Críticos</h3>
              <div className="stock-alerts-list">
                {!carregando && stockAlerts.length === 0 && (
                  <p className="dashboard-empty-msg">Nenhum alerta — estoque saudável.</p>
                )}
                {stockAlerts.map((stock, idx) => (
                  <div key={idx} className="stock-alert-item">
                    <div className="order-info-group">
                      <strong className="stock-name">{stock.name}</strong>
                      <span className="order-detail-sub">Qtd atual: {stock.qty}</span>
                    </div>

                    <span className={stock.status === "Crítico" ? "stock-badge-critical" : "stock-badge-low"}>
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
