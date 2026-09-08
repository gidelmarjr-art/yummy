import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa"; // FaSearch adicionado aqui
import logoIcone from "../../../../imgs/LogoYummy.png";
import "./Header.css";

export default function Header({ cartCount }) {
  return (
    <header className="yummy-header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/home">
            <img src={logoIcone} alt="Yummy Logo" />
          </Link>
        </div>

        {/* Barra de pesquisa centralizada */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Pesquisar..." />
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