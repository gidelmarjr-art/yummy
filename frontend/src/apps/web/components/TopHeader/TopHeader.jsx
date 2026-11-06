// TopHeader.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCog,
  FaBell,
  FaSun,
  FaMoon,
  FaExclamationTriangle,
  FaCheckCircle,
  FaShoppingBag,
  FaBars,
} from "react-icons/fa";
import "./TopHeader.css";
import { useTheme } from "../../../../context/ThemeContext";
import { useSidebar } from "../../../../context/SidebarContext";
import { getGeral } from "../../services/api";

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
  const { toggleSidebar } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationError, setNotificationError] = useState("");
  const dropdownRef = useRef(null);

  // O endpoint /geral já possui as duas fontes de alertas do painel:
  // itens de estoque em atenção e pedidos cujo status ainda é "Novos".
  const carregarNotificacoes = useCallback(async () => {
    try {
      const geral = await getGeral();
      const alertasEstoque = (geral.stockAlerts || []).map((insumo) => ({
        id: `estoque-${insumo.name}`,
        tipo: "alerta",
        titulo: `Estoque ${insumo.status}: ${insumo.name}`,
        desc: `Disponível: ${insumo.qty}. Verifique a reposição.`,
        tempo: "Estoque atual",
        destino: "/operacionais",
      }));
      const pedidosNovos = (geral.recentOrders || [])
        .filter((pedido) => pedido.status === "Novos")
        .map((pedido) => ({
          id: `pedido-${pedido.id}`,
          tipo: "pedido",
          titulo: `Novo pedido #${pedido.id}`,
          desc: `${pedido.customer} — ${pedido.summary}`,
          tempo: "Aguardando atendimento",
          destino: "/pedidos",
        }));

      setNotifications([...pedidosNovos, ...alertasEstoque]);
      setNotificationError("");
    } catch (error) {
      console.error("Não foi possível carregar as notificações.", error);
      setNotificationError("Não foi possível atualizar os alertas agora.");
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    carregarNotificacoes();
    const intervalo = window.setInterval(carregarNotificacoes, 30000);
    return () => window.clearInterval(intervalo);
  }, [carregarNotificacoes]);

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
        <h1 className="page-heading">{title}</h1>
      </div>

      <div className="top-bar-right">
        <div className="top-bar-actions top-bar-mobile-actions">
          <button
            className="action-circle-btn toggle-sidebar-trigger"
            onClick={toggleSidebar}
            aria-label="Abrir menu lateral"
            title="Abrir menu lateral"
          >
            <FaBars />
          </button>
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
              onClick={() => {
                setShowNotifications((aberto) => !aberto);
                carregarNotificacoes();
              }}
            >
              <FaBell />
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="dropdown-header">
                  <h3>Notificações & Alertas</h3>
                  <span className="badge-count">
                    {notifications.length}{" "}
                    {notifications.length === 1 ? "alerta" : "alertas"}
                  </span>
                </div>
                <div className="dropdown-body">
                  {loadingNotifications ? (
                    <p className="notification-state">Atualizando alertas…</p>
                  ) : notificationError ? (
                    <p className="notification-state notification-state-error">
                      {notificationError}
                    </p>
                  ) : notifications.length === 0 ? (
                    <p className="notification-state">
                      Nenhum alerta no momento.
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        type="button"
                        key={notif.id}
                        className={`notification-item ${notif.tipo}`}
                        onClick={() => {
                          setShowNotifications(false);
                          navigate(notif.destino);
                        }}
                      >
                        <div className="notif-icon">
                          {notif.tipo === "alerta" ? (
                            <FaExclamationTriangle />
                          ) : notif.tipo === "pedido" ? (
                            <FaShoppingBag />
                          ) : (
                            <FaCheckCircle />
                          )}
                        </div>
                        <div className="notif-content">
                          <h4>{notif.titulo}</h4>
                          <p>{notif.desc}</p>
                          <span className="notif-time">{notif.tempo}</span>
                        </div>
                      </button>
                    ))
                  )}
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
      </div>
    </header>
  );
}
