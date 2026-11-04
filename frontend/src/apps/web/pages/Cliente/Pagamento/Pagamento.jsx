import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  FaArrowLeft,
  FaCreditCard,
  FaQrcode,
  FaMoneyBillWave,
  FaCheckCircle,
  FaExclamationCircle,
  FaCopy,
  FaSpinner,
  FaCheck,
  FaMapMarkerAlt,
  FaPlus,
  FaLock,
} from "react-icons/fa";
import "./Pagamento.css";
import { useCart } from "../../../../../context/CartContext";
import {
  criarCartao,
  criarMeuPedido,
  getCartoes,
  getEnderecos,
} from "../../../services/api";

import logoMascote from "../../../../../imgs/LogoYummy_2.png";
import logoNome from "../../../../../imgs/LogoYummy_3.png";

const FORMAS_PAGAMENTO = {
  credit: "Cartão de crédito",
  pix: "Pix",
  cash: "Dinheiro",
};

const formatarEndereco = (endereco) =>
  `${endereco.rua}, ${endereco.numero}${endereco.complemento ? ` — ${endereco.complemento}` : ""}, ${endereco.cidade}`;

const paraCartaoDaTela = (cartao) => ({
  id: String(cartao.id),
  brand: cartao.bandeira || "Cartão",
  last4: cartao.final,
});

export default function Pagamento() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { cartItems, clearCart } = useCart();

  const [selectedMethod, setSelectedMethod] = useState("credit");

  // Endereço e cartões vêm sempre do perfil salvo do usuário autenticado.
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  // Estados de Cartão de Crédito
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Estados de Dinheiro / Pix
  const [needChange, setNeedChange] = useState(false);
  const [changeAmount, setChangeAmount] = useState("");
  const [pixCopied, setPixCopied] = useState(false);

  // Estados de Processamento e Modais (Sucesso e Erro)
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Novos estados para controlar o modal de Erro visual
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const selectedAddress = addresses.find(
    (item) => String(item.id) === selectedAddressId,
  );
  const address = selectedAddress ? formatarEndereco(selectedAddress) : "";

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
    0,
  );
  const deliveryFee = 7.5;
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  const currentCard =
    savedCards.find((c) => c.id === selectedCardId) || savedCards[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stagger-pay",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" },
      );

      gsap.fromTo(
        ".payment-brand-side",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.1 },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let ativo = true;
    Promise.all([getEnderecos(), getCartoes()])
      .then(([enderecos, cartoes]) => {
        if (!ativo) return;
        setAddresses(enderecos);
        if (enderecos.length) setSelectedAddressId(String(enderecos[0].id));

        const cartoesDaTela = cartoes.map(paraCartaoDaTela);
        setSavedCards(cartoesDaTela);
        if (cartoesDaTela.length) setSelectedCardId(cartoesDaTela[0].id);
      })
      .catch((erro) => {
        if (!ativo) return;
        setErrorMessage(erro.detail || "Não foi possível carregar os dados do perfil.");
        setIsErrorModalOpen(true);
      });
    return () => { ativo = false; };
  }, []);

  const handleCopyPix = () => {
    const dummyPixKey =
      "00020126580014br.gov.bcb.pix0136yummy-pay-key-123456789520400005303986540560.005802BR";
    navigator.clipboard.writeText(dummyPixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  const handleAddNewCard = async (e) => {
    e.preventDefault();
    if (!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvv) {
      setErrorMessage("Por favor, preencha todos os campos do cartão.");
      setIsErrorModalOpen(true);
      return;
    }

    const last4 = newCard.number.replace(/\s/g, "").slice(-4) || "0000";
    try {
      const criado = await criarCartao({ final: last4, bandeira: "Cartão" });
      const createdCard = paraCartaoDaTela(criado);
      setSavedCards((atuais) => [...atuais, createdCard]);
      setSelectedCardId(createdCard.id);
      setShowAddCardForm(false);
      setNewCard({ number: "", name: "", expiry: "", cvv: "" });
    } catch (err) {
      setErrorMessage(err.detail || "Não foi possível salvar o cartão.");
      setIsErrorModalOpen(true);
    }
  };

  const handleConfirmPayment = async () => {
    if (cartItems.length === 0) {
      setErrorMessage("Seu carrinho está vazio!");
      setIsErrorModalOpen(true);
      return;
    }
    if (!selectedAddress) {
      setErrorMessage("Cadastre e selecione um endereço no seu perfil antes de finalizar o pedido.");
      setIsErrorModalOpen(true);
      return;
    }
    setIsProcessing(true);
    try {
      const pedido = await criarMeuPedido({
        local: `Entrega — ${address}`,
        forma_pagamento: FORMAS_PAGAMENTO[selectedMethod] || selectedMethod,
        itens: cartItems.map((item) => ({
          produto_id: item.id,
          nome_produto: item.title,
          quantidade: item.quantity,
          preco_unitario: Number(item.price),
        })),
      });

      setConfirmedOrder({
        pedidoId: pedido.id,
        code: pedido.codigo,
        status: pedido.status,
        items: cartItems,
        total,
        address,
        method: selectedMethod,
        cardLast4: currentCard?.last4,
      });
      setIsSuccessModalOpen(true);
      clearCart();
    } catch (err) {
      // Substitui o alert nativo pelo Modal de Erro visual agradável
      setErrorMessage(
        err.detail || "Não foi possível finalizar o pedido. Tente novamente.",
      );
      setIsErrorModalOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-page-bg" ref={containerRef}>
      <header className="payment-header">
        <button
          className="btn-back"
          onClick={() => window.history.back()}
          aria-label="Voltar"
        >
          <FaArrowLeft />
        </button>
        <h1 className="payment-page-title">Pagamento</h1>
      </header>

      <main className="payment-main-container">
        <div className="payment-brand-side">
          <div className="brand-logo-wrapper">
            <img src={logoNome} alt="Yummy" className="brand-logo-img" />
          </div>
          <div className="mascot-illustration-wrapper">
            <img src={logoMascote} alt="Mascote Yummy" className="mascot-img" />
          </div>
        </div>

        <div className="payment-card-side stagger-pay">
          {/* Resumo do Pedido */}
          <section className="payment-section">
            <h2 className="section-subtitle">RESUMO DO PEDIDO</h2>
            <div className="order-items-list">
              {cartItems.length === 0 ? (
                <p className="item-title" style={{ color: "#a0a0a0" }}>
                  Nenhum item no carrinho.
                </p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <span className="item-title">
                      {item.quantity}x {item.title || item.name}
                    </span>
                    <span className="item-price">
                      {(
                        (Number(item.price) || 0) * item.quantity
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="financial-summary">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>
                  {subtotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <div className="summary-line">
                <span>Taxa de entrega</span>
                <span>
                  {deliveryFee.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <div className="summary-line total">
                <strong>Total</strong>
                <strong>
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </div>
            </div>
          </section>

          {/* Endereço de Entrega */}
          <section className="payment-section">
            <h2 className="section-subtitle">ENDEREÇO DE ENTREGA</h2>
            {addresses.length ? (
              <div className="address-row">
                <FaMapMarkerAlt className="address-icon" />
                <select
                  className="address-input"
                  value={selectedAddressId}
                  onChange={(event) => setSelectedAddressId(event.target.value)}
                  aria-label="Selecione o endereço de entrega"
                >
                  {addresses.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.apelido}: {formatarEndereco(item)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="profile-error">
                Nenhum endereço salvo. Cadastre um endereço no perfil para finalizar o pedido.
              </p>
            )}
          </section>

          {/* Forma de Pagamento */}
          <section className="payment-section">
            <h2 className="section-subtitle">FORMA DE PAGAMENTO</h2>
            <div className="payment-methods-list">
              <button
                type="button"
                className={`method-option ${selectedMethod === "credit" ? "active" : ""}`}
                onClick={() => setSelectedMethod("credit")}
              >
                <div className="method-info">
                  <FaCreditCard className="method-icon" />
                  <span>
                    Cartão de crédito{" "}
                    {currentCard ? `••••${currentCard.last4}` : ""}
                  </span>
                </div>
                {selectedMethod === "credit" && (
                  <FaCheckCircle className="check-icon" />
                )}
              </button>

              {selectedMethod === "credit" && (
                <div className="method-extra-panel">
                  <span className="panel-label">
                    Selecione um cartão ou adicione um novo:
                  </span>

                  <div className="cards-selection-list">
                    {savedCards.map((card) => (
                      <label
                        key={card.id}
                        className={`card-radio-item ${selectedCardId === card.id ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="selectedCard"
                          checked={selectedCardId === card.id}
                          onChange={() => setSelectedCardId(card.id)}
                        />
                        <div className="card-radio-info">
                          <strong>{card.brand}</strong> final •••• {card.last4}
                        </div>
                      </label>
                    ))}
                  </div>

                  {!showAddCardForm ? (
                    <button
                      type="button"
                      className="btn-show-add-card"
                      onClick={() => setShowAddCardForm(true)}
                    >
                      <FaPlus /> Adicionar novo cartão
                    </button>
                  ) : (
                    <form onSubmit={handleAddNewCard} className="new-card-form">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Número do cartão"
                          maxLength="19"
                          value={newCard.number}
                          onChange={(e) =>
                            setNewCard({ ...newCard, number: e.target.value })
                          }
                          className="card-input"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Nome impresso no cartão"
                          value={newCard.name}
                          onChange={(e) =>
                            setNewCard({ ...newCard, name: e.target.value })
                          }
                          className="card-input"
                        />
                      </div>
                      <div className="form-row-2">
                        <input
                          type="text"
                          placeholder="MM/AA"
                          maxLength="5"
                          value={newCard.expiry}
                          onChange={(e) =>
                            setNewCard({ ...newCard, expiry: e.target.value })
                          }
                          className="card-input"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          maxLength="4"
                          value={newCard.cvv}
                          onChange={(e) =>
                            setNewCard({ ...newCard, cvv: e.target.value })
                          }
                          className="card-input"
                        />
                      </div>
                      <div className="card-form-actions">
                        <button type="submit" className="btn-save-card">
                          <FaLock /> Salvar Cartão
                        </button>
                        <button
                          type="button"
                          className="btn-cancel-card"
                          onClick={() => setShowAddCardForm(false)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              <button
                type="button"
                className={`method-option ${selectedMethod === "pix" ? "active" : ""}`}
                onClick={() => setSelectedMethod("pix")}
              >
                <div className="method-info">
                  <FaQrcode className="method-icon" />
                  <span>Pix</span>
                </div>
                {selectedMethod === "pix" && (
                  <FaCheckCircle className="check-icon" />
                )}
              </button>

              {selectedMethod === "pix" && (
                <div className="method-extra-panel">
                  <p className="pix-instruction">
                    Copie o código abaixo e pague no app do seu banco:
                  </p>
                  <button
                    type="button"
                    className="btn-copy-pix"
                    onClick={handleCopyPix}
                  >
                    {pixCopied ? (
                      <>
                        <FaCheck /> Código copiado!
                      </>
                    ) : (
                      <>
                        <FaCopy /> Copiar chave Pix
                      </>
                    )}
                  </button>
                </div>
              )}

              <button
                type="button"
                className={`method-option ${selectedMethod === "cash" ? "active" : ""}`}
                onClick={() => setSelectedMethod("cash")}
              >
                <div className="method-info">
                  <FaMoneyBillWave className="method-icon" />
                  <span>Dinheiro na entrega</span>
                </div>
                {selectedMethod === "cash" && (
                  <FaCheckCircle className="check-icon" />
                )}
              </button>

              {selectedMethod === "cash" && (
                <div className="method-extra-panel">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={needChange}
                      onChange={(e) => setNeedChange(e.target.checked)}
                    />
                    <span>Precisa de troco?</span>
                  </label>

                  {needChange && (
                    <div className="change-input-wrapper">
                      <span>Troco para quanto? R$</span>
                      <input
                        type="number"
                        placeholder="Ex: 100,00"
                        value={changeAmount}
                        onChange={(e) => setChangeAmount(e.target.value)}
                        className="change-input"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Botão de Confirmação */}
          <div className="confirm-btn-wrapper">
            <button
              className="btn-confirm-payment"
              onClick={handleConfirmPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="loading-state">
                  <FaSpinner className="spinner-icon" /> Processando...
                </span>
              ) : (
                "Confirmar Pagamento"
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Sucesso */}
      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FaCheckCircle className="modal-success-icon" />
            <h2>Pedido Confirmado!</h2>
            <p>Seu pedido já foi enviado e está em preparação.</p>
            <div className="modal-details">
              <span>
                Forma de pagamento:{" "}
                <strong>
                  {selectedMethod === "credit"
                    ? `Cartão (••••${currentCard?.last4})`
                    : selectedMethod.toUpperCase()}
                </strong>
              </span>
              <span>
                Entrega em: <strong>{address}</strong>
              </span>
              <span>Número do Pedido: #10209890</span>
            </div>
            <button
              className="btn-modal-close"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate("/acompanhar-entrega", {
                  state: { order: confirmedOrder },
                });
              }}
            >
              Acompanhar Pedido
            </button>
          </div>
        </div>
      )}

      {/* NOVO: Modal de Erro Visual Agradável */}
      {isErrorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FaExclamationCircle className="modal-error-icon" />
            <h2>Ops, algo deu errado</h2>
            <p>{errorMessage}</p>
            <button
              className="btn-modal-close btn-modal-error"
              onClick={() => setIsErrorModalOpen(false)}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
