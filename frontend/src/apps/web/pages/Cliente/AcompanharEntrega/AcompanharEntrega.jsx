import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  FaCheckCircle,
  FaUtensils,
  FaMotorcycle,
  FaHome,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaQrcode,
  FaReceipt,
} from "react-icons/fa";
import "./AcompanharEntrega.css";
import Header from "../../../components/Header/Header";
import { useCart } from "../../../../../context/CartContext";

const STEPS = [
  { key: "confirmado", label: "Pedido confirmado", icon: <FaCheckCircle /> },
  { key: "preparo", label: "Em preparo", icon: <FaUtensils /> },
  { key: "entrega", label: "Saiu para entrega", icon: <FaMotorcycle /> },
  { key: "entregue", label: "Entregue", icon: <FaHome /> },
];

// Tempo (em ms) que cada etapa fica ativa antes de avançar pra próxima.
// Por enquanto é uma simulação só visual — quando o pedido estiver ligado
// ao status real do backend (tabela Pedido/rota /pedidos), essa progressão
// pode vir de lá (ex: via polling ou websocket) em vez desse timer.
const STEP_DURATION_MS = 7000;

function formatPaymentLabel(order) {
  if (!order) return "";
  if (order.method === "credit") return `Cartão •••• ${order.cardLast4 || ""}`;
  if (order.method === "pix") return "Pix";
  if (order.method === "cash") return "Dinheiro";
  return order.method || "";
}

function PaymentIcon({ method }) {
  if (method === "pix") return <FaQrcode />;
  if (method === "cash") return <FaMoneyBillWave />;
  return <FaCreditCard />;
}

export default function AcompanharEntrega() {
  const containerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();

  const order = location.state?.order || null;

  const [stepIndex, setStepIndex] = useState(0);
  const [orderCode] = useState(
    () => order?.code || `#YM-${Math.floor(100000 + Math.random() * 900000)}`,
  );

  // Avança a "esteira" de status automaticamente até chegar em "Entregue"
  useEffect(() => {
    if (!order || stepIndex >= STEPS.length - 1) return;

    const timer = setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, STEP_DURATION_MS);

    return () => clearTimeout(timer);
  }, [stepIndex, order]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stagger-tracking",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Acesso direto à rota (sem vir do fluxo de pagamento) — não temos pedido
  // pra mostrar, então oferece um estado vazio em vez de quebrar a tela.
  if (!order) {
    return (
      <div className="tracking-page-bg" ref={containerRef}>
        <Header cartCount={totalItemsCount} />
        <main className="tracking-empty">
          <FaReceipt className="tracking-empty__icon" />
          <h1>Nenhum pedido em andamento</h1>
          <p>Assim que você finalizar uma compra, o acompanhamento da entrega aparece aqui.</p>
          <button className="btn-tracking-home" onClick={() => navigate("/home")}>
            Ver cardápio
          </button>
        </main>
      </div>
    );
  }

  const isDelivered = stepIndex === STEPS.length - 1;

  return (
    <div className="tracking-page-bg" ref={containerRef}>
      <Header cartCount={totalItemsCount} />

      <main className="tracking-main">
        <div className="tracking-title-row stagger-tracking">
          <div>
            <h1>Acompanhando seu pedido</h1>
            <span className="tracking-code">Pedido {orderCode}</span>
          </div>
          <span className={`tracking-status-pill ${isDelivered ? "is-delivered" : ""}`}>
            {STEPS[stepIndex].label}
          </span>
        </div>

        <div className="tracking-stepper stagger-tracking">
          {STEPS.map((step, i) => (
            <div
              key={step.key}
              className={`tracking-step ${i <= stepIndex ? "is-done" : ""} ${
                i === stepIndex ? "is-current" : ""
              }`}
            >
              <div className="tracking-step__icon">{step.icon}</div>
              <span className="tracking-step__label">{step.label}</span>
              {i < STEPS.length - 1 && (
                <div className={`tracking-step__line ${i < stepIndex ? "is-filled" : ""}`} />
              )}
            </div>
          ))}
        </div>

        <div className="tracking-grid">
          <div className="tracking-card stagger-tracking">
            <h2>Itens do pedido</h2>
            <div className="tracking-items">
              {order.items.map((item) => (
                <div className="tracking-item" key={item.id}>
                  <img src={item.image || item.img} alt={item.title} />
                  <div className="tracking-item__info">
                    <span className="tracking-item__title">{item.title}</span>
                    <span className="tracking-item__qty">Qtd: {item.quantity}</span>
                  </div>
                  <span className="tracking-item__price">
                    R${(Number(item.price) * item.quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>
            <div className="tracking-total-row">
              <span>Total</span>
              <strong>R${Number(order.total).toFixed(2).replace(".", ",")}</strong>
            </div>
          </div>

          <div className="tracking-card stagger-tracking">
            <h2>Detalhes da entrega</h2>
            <div className="tracking-detail">
              <FaMapMarkerAlt className="tracking-detail__icon" />
              <div>
                <span className="tracking-detail__label">Endereço</span>
                <span className="tracking-detail__value">{order.address}</span>
              </div>
            </div>
            <div className="tracking-detail">
              <span className="tracking-detail__icon">
                <PaymentIcon method={order.method} />
              </span>
              <div>
                <span className="tracking-detail__label">Pagamento</span>
                <span className="tracking-detail__value">{formatPaymentLabel(order)}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="btn-tracking-home stagger-tracking" onClick={() => navigate("/home")}>
          {isDelivered ? "Voltar para o início" : "Continuar navegando"}
        </button>
      </main>
    </div>
  );
}