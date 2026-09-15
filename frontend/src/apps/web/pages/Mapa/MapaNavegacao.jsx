import { Link } from "react-router-dom";
import { Heart, Map } from "lucide-react";
import mapaImg from "../../imgs/mapa.jpeg"; 
import "../../Landing.css"; // Estilos globais padrão do site
import "./MapaNavegacao.css"; // Estilos específicos da página do mapa

export default function MapaNavegacao() {
  return (
    <div className="yummy-lp">
      {/* Barra de Navegação padrão */}
      <header className="nav">
        <div className="nav__inner">
          <Link to="/" className="nav__logo">
            Yummy<span className="dot">.</span>
          </Link>
          <nav className="nav__links">
            <Link to="/">Início</Link>
            <Link to="/mapa-navegacao" style={{ color: "var(--ink)" }}>Mapa de navegação</Link>
            <Link to="/Sobre">Sobre nós</Link>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/login" className="btn btn--ghost">Entrar</Link>
            <a href="/#cta" className="btn btn--ghost">Falar com o time</a>
          </div>
        </div>
      </header>

      {/* Seção da Página do Mapa */}
      <section className="map-page">
        <div className="section__head" style={{ marginBottom: "2rem" }}>
          <p className="eyebrow">Arquitetura da Informação</p>
          <h2>
            <Map size={28} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} /> 
            Mapa de Navegação
          </h2>
          <p className="section__lede">
            Visualize o fluxo completo de telas, subpáginas e modais do ecossistema Yummy.
          </p>
        </div>

        <div className="map-container">
          <img 
            src={mapaImg} 
            alt="Mapa de Navegação Yummy" 
            className="map-image"
          />
        </div>
      </section>

      {/* Rodapé padrão */}
      <footer className="footer">
        <span>Yummy © 2026</span>
        <span>
          Feito com <Heart size={14} fill="currentColor" style={{ display: "inline", verticalAlign: "middle", margin: "0 2px" }} /> para a indústria de restaurantes.
        </span>
      </footer>
    </div>
  );
}