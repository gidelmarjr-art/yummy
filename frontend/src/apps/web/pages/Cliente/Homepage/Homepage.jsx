import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  FaStar,
  FaPlus,
  FaPizzaSlice,
  FaHamburger,
  FaUtensils,
  FaIceCream,
  FaFish,
  FaLeaf,
  FaCookieBite,
  FaGlassMartiniAlt,
  FaDrumstickBite,
  FaClock,
  FaMotorcycle,
} from "react-icons/fa";
import "./Homepage.css";

import Header from "../../../components/Header/Header";
import MenuCarousel from '../MenuCarrossel/MenuCarrossel';
import { PRODUCTS } from "./Productsdata";
import { useCart } from "../../../../../context/CartContext";

const BANNER_IMG =
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80";
const RESTAURANT_AVATAR =
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=150&q=80";

const CATEGORIES = [
  { id: "todos", label: "Tudo", icon: <FaUtensils /> },
  { id: "lanches", label: "Lanches", icon: <FaHamburger /> },
  { id: "pizzas", label: "Pizzas", icon: <FaPizzaSlice /> },
  { id: "japonesa", label: "Japonesa", icon: <FaFish /> },
  { id: "saudavel", label: "Saudável", icon: <FaLeaf /> },
  { id: "doces", label: "Doces", icon: <FaCookieBite /> },
  { id: "bebidas", label: "Bebidas", icon: <FaGlassMartiniAlt /> },
  { id: "frango", label: "Frango", icon: <FaDrumstickBite /> },
];

// PRODUCTS agora vem de ./productsData.js, que monta a lista automaticamente
// a partir das fotos em src/imgs/<Categoria>/. Basta adicionar uma nova
// imagem lá dentro que ela aparece aqui sem precisar editar este arquivo.

// Quantos produtos de cada categoria aparecem na aba "Tudo" (destaques)
const HIGHLIGHTS_PER_CATEGORY = 2;

// Monta os destaques pegando N produtos de cada categoria (na ordem em que
// aparecem em PRODUCTS), em vez de mostrar o cardápio inteiro de uma vez.
function getHighlights(products, categoryIds, count) {
  const highlights = [];
  categoryIds.forEach((categoryId) => {
    const fromCategory = products.filter((p) => p.category === categoryId);
    highlights.push(...fromCategory.slice(0, count));
  });
  return highlights;
}

export default function Home() {
  const containerRef = useRef(null);
  const bannerRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("todos");
  const [mostrarTudo, setMostrarTudo] = useState(false);
  const { addToCart, totalItemsCount } = useCart();

  const CATEGORIAS_REAIS = CATEGORIES.filter((c) => c.id !== "todos");

  const highlightProducts = getHighlights(
    PRODUCTS,
    CATEGORIAS_REAIS.map((c) => c.id),
    HIGHLIGHTS_PER_CATEGORY,
  );

  const filteredProducts =
    activeCategory === "todos"
      ? highlightProducts
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const activeLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "Tudo";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".search-container",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.2 },
      );

      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out", delay: 0.35 },
      );

      gsap.fromTo(
        ".stagger-item",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.5,
        },
      );

      gsap.fromTo(
        ".category-pill",
        { opacity: 0, y: 14, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.05,
          duration: 0.45,
          ease: "back.out(1.6)",
          delay: 0.55,
        },
      );

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to(".parallax-bg", {
          x: xPos,
          y: yPos,
          duration: 1.2,
          ease: "power1.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Reanima o grid de produtos toda vez que a categoria muda
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        { opacity: 0, y: 24, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.45,
          ease: "power2.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeCategory]);

  // Anima a seção "cardápio completo" quando o Ver mais é aberto
  useEffect(() => {
    if (!mostrarTudo) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".menu-carousel",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: "power2.out",
        },
      );
    }, containerRef);

    requestAnimationFrame(() => {
      document
        .querySelector(".full-menu-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => ctx.revert();
  }, [mostrarTudo]);

  const flyToCart = (originEl) => {
    const cartEl = document.querySelector(
      '.header-actions a[aria-label="Carrinho"]',
    );
    if (!originEl || !cartEl) return;

    const originRect = originEl.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();

    const flyer = document.createElement("div");
    flyer.className = "fly-to-cart";
    document.body.appendChild(flyer);

    gsap.set(flyer, {
      left: originRect.left + originRect.width / 2,
      top: originRect.top + originRect.height / 2,
    });

    gsap.to(flyer, {
      left: cartRect.left + cartRect.width / 2,
      top: cartRect.top + cartRect.height / 2,
      scale: 0.2,
      opacity: 0.5,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => {
        flyer.remove();
        gsap.fromTo(
          cartEl,
          { scale: 1 },
          { scale: 1.28, duration: 0.14, yoyo: true, repeat: 1, ease: "power1.inOut" },
        );
      },
    });
  };

  const handleAddToCart = (product, e) => {
    flyToCart(e.currentTarget);
    gsap.fromTo(
      e.currentTarget,
      { scale: 1 },
      { scale: 0.82, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" },
    );
    addToCart(product);
  };

  return (
    <div className="home-page-bg" ref={containerRef}>
      <Header cartCount={totalItemsCount} />

      <div className="bg-pattern"></div>

      <div className="floating-icons-container parallax-bg">
        <FaPizzaSlice className="food-icon icon-1" />
        <FaHamburger className="food-icon icon-2" />
        <FaFish className="food-icon icon-3" />
        <FaIceCream className="food-icon icon-4" />
        <FaCookieBite className="food-icon icon-5" />
        <FaDrumstickBite className="food-icon icon-6" />
      </div>

      <div className="bg-shape shape-1 parallax-bg"></div>
      <div className="bg-shape shape-2 parallax-bg"></div>

      <div className="home-main-layout">
        <div className="restaurant-banner-card" ref={bannerRef}>
          <div className="banner-cover-wrapper">
            <img src={BANNER_IMG} alt="Restaurante Banner" className="banner-cover" />
          </div>

          <div className="restaurant-info-bar">
            <div className="restaurant-avatar-wrapper">
              <img src={RESTAURANT_AVATAR} alt="Codó Burger" className="restaurant-avatar" />
            </div>

            <div className="restaurant-details">
              <h1 className="restaurant-name">Codó burger</h1>
              <div className="restaurant-meta">
                <span className="address">Setor leste, quadra 42, lote 01</span>
                <span className="status-tag">Aberto Agora</span>
              </div>
              <div className="restaurant-chips">
                <span className="info-chip">
                  <FaClock /> 25–35 min
                </span>
                <span className="info-chip">
                  <FaMotorcycle /> Frete R$4,99
                </span>
                <span className="info-chip info-chip--rating">
                  <FaStar /> 4.8 · 320 avaliações
                </span>
              </div>
            </div>

            <div className="restaurant-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="star-icon" />
              ))}
            </div>
          </div>
        </div>

        <div className="promo-banner stagger-item">
          <span className="promo-banner__dot" />
          <span>
            <strong>Oferta do dia:</strong> Pizza Margherita com 15% OFF até
            as 22h
          </span>
        </div>

        <div className="categories-wrapper">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="category-pill__icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="section-header stagger-item">
          <h2>{activeCategory === "todos" ? "Mais pedidos" : activeLabel}</h2>
          <span className="section-header__count">
            {filteredProducts.length} opções
          </span>
        </div>

        <div className="products-grid" key={activeCategory}>
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="product-card">
              <div className="product-img-wrapper">
                <img src={prod.img} alt={prod.title} loading="lazy" />
              </div>
              <div className="product-info">
                <h3 className="product-title">{prod.title}</h3>
                <p className="product-desc">{prod.desc}</p>

                <div className="product-footer">
                  <span className="product-price">
                    {prod.price || "Consulte"}
                  </span>
                  <button
                    className="add-btn"
                    onClick={(e) => handleAddToCart(prod, e)}
                    aria-label="Adicionar item"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="see-more-container stagger-item">
          <button
            className="btn-see-more"
            onClick={() => setMostrarTudo((v) => !v)}
          >
            {mostrarTudo ? "Ver menos" : "Ver Cardápio Completo"}
          </button>
        </div>

        {mostrarTudo && (
          <div className="full-menu-section">
            <div className="full-menu-section__header">
              <h2>Cardápio completo</h2>
              <p>Todas as categorias, com alguns exemplos de cada uma.</p>
            </div>

            {CATEGORIAS_REAIS.map((cat) => (
              <MenuCarousel
                key={cat.id}
                title={cat.label}
                icon={cat.icon}
                items={PRODUCTS.filter((p) => p.category === cat.id)}
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}