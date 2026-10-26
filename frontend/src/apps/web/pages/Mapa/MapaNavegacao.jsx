import { Link } from "react-router-dom";
import { Heart, Map } from "lucide-react";
import HeaderLanding from "../../components/HeaderLanding/HeaderLanding";
import mapaImg from "./mapa.jpeg"; // Agora a imagem está na mesma pasta!
import "./MapaNavegacao.css";

export default function MapaNavegacao() {
  return (
    <div className="yummy-map-page">
      {/* Seção da Página do Mapa */}
      <section className="map-section">
        <div className="map-section__head">
          <p className="map-section__eyebrow">Arquitetura da Informação</p>
          <h2>
            <Map
              size={28}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginRight: 8,
              }}
            />
            Mapa de Navegação
          </h2>
          <p className="map-section__lede">
            Visualize o fluxo completo de telas, subpáginas e modais do
            ecossistema Yummy.
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
