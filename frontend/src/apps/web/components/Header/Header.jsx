import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logoIcone from "../../../../imgs/LogoYummy.png";
import "./Header.css";

export default function Header({ cartCount }) {
  const location = useLocation();
  const isActive = (path) => location.pathname.toLowerCase() === path.toLowerCase();

  return (
    <header className="yummy-header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/home">
            <img src={logoIcone} alt="Yummy Logo" />
          </Link>
        </div>

        <nav className="header-nav">
          <Link 
            to="/home" 
            className={`nav-link ${isActive("/home") ? "active" : ""}`}
          >
            Home
            {isActive("/home") && <span className="nav-indicator" />}
          </Link>

          <Link 
            to="/restaurantes" 
            className={`nav-link ${isActive("/restaurantes") ? "active" : ""}`}
          >
            Restaurantes
            {isActive("/restaurantes") && <span className="nav-indicator" />}
          </Link>

          <Link 
            to="/favoritos" 
            className={`nav-link ${isActive("/favoritos") ? "active" : ""}`}
          >
            Favoritos
            {isActive("/favoritos") && <span className="nav-indicator" />}
          </Link>

          <Link 
            to="/Sobre" 
            className={`nav-link ${isActive("/Sobre") ? "active" : ""}`}
          >
            Sobre Nós
            {isActive("/Sobre") && <span className="nav-indicator" />}
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/carrinho" className="icon-btn" aria-label="Carrinho">
            <FaShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <Link to="/dashboard" className="icon-btn" aria-label="Perfil">
            <FaUser size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}