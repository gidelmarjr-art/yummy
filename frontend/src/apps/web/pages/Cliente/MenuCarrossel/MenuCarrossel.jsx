import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import './MenuCarrossel.css';

/**
 * Carrossel de itens de uma categoria do cardápio.
 * Reproduz o efeito do componente "offer-carousel" (cards com hover-lift,
 * zoom na imagem, setas que aparecem ao passar o mouse, scroll com snap)
 * usando CSS puro, para ficar consistente com o resto do projeto
 * (CRA + JSX + CSS — sem Tailwind/shadcn/TypeScript).
 */
export default function MenuCarousel({ title, icon, items, onAdd }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="menu-carousel">
      <div className="menu-carousel__header">
        <span className="menu-carousel__icon">{icon}</span>
        <h3>{title}</h3>
        <span className="menu-carousel__count">{items.length} itens</span>
      </div>

      <div className="menu-carousel__wrapper">
        <button
          className="menu-carousel__arrow menu-carousel__arrow--left"
          onClick={() => scroll("left")}
          aria-label={`Rolar ${title} para a esquerda`}
        >
          <FaChevronLeft />
        </button>

        <div className="menu-carousel__track" ref={scrollRef}>
          {items.map((item) => (
            <div className="menu-carousel-card" key={item.id}>
              <div className="menu-carousel-card__img">
                <img src={item.img} alt={item.title} loading="lazy" />
              </div>
              <div className="menu-carousel-card__body">
                <div className="menu-carousel-card__tag">
                  {icon}
                  <span>{title}</span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>

                <div className="menu-carousel-card__footer">
                  <span className="menu-carousel-card__price">{item.price}</span>
                  <button
                    className="menu-carousel-card__add"
                    onClick={(e) => onAdd(e)}
                    aria-label="Adicionar item"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="menu-carousel__arrow menu-carousel__arrow--right"
          onClick={() => scroll("right")}
          aria-label={`Rolar ${title} para a direita`}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}