// TopHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaCog, FaBell, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import "./TopHeader.css";

export default function TopHeader({ title = "Dashboard Geral" }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Lista simulada de notificações de insumos e alertas
  const [notifications] = useState([
    {
      id: 1,
      tipo: "alerta",
      titulo: "Estoque Baixo: Queijo Mussarela",
      desc: "Resta apenas 1.5kg no estoque operacional.",
      tempo: "Há 10 min",
    },
    {
      id: 2,
      tipo: "alerta",
      titulo: "Estoque Crítico: Pão de Hambúrguer",
      desc: "Quantidade abaixo do limite mínimo (12 unidades).",
      tempo: "Há 35 min",
    },
    {
      id: 3,
      tipo: "sucesso",
      titulo: "Pedido #1040 Finalizado",
      desc: "Pagamento confirmado via PIX.",
      tempo: "Há 1 hora",
    },
  ]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="top-bar-header">
      <h1 className="page-heading">{title}</h1>

      <div className="top-bar-right">
        {/* Caixa de Pesquisa */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Pesquisar no sistema..." />
        </div>

        {/* Botão para Configurações */}
        <button
          className="action-circle-btn"
          aria-label="Configurações"
          title="Ir para Configurações"
          onClick={() => navigate("/configuracoes")}
        >
          <FaCog />
        </button>

        {/* Botão de Notificações com Dropdown Popover */}
        <div className="notification-wrapper" ref={dropdownRef}>
          <button
            className={`action-circle-btn ${showNotifications ? "active" : ""}`}
            aria-label="Notificações"
            title="Ver Notificações"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h3>Notificações & Alertas</h3>
                <span className="badge-count">{notifications.length} novas</span>
              </div>

              <div className="dropdown-body">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notification-item ${notif.tipo}`}>
                    <div className="notif-icon">
                      {notif.tipo === "alerta" ? <FaExclamationTriangle /> : <FaCheckCircle />}
                    </div>
                    <div className="notif-content">
                      <h4>{notif.titulo}</h4>
                      <p>{notif.desc}</p>
                      <span className="notif-time">{notif.tempo}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dropdown-footer">
                <button onClick={() => navigate("/estoque")}>Ir para Controle de Estoque</button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar clicável redirecionando para o Perfil da Loja */}
        <div
          className="user-profile-avatar clickable"
          title="Ir para Perfil da Loja"
          onClick={() => navigate("/perfil-loja")}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Perfil da Loja" />
        </div>
      </div>
    </header>
  );
}