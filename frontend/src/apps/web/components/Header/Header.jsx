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