import { Link } from "react-router-dom";
import { Heart, Map } from "lucide-react";
import "./Landing.css"; // Reaproveita os estilos padrão da Landing Page

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
      <section style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="section__head" style={{ marginBottom: "2rem" }}>
          <p className="eyebrow">Arquitetura da Informação</p>
          <h2><Map size={28} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} /> Mapa de Navegação</h2>
          <p className="section__lede">
            Visualize o fluxo completo de telas, subpáginas e modais do ecossistema Yummy.
          </p>
        </div>

        <div style={{
          width: "100%",
          maxWidth: "1100px",
          background: "var(--navy-2)",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "1.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          overflow: "auto"
        }}>
          <img 
            src="/mapa.jpeg" 
            alt="Mapa de Navegação Yummy" 
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
          />
        </div>
      </section>

      {/* Rodapé padrão */}
      <footer className="footer">
        <span>Yummy © 2026</span>
        <span>Feito com <Heart size={14} fill="currentColor" style={{ display: "inline", verticalAlign: "middle", margin: "0 2px" }} /> para a indústria de restaurantes.</span>
      </footer>
    </div>
  );
}