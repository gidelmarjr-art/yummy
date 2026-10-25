// TopHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCog,
  FaBell,
  FaSun,
  FaMoon,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBars,
} from "react-icons/fa";
import "./TopHeader.css";
import { useTheme } from "../../../../context/ThemeContext";
import { useSidebar } from "../../../../context/SidebarContext";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const alternarTema = (e) => {
    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;
    const raioFinal = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const aplicar = () => {
      toggleTheme();
    };

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      aplicar();
      return;
    }

    const transition = document.startViewTransition(() => aplicar());
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${raioFinal}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 750,
          easing: "cubic-bezier(.65,0,.35,1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <button
      className="action-circle-btn"
      onClick={alternarTema}
      aria-label="Alternar tema"
      title="Alternar entre tema claro e escuro"
    >
      {theme === "escuro" ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default function TopHeader({ title = "Dashboard Geral" }) {
  const navigate = useNavigate();
  const { isOpen: isSidebarOpen, toggleSidebar } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

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
      tipo: "sucesso",
      titulo: "Pedido #1040 Finalizado",
      desc: "Pagamento confirmado via PIX.",
      tempo: "Há 1 hora",
    },
  ]);

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
      <div className="top-bar-left-group">
        {toggleSidebar && (!isSidebarOpen || window.innerWidth <= 768) && (
          <button
            className="action-circle-btn toggle-sidebar-trigger"
            onClick={toggleSidebar}
            aria-label="Abrir menu"
          >
            <FaBars />
          </button>
        )}
        <h1 className="page-heading">{title}</h1>
      </div>

      <div className="top-bar-right">
        <ThemeToggleButton />

        <button
          className="action-circle-btn"
          aria-label="Configurações"
          onClick={() => navigate("/configuracoes")}
        >
          <FaCog />
        </button>

        <div className="notification-wrapper" ref={dropdownRef}>
          <button
            className={`action-circle-btn ${showNotifications ? "active" : ""}`}
            aria-label="Notificações"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h3>Notificações & Alertas</h3>
                <span className="badge-count">
                  {notifications.length} novas
                </span>
              </div>
              <div className="dropdown-body">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.tipo}`}
                  >
                    <div className="notif-icon">
                      {notif.tipo === "alerta" ? (
                        <FaExclamationTriangle />
                      ) : (
                        <FaCheckCircle />
                      )}
                    </div>
                    <div className="notif-content">
                      <h4>{notif.titulo}</h4>
                      <p>{notif.desc}</p>
                      <span className="notif-time">{notif.tempo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="user-profile-avatar clickable"
          onClick={() => navigate("/perfil-loja")}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            alt="Avatar"
          />
        </div>
      </div>
    </header>
  );
}


