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

const PRODUCTS = [
  {
    id: 1,
    category: "lanches",
    title: "Cheeseburger Artesanal",
    desc: "Blend 180g, queijo cheddar, picles e molho especial da casa.",
    price: "R$24,90",
    img: "https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    category: "lanches",
    title: "Batata Rústica com Cheddar",
    desc: "Uma deliciosa porção de batata frita com queijo cheddar.",
    price: "R$14,49",
    img: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    category: "pizzas",
    title: "Pizza Margherita",
    desc: "Molho de tomate, mussarela de búfala e manjericão fresco.",
    price: "R$42,90",
    img: "https://images.unsplash.com/photo-1516383934460-fc1c6e50d7b1?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    category: "japonesa",
    title: "Combo Sushi 20 Peças",
    desc: "Sashimi, uramaki e niguiri selecionados do dia.",
    price: "R$59,90",
    img: "https://images.unsplash.com/photo-1626140814380-dda4c85c79ee?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    category: "saudavel",
    title: "Bowl Fit de Quinoa",
    desc: "Quinoa, grão-de-bico, legumes assados e molho tahine.",
    price: "R$29,90",
    img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    category: "doces",
    title: "Trio de Rosquinhas",
    desc: "Três sabores: chocolate, morango e baunilha.",
    price: "R$16,90",
    img: "https://images.unsplash.com/photo-1519915495817-684cdf876a1c?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 7,
    category: "doces",
    title: "Sundae de Chocolate",
    desc: "Sorvete cremoso com calda quente e chantilly.",
    price: "R$18,90",
    img: "https://images.unsplash.com/photo-1588195539297-f0b4efdb5472?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 8,
    category: "bebidas",
    title: "Suco Natural de Laranja",
    desc: "Extraído na hora, sem adição de açúcar.",
    price: "R$12,90",
    img: "https://images.unsplash.com/photo-1618046364546-81e9d03d39a6?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 9,
    category: "frango",
    title: "Asinhas Apimentadas",
    desc: "10 unidades de frango crocante ao molho buffalo picante.",
    price: "R$32,90",
    img: "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=500&q=80",
  },
];

export default function Home() {
  const containerRef = useRef(null);
  const bannerRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("todos");
  const [cartCount, setCartCount] = useState(2);

  const filteredProducts =
    activeCategory === "todos"
      ? PRODUCTS
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

  const handleAddToCart = (e) => {
    flyToCart(e.currentTarget);
    gsap.fromTo(
      e.currentTarget,
      { scale: 1 },
      { scale: 0.82, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" },
    );
    setCartCount((prev) => prev + 1);
  };

  return (
    <div className="home-page-bg" ref={containerRef}>
      <Header cartCount={cartCount} />

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
                  <span className="product-price">{prod.price}</span>
                  <button
                    className="add-btn"
                    onClick={handleAddToCart}
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
          <button className="btn-see-more">Ver mais</button>
        </div>
      </div>
    </div>
  );
}