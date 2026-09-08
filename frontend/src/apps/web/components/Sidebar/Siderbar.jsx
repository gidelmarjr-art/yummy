import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

import logoImg from "../../../../imgs/LogoYummy_2.png";

const NAV_ITEMS = [
  { name: "Geral", path: "/dashboard", icon: <FaHome /> },
  { name: "Pedidos", path: "/pedidos", icon: <FaUtensils /> },
  { name: "Cardápio", path: "/cardapio", icon: <FaClipboardList /> },
  { name: "Operacionais", path: "/estoque", icon: <FaTools /> },
  { name: "Transactions", path: "/transacoes", icon: <FaExchangeAlt /> },
  { name: "Relatórios", path: "/relatorios", icon: <FaChartBar /> },
  { name: "Clientes", path: "/clientes", icon: <FaUsers /> },
  { name: "Segurança", path: "/seguranca", icon: <FaLock /> },
  { name: "Configurações", path: "/Configuracoes", icon: <FaCog /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">
        <img src={logoImg} alt="Yummy Logo" className="logo-img" />
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              className={`sidebar-btn ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}