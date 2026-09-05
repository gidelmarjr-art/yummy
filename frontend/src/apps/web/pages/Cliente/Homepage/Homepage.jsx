import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  FaStar, 
  FaPlus,
  FaPizzaSlice,
  FaHamburger,
  FaUtensils,
  FaIceCream
} from "react-icons/fa"; // FaSearch removido daqui
import "./Homepage.css";

import Header from "../../../components/Header/Header";

const BANNER_IMG = "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80";
const RESTAURANT_AVATAR = "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=150&q=80";
const FOOD_THUMB = "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=500&q=80";

const CATEGORIES = ["Bebidas", "Sanduiches", "Doces", "Adicionais", "Gelados"];

const PRODUCTS = [
  { id: 1, title: "Comida 1", desc: "Uma deliciosa porção de batata frita com queijo cheddar", price: "R$14,49" },
  { id: 2, title: "Comida 1", desc: "Uma deliciosa porção de batata frita com queijo cheddar", price: "R$14,49" },
  { id: 3, title: "Comida 1", desc: "Uma deliciosa porção de batata frita com queijo cheddar", price: "R$14,49" },
  { id: 4, title: "Comida 1", desc: "Uma deliciosa porção de batata frita com queijo cheddar", price: "R$14,49" },
];

export default function Home() {
  const containerRef = useRef(null);
  const bannerRef = useRef(null);
  
  const [activeCategory, setActiveCategory] = useState("Adicionais");
  const [cartCount, setCartCount] = useState(2);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".search-container",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.2 }
      );

      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out", delay: 0.35 }
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
          delay: 0.5 
        }
      );

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to(".parallax-bg", {
          x: xPos,
          y: yPos,
          duration: 1.2,
          ease: "power1.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <div className="home-page-bg" ref={containerRef}>
      <Header cartCount={cartCount} />

      <div className="bg-pattern"></div>

      <div className="floating-icons-container parallax-bg">
        <FaPizzaSlice className="food-icon icon-1" />
        <FaHamburger className="food-icon icon-2" />
        <FaUtensils className="food-icon icon-3" />
        <FaIceCream className="food-icon icon-4" />
      </div>

      <div className="bg-shape shape-1 parallax-bg"></div>
      <div className="bg-shape shape-2 parallax-bg"></div>

      <div className="home-main-layout">

        {/* O search-container foi removido daqui e levado para o Header */}

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
            </div>

            <div className="restaurant-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="star-icon" />
              ))}
            </div>
          </div>
        </div>

        <div className="categories-wrapper stagger-item">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="section-header stagger-item">
          <h2>Mais pedidos</h2>
        </div>

        <div className="products-grid">
          {PRODUCTS.map((prod) => (
            <div key={prod.id} className="product-card stagger-item">
              <div className="product-img-wrapper">
                <img src={FOOD_THUMB} alt={prod.title} />
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