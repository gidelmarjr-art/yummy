import { useState } from "react";
import { Heart, Map, ZoomIn, X, Maximize2 } from "lucide-react";
import HeaderLanding from "../../components/HeaderLanding/HeaderLanding";
import mapaImg from "./mapa.jpeg";
import "./MapaNavegacao.css";

export default function MapaNavegacao() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="yummy-map-page">
      <HeaderLanding />

      <section className="map-section">
        <div className="map-section__head">
          <p className="map-section__eyebrow">Arquitetura da Informação</p>
          <h2>Mapa de Navegação</h2>
          <p className="map-section__lede">
            Visualize o fluxo completo de telas, subpáginas e modais do
            ecossistema Yummy.
          </p>
        </div>

        <div className="map-panel">
          <div
            className="map-panel__wrapper"
            onClick={() => setIsModalOpen(true)}
            title="Clique para ampliar o mapa"
          >
            <img
              src={mapaImg}
              alt="Mapa de Navegação Yummy"
              className="map-panel__image"
            />
            <div className="map-panel__hint">
              <Maximize2 size={16} /> Toque para ampliar
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE ZOOM / LIGHTBOX */}
      {isModalOpen && (
        <div className="map-modal" onClick={() => setIsModalOpen(false)}>
          <button
            className="map-modal__close"
            onClick={() => setIsModalOpen(false)}
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>

          <div
            className="map-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={mapaImg}
              alt="Mapa de Navegação Yummy Ampliado"
              className="map-modal__image"
            />
          </div>
        </div>
      )}

      <footer className="map-footer">
        <span>Yummy © 2026</span>
        <span>
          Feito com{" "}
          <Heart
            size={14}
            fill="currentColor"
            style={{
              display: "inline",
              verticalAlign: "middle",
              margin: "0 2px",
            }}
          />{" "}
          para a indústria de restaurantes.
        </span>
      </footer>
    </div>
  );
}
