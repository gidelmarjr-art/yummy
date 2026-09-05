import React, { useState } from "react";
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
import "./Geral.css";

export default function Dashboard() {
  const [metrics] = useState({
    totalSales: "R$ 1.480,00",
    activeOrders: 4,
    lowStockItems: 2,
    totalClients: 42
  });

  const [recentOrders] = useState([
    { id: "131.", customer: "João Silva", summary: "1x Sorvete com Brownie", status: "Em preparo", total: "R$ 30,00" },
    { id: "132.", customer: "Maria Oliveira", summary: "2x Codó Burguer", status: "Novos", total: "R$ 90,50" },
    { id: "133.", customer: "Carlos Eduardo", summary: "1x Chopp Artesanal", status: "Prontos", total: "R$ 38,00" },
    { id: "134.", customer: "Ana Paula", summary: "1x Sorvete com Brownie", status: "Entregues", total: "R$ 25,50" }
  ]);

  const [stockAlerts] = useState([
    { name: "Queijo Cheddar Fatiado", qty: "4 kg", status: "Crítico" },
    { name: "Pão de Hambúrguer Artesanal", qty: "15 un", status: "Baixo" }
  ]);

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
          {/* Métricas Principais */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span>Faturamento Hoje</span>
                <span className="metric-icon-wrapper"><FaDollarSign /></span>
              </div>
              <h2 className="metric-value">{metrics.totalSales}</h2>
              <span className="metric-footer">+12% comparado a ontem</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Pedidos Ativos</span>
                <span className="metric-icon-wrapper"><FaUtensils /></span>
              </div>
              <h2 className="metric-value">{metrics.activeOrders}</h2>
              <span className="metric-footer" style={{ color: "#c2410c" }}>Em andamento na cozinha</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Alertas de Estoque</span>
                <span className="metric-icon-wrapper"><FaBoxes /></span>
              </div>
              <h2 className="metric-value">{metrics.lowStockItems}</h2>
              <span className="metric-footer" style={{ color: "#b91c1c" }}>Itens precisando de reposição</span>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Total Clientes</span>
                <span className="metric-icon-wrapper"><FaUsers /></span>
              </div>
              <h2 className="metric-value">{metrics.totalClients}</h2>
              <span className="metric-footer">+3 novos hoje</span>
            </div>
          </div>

          {/* Seções Inferiores (Grids com Pedidos Recentes e Alertas) */}
          <div className="dashboard-sections-grid">
            {/* Bloco de Pedidos Recentes */}
            <div className="dashboard-card-container">
              <h3 className="section-title">Últimos Pedidos em Tempo Real</h3>
              <div className="recent-orders-list">
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