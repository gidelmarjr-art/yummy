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
  FaPlusCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Sidebar.css";

import logoImg from "../../../../imgs/LogoYummy_2.png";
import { logout } from "../../services/api";

const NAV_ITEMS = [
  { name: "Geral", path: "/dashboard", icon: <FaHome /> },
  { name: "Pedidos", path: "/pedidos", icon: <FaUtensils /> },
  { name: "Cardápio", path: "/cardapio", icon: <FaClipboardList /> },
  { name: "Cadastro de Pratos", path: "/cadastro-pratos", icon: <FaPlusCircle /> },
  { name: "Operacionais", path: "/estoque", icon: <FaTools /> },
  { name: "Transactions", path: "/transacoes", icon: <FaExchangeAlt /> },
  { name: "Relatórios", path: "/relatorios", icon: <FaChartBar /> },
  { name: "Clientes", path: "/clientes", icon: <FaUsers /> },
  { name: "Segurança", path: "/seguranca", icon: <FaLock /> },
  { name: "Configurações", path: "/configuracoes", icon: <FaCog /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // mesmo que a chamada falhe, ainda limpamos o token localmente
    }
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">
        <img src={logoImg} alt="Yummy Logo" className="logo-img" />
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();

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

        <button className="sidebar-btn sidebar-btn--logout" onClick={handleLogout}>
          <span className="sidebar-icon"><FaSignOutAlt /></span>
          <span className="sidebar-label">Sair</span>
        </button>
      </nav>
    </aside>
  );
}
