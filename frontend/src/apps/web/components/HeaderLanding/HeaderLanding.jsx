import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./HeaderLanding.css";

export default function HeaderLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // Monitora o scroll da página
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

  const handleScrollTo = (id) => {
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
        <Link to="/" className="nav__logo">
          Yummy<span className="dot">.</span>
        </Link>
        <nav className="nav__links">
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
      </div>
    </header>
  );
}
