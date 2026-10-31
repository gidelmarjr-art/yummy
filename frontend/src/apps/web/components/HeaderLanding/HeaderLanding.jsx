import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./HeaderLanding.css";

export default function HeaderLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fecha o menu móvel ao mudar de rota ou redimensionar para desktop
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleScrollTo = (id) => {
    setIsMobileMenuOpen(false);
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`nav ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav__inner">
        {/* PARTE 1: Logo à esquerda */}
        <div className="nav__left">
          <Link to="/" className="nav__logo">
            Yummy<span className="dot">.</span>
          </Link>
        </div>

        {/* PARTE 2: Os links centralizados (Desktop) */}
        <nav className="nav__center">
          <button
            onClick={() => handleScrollTo("fluxo")}
            className="nav__link-btn"
          >
            O fluxo
          </button>
          <button
            onClick={() => handleScrollTo("modulos")}
            className="nav__link-btn"
          >
            Módulos
          </button>
          <button
            onClick={() => handleScrollTo("tempo-real")}
            className="nav__link-btn"
          >
            Tempo real
          </button>
          <Link to="/Sobre">Sobre nós</Link>
          <Link to="/mapa-navegacao">Mapa de navegação</Link>
        </nav>

        {/* PARTE 3: Ações à direita (Desktop) */}
        <div className="nav__right">
          <Link to="/login" className="btn btn--ghost">
            Entrar
          </Link>
          <button
            onClick={() => handleScrollTo("cta")}
            className="btn btn--primary"
          >
            Falar com o time
          </button>
        </div>

        {/* PARTE 4: Botão do Menu Hambúrguer (Mobile) */}
        <button
          className="nav__hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menu de navegação"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MENU MOBILE / SIDEBAR */}
      <div className={`nav__mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <nav className="nav__mobile-links">
          <button
            onClick={() => handleScrollTo("fluxo")}
            className="nav__link-btn"
          >
            O fluxo
          </button>
          <button
            onClick={() => handleScrollTo("modulos")}
            className="nav__link-btn"
          >
            Módulos
          </button>
          <button
            onClick={() => handleScrollTo("tempo-real")}
            className="nav__link-btn"
          >
            Tempo real
          </button>
          <Link to="/Sobre" onClick={() => setIsMobileMenuOpen(false)}>
            Sobre nós
          </Link>
          <Link to="/mapa-navegacao" onClick={() => setIsMobileMenuOpen(false)}>
            Mapa de navegação
          </Link>
        </nav>

        <div className="nav__mobile-actions">
          <Link
            to="/login"
            className="btn btn--ghost"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Entrar
          </Link>
          <button
            onClick={() => handleScrollTo("cta")}
            className="btn btn--primary"
          >
            Falar com o time
          </button>
        </div>
      </div>
    </header>
  );
}
