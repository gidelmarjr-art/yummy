import { useState } from "react";
import {
  Heart,
  Map,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import HeaderLanding from "../../components/HeaderLanding/HeaderLanding";
import mapaImg from "./mapa.jpeg";
import "./MapaNavegacao.css";

export default function MapaNavegacao() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%, vai aumentando

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3.5)); // Máximo de 3.5x
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1)); // Mínimo de 1x
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

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
            onClick={() => {
              setZoomLevel(1);
              setIsModalOpen(true);
            }}
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

      {/* MODAL DE ZOOM / LIGHTBOX COM CONTROLOS */}
      {isModalOpen && (
        <div className="map-modal" onClick={() => setIsModalOpen(false)}>
          {/* Barra de controlos de Zoom flutuante */}
          <div
            className="map-modal__controls"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleZoomOut}
              title="Diminuir Zoom"
              className="map-ctrl-btn"
            >
              <ZoomOut size={18} />
            </button>
            <span className="map-zoom-indicator">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Aumentar Zoom"
              className="map-ctrl-btn"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={handleResetZoom}
              title="Redefinir"
              className="map-ctrl-btn"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <button
            className="map-modal__close"
            onClick={() => setIsModalOpen(false)}
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>

          <div
            className="map-modal__container"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={mapaImg}
              alt="Mapa de Navegação Yummy Ampliado"
              className="map-modal__image"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top center",
              }}
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
