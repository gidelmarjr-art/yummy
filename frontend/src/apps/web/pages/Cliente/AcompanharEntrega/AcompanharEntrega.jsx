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
  FaBan,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./AcompanharEntrega.css";
import Header from "../../../components/Header/Header";
import { useCart } from "../../../../../context/CartContext";
import { getMeuPedido, cancelarMeuPedido } from "../../../services/api";

const STEPS = [
  { key: "confirmado", label: "Pedido confirmado", icon: <FaCheckCircle /> },
  { key: "preparo", label: "Em preparo", icon: <FaUtensils /> },
  { key: "entrega", label: "Saiu para entrega", icon: <FaMotorcycle /> },
  { key: "entregue", label: "Entregue", icon: <FaHome /> },
];

const POLL_INTERVAL_MS = 5000;

const STATUS_PARA_ETAPA = {
  Novos: 0,
  "Em preparo": 1,
  Prontos: 2,
  Entregues: 3,
  Concluídos: 3,
};

function formatPaymentLabel(order) {
  if (!order) return "";
  if (order.method === "credit") {
    return order.cardLast4
      ? `Cartão •••• ${order.cardLast4}`
      : "Cartão de crédito";
  }
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
  const [cancelado, setCancelado] = useState(order?.status === "Cancelado");
  const [orderCode] = useState(() => order?.code || "");
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
        // falha momentânea
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

  const handleCancelarCliente = async () => {
    if (!order?.pedidoId) return;
    setLoadingCancel(true);
    try {
      await cancelarMeuPedido(order.pedidoId);
      setCancelado(true);
      setShowConfirmModal(false);
    } catch (err) {
      alert(err.detail || err.message || "Não foi possível cancelar o pedido.");
    } finally {
      setLoadingCancel(false);
    }
  };

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
            <span className="tracking-code">
              Pedido{orderCode ? ` #${orderCode.replace(/\.$/, "")}` : ""}
            </span>
          </div>
          <span
            className={`tracking-status-pill ${isDelivered && !cancelado ? "is-delivered" : ""}`}
            style={
              cancelado
                ? {
                    backgroundColor: "rgba(239, 68, 68, 0.12)",
                    color: "#ef4444",
                  }
                : {}
            }
          >
            {cancelado ? "Pedido cancelado" : STEPS[stepIndex].label}
          </span>
        </div>

        {!cancelado && (
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
        )}

        {cancelado && (
          <div
            className="tracking-card stagger-tracking"
            style={{
              textAlign: "center",
              padding: "2rem",
              marginBottom: "1.4rem",
            }}
          >
            <FaBan
              style={{
                fontSize: "2.5rem",
                color: "#ef4444",
                marginBottom: "0.5rem",
              }}
            />
            <h2 style={{ color: "#ef4444", marginBottom: "0.5rem" }}>
              Este pedido foi cancelado
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              O pedido não será mais preparado nem entregue.
            </p>
          </div>
        )}

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

        {!cancelado && stepIndex === 0 && (
          <button
            className="stagger-tracking"
            onClick={() => setShowConfirmModal(true)}
            disabled={loadingCancel}
            style={{
              width: "100%",
              backgroundColor: "#fef2f2",
              color: "#ef4444",
              border: "1px solid #fecaca",
              padding: "0.8rem",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "0.95rem",
              cursor: "pointer",
              marginBottom: "1rem",
              transition: "all 0.2s ease",
            }}
          >
            Cancelar meu pedido
          </button>
        )}

        <button
          className="btn-tracking-home stagger-tracking"
          onClick={() => navigate("/home")}
        >
          {isDelivered || cancelado
            ? "Voltar para o início"
            : "Continuar navegando"}
        </button>
      </main>

      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "400px",
              padding: "2rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                color: "#ef4444",
                marginBottom: "0.5rem",
              }}
            >
              <FaExclamationTriangle />
            </div>
            <h2
              style={{
                marginBottom: "0.8rem",
                color: "#0f172a",
                fontSize: "1.2rem",
              }}
            >
              Cancelar seu pedido?
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
              }}
            >
              Tem certeza que deseja cancelar este pedido? Esta ação não poderá
              ser desfeita.
            </p>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button
                onClick={handleCancelarCliente}
                disabled={loadingCancel}
                style={{
                  flex: 1,
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {loadingCancel ? "Cancelando..." : "Sim, Cancelar"}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={loadingCancel}
                style={{
                  flex: 1,
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #cbd5e1",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
