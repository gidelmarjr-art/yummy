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
import { getMeuPedido } from "../../../services/api";

const STEPS = [
  { key: "confirmado", label: "Pedido confirmado", icon: <FaCheckCircle /> },
  { key: "preparo", label: "Em preparo", icon: <FaUtensils /> },
  { key: "entrega", label: "Saiu para entrega", icon: <FaMotorcycle /> },
  { key: "entregue", label: "Entregue", icon: <FaHome /> },
];

// De quanto em quanto tempo (ms) consulta o status do pedido no backend.
const POLL_INTERVAL_MS = 5000;

// Status do pedido no banco -> etapa mostrada na tela.
const STATUS_PARA_ETAPA = {
  Novos: 0,
  "Em preparo": 1,
  Prontos: 2,
  Entregues: 3,
  Concluídos: 3,
};

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

  const [stepIndex, setStepIndex] = useState(
    STATUS_PARA_ETAPA[order?.status] ?? 0,
  );
  const [cancelado, setCancelado] = useState(false);
  const [orderCode] = useState(() => order?.code || "");

  // Consulta o status real do pedido de tempos em tempos, até ser entregue.
  useEffect(() => {
    if (!order?.pedidoId || cancelado || stepIndex >= STEPS.length - 1) return;

    const timer = setInterval(async () => {
      try {
        const pedido = await getMeuPedido(order.pedidoId);
        if (pedido.status === "Cancelado") {
          setCancelado(true);
          return;
        }
        const etapa = STATUS_PARA_ETAPA[pedido.status];
        if (etapa !== undefined) setStepIndex(etapa);
      } catch {
        // falha de rede momentânea: tenta de novo no próximo ciclo
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [order, stepIndex, cancelado]);

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
          <p>
            Assim que você finalizar uma compra, o acompanhamento da entrega
            aparece aqui.
          </p>
          <button
            className="btn-tracking-home"
            onClick={() => navigate("/home")}
          >
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
          <span
            className={`tracking-status-pill ${isDelivered ? "is-delivered" : ""}`}
          >
            {cancelado ? "Pedido cancelado" : STEPS[stepIndex].label}
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
                <div
                  className={`tracking-step__line ${i < stepIndex ? "is-filled" : ""}`}
                />
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
                    <span className="tracking-item__qty">
                      Qtd: {item.quantity}
                    </span>
                  </div>
                  <span className="tracking-item__price">
                    R$
                    {(Number(item.price) * item.quantity)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>
            <div className="tracking-total-row">
              <span>Total</span>
              <strong>
                R${Number(order.total).toFixed(2).replace(".", ",")}
              </strong>
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
                <span className="tracking-detail__value">
                  {formatPaymentLabel(order)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          className="btn-tracking-home stagger-tracking"
          onClick={() => navigate("/home")}
        >
          {isDelivered ? "Voltar para o início" : "Continuar navegando"}
        </button>
      </main>
    </div>
  );
}
