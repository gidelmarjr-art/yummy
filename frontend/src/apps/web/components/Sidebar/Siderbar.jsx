import React, { useState } from "react";
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
  FaStore,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./Sidebar.css";

import logoImg from "../../../../imgs/LogoYummy_2.png";
import { logout } from "../../services/api";

const NAV_ITEMS = [
  { name: "Geral", path: "/dashboard", icon: <FaHome /> },
  { name: "Perfil da Loja", path: "/perfil-loja", icon: <FaStore /> },
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

export default function Sidebar({ toggleSidebar: externalToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Lê o estado do localStorage para manter o menu recolhido/aberto em todas as abas
  const [internalIsOpen, setInternalIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebar_open");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  const isOpen = internalIsOpen;

  const handleToggle = () => {
    const newState = !isOpen;
    setInternalIsOpen(newState);
    localStorage.setItem("sidebar_open", JSON.stringify(newState));

    if (typeof externalToggle === "function") {
      externalToggle();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Falha silenciosa
    }
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <aside className={`sidebar-container ${!isOpen ? "is-closed" : ""}`}>
      {/* Botão flutuante na borda */}
      <button
        className="sidebar-toggle-edge-btn"
        onClick={handleToggle}
        aria-label="Alternar Menu Lateral"
        title={isOpen ? "Recolher Menu" : "Expandir Menu"}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      <div className="sidebar-content-wrapper">
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
                title={!isOpen ? item.name : ""}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.name}</span>
              </button>
            );
          })}

          <button
            className="sidebar-btn sidebar-btn--logout"
            onClick={handleLogout}
            title={!isOpen ? "Sair" : ""}
          >
            <span className="sidebar-icon"><FaSignOutAlt /></span>
            <span className="sidebar-label">Sair</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}