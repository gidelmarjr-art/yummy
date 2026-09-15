import { Link } from "react-router-dom";
import { Heart, Map } from "lucide-react";
import mapaImg from "./mapa.jpeg"; // Agora a imagem está na mesma pasta!
import "./MapaNavegacao.css"; 

export default function MapaNavegacao() {
  return (
    <div className="yummy-map-page">
      {/* Barra de Navegação */}
      <header className="map-nav">
        <div className="map-nav__inner">
          <Link to="/" className="map-nav__logo">
            Yummy<span className="dot">.</span>
          </Link>
          <nav className="map-nav__links">
            <Link to="/">Início</Link>
            <Link to="/mapa-navegacao" style={{ color: "var(--ink)" }}>Mapa de navegação</Link>
            <Link to="/Sobre">Sobre nós</Link>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/login" className="map-btn">Entrar</Link>
            <a href="/#cta" className="map-btn">Falar com o time</a>
          </div>
        </div>
      </header>

      {/* Seção da Página do Mapa */}
      <section className="map-section">
        <div className="map-section__head">
          <p className="map-section__eyebrow">Arquitetura da Informação</p>
          <h2>
            <Map size={28} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} /> 
            Mapa de Navegação
          </h2>
          <p className="map-section__lede">
            Visualize o fluxo completo de telas, subpáginas e modais do ecossistema Yummy.
          </p>
        </div>

        <div className="map-panel">
          <img 
            src={mapaImg} 
            alt="Mapa de Navegação Yummy" 
            className="map-panel__image"
          />
        </div>
      </section>

      {/* Rodapé */}
      <footer className="map-footer">
        <span>Yummy © 2026</span>
        <span>
          Feito com <Heart size={14} fill="currentColor" style={{ display: "inline", verticalAlign: "middle", margin: "0 2px" }} /> para a indústria de restaurantes.
        </span>
      </footer>
    </div>
  );
}