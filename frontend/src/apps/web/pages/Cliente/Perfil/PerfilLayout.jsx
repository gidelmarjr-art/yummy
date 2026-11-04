import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCreditCard,
  FaHeart,
  FaHome,
  FaLock,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import "./Perfil.css";
import { useTheme } from "../../../../../context/ThemeContext";
import { useCart } from "../../../../../context/CartContext";

const NAVIGATION = [
  { label: "Visão geral", path: "/perfil", icon: <FaHome /> },
  { label: "Dados pessoais", path: "/perfil/dados-pessoais", icon: <FaUser /> },
  { label: "Endereços", path: "/perfil/enderecos", icon: <FaMapMarkerAlt /> },
  { label: "Meus pedidos", path: "/perfil/pedidos", icon: <FaShoppingBag /> },
  { label: "Favoritos", path: "/perfil/favoritos", icon: <FaHeart /> },
  { label: "Pagamentos", path: "/perfil/pagamentos", icon: <FaCreditCard /> },
  { label: "Segurança", path: "/perfil/seguranca", icon: <FaLock /> },
];

export default function PerfilLayout({ title, description, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { totalItemsCount } = useCart();

  const handleLogout = () => {
    // 1. Limpa os dados de sessão do usuário
    localStorage.clear();
    sessionStorage.clear();

    // 2. Redireciona para a tela de login ou home
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <header className="profile-topbar">
        <button
          className="profile-back"
          onClick={() => navigate("/home")}
          aria-label="Voltar ao cardápio"
        >
          <FaArrowLeft />
        </button>
        <Link to="/home" className="profile-brand">
          Yummy
        </Link>
        <div className="profile-topbar-actions">
          <button
            type="button"
            className="profile-theme-toggle"
            onClick={toggleTheme}
            aria-label="Alternar entre tema claro e escuro"
            title="Alternar tema"
          >
            {theme === "escuro" ? <FaSun /> : <FaMoon />}
          </button>
          <Link
            to="/carrinho"
            className="profile-cart"
            aria-label="Abrir carrinho"
          >
            <FaShoppingCart />
            <span>Carrinho</span>
            {totalItemsCount > 0 && (
              <span className="profile-cart-badge">{totalItemsCount}</span>
            )}
          </Link>
        </div>
      </header>

      <main className="profile-shell">
        <aside className="profile-sidebar">
          <div className="profile-sidebar__heading">
            <span className="profile-sidebar__avatar">
              <FaUser />
            </span>
            <div>
              <strong>Minha conta</strong>
              <small>Gerencie seu perfil</small>
            </div>
          </div>

          <nav aria-label="Navegação do perfil">
            {NAVIGATION.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`profile-nav-link ${location.pathname === item.path ? "is-active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Botão Sair com mesma classe e animação de hover */}
            <button
              type="button"
              onClick={handleLogout}
              className="profile-nav-link profile-nav-logout"
            >
              <FaSignOutAlt />
              <span>Sair</span>
            </button>
          </nav>
        </aside>

        <section className="profile-content">
          <div className="profile-title">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {children}
        </section>
      </main>
    </div>
  );
}
