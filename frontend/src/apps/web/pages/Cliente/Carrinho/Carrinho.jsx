import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CarrinhoItem from "../../../components/Carrinho/Carrinho_Item";
import "./Carrinho.css";
import { FaTag, FaRegStickyNote, FaShoppingBag } from "react-icons/fa";

const RESTAURANT_AVATAR = "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=150&q=80";
const FOOD_THUMB = "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=500&q=80";

const INITIAL_CART = [
  {
    id: 3,
    title: "Comida 3",
    desc: "Uma deliciosa porção de batata frita com queijo cheddar",
    price: 14.49,
    quantity: 1,
    image: FOOD_THUMB
  }
];

export default function Cart() {
  const containerRef = useRef(null);
  const navigate = useNavigate(); // <-- Declaração do hook aqui
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [observation, setObservation] = useState("");

  const DELIVERY_FEE = 5.00;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stagger-cart",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [cartItems.length]);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "YUMMY10") {
      setDiscountPercent(10);
      setCouponMessage("Cupom de 10% aplicado!");
    } else {
      setCouponMessage("Cupom inválido.");
      setDiscountPercent(0);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const totalAmount = subtotal > 0 ? subtotal + DELIVERY_FEE - discountAmount : 0;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart-page-bg" ref={containerRef}>
      <Header cartCount={totalItemsCount} />

      <main className="cart-container">
        <h1 className="cart-page-title stagger-cart">Meu carrinho</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart-card stagger-cart">
            <FaShoppingBag className="empty-cart-icon" />
            <h2>Seu carrinho está vazio</h2>
            <p>Adicione itens do restaurante para iniciar seu pedido.</p>
            <button className="btn-continue" onClick={() => console.log("Voltar ao cardápio")}>
              Voltar ao Cardápio
            </button>
          </div>
        ) : (
          <div className="cart-content-wrapper">
            <div className="restaurant-summary-card stagger-cart">
              <img src={RESTAURANT_AVATAR} alt="Codó burger" className="restaurant-summary-avatar" />
              <div className="restaurant-summary-details">
                <span className="restaurant-summary-name">Codó burger</span>
                <button className="btn-add-more" onClick={() => console.log("Adicionar mais itens")}>
                  Adicionar mais itens
                </button>
              </div>
            </div>

            <div className="cart-items-list stagger-cart">
              {cartItems.map((item) => (
                <CarrinhoItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            <div className="cart-section-card stagger-cart">
              <div className="section-card-title">
                <FaRegStickyNote /> Observação do pedido
              </div>
              <input
                type="text"
                placeholder="Ex: Sem cebola, molho à parte..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="cart-input"
              />
            </div>

            <div className="cart-section-card stagger-cart">
              <div className="section-card-title">
                <FaTag /> Cupom de desconto
              </div>
              <form onSubmit={handleApplyCoupon} className="coupon-form">
                <input
                  type="text"
                  placeholder="Código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="cart-input"
                />
                <button type="submit" className="btn-apply">Aplicar</button>
              </form>
              {couponMessage && (
                <span className={`coupon-msg ${discountPercent > 0 ? "success" : "error"}`}>
                  {couponMessage}
                </span>
              )}
            </div>

            <div className="cart-total-card stagger-cart">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              <div className="summary-row">
                <span>Taxa de entrega</span>
                <span>{DELIVERY_FEE.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              {discountPercent > 0 && (
                <div className="summary-row discount">
                  <span>Desconto ({discountPercent}%)</span>
                  <span>-{discountAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              )}
              <hr className="summary-divider" />
              <div className="summary-row total">
                <strong>Total da compra</strong>
                <strong>{totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
              </div>
            </div>

            <div className="cart-action-container stagger-cart">
              <button className="btn-continue" onClick={() => navigate("/pagamento")}>
                Continuar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}