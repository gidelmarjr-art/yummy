import React from "react";
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaTools,
  FaExchangeAlt,
  FaChartBar,
  FaUsers,
  FaLock,
  FaCog,
} from "react-icons/fa";
import "./Sidebar.css";

// Substitua pelo caminho exato da sua imagem de logo
import logoImg from "../../../../imgs/LogoYummy_2.png";

const NAV_ITEMS = [
  { name: "Dashboard", icon: <FaHome /> },
  { name: "Pedidos", icon: <FaUtensils /> },
  { name: "Cardápio", icon: <FaClipboardList />, active: true },
  { name: "Operacionais", icon: <FaTools /> },
  { name: "Transactions", icon: <FaExchangeAlt /> },
  { name: "Relatórios", icon: <FaChartBar /> },
  { name: "Clientes", icon: <FaUsers /> },
  { name: "Segurança", icon: <FaLock /> },
  { name: "Configurações", icon: <FaCog /> },
];

export default function Sidebar() {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">
        <img src={logoImg} alt="Yummy Logo" className="logo-img" />
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.name}
            className={`sidebar-btn ${item.active ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}