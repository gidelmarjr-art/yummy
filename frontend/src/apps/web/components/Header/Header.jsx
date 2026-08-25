import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

import logoYummy from "../../../../imgs/LogoYummy.png";

export default function Header({ cartCount = 2, currentNav = "Home", onSelectNav }) {
  const headerRef = useRef(null);
  const [activeNav, setActiveNav] = useState(currentNav);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const handleNavClick = (item) => {
    setActiveNav(item);
    if (onSelectNav) onSelectNav(item);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="yummy-header" ref={headerRef}>
      <div className="header-container">
        
        <div className="header-logo">
          <img src={logoYummy} alt="Yummy Logo" />
        </div>

        <nav className={`header-nav ${isMobileMenuOpen ? "open" : ""}`}>
          {["Home", "Restaurantes", "Favoritos", "Sobre Nós"].map((item) => (
            <button
              key={item}
              className={`nav-link ${activeNav === item ? "active" : ""}`}
              onClick={() => handleNavClick(item)}
            >
              {item}
              {activeNav === item && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-btn cart-btn" aria-label="Carrinho">
            <FaShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          
          <button className="icon-btn user-btn" aria-label="Perfil">
            <FaUser size={22} />
          </button>

          <button 
            className="mobile-toggle-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

      </div>
    </header>
  );
}