import React, { useEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { 
  FaArrowLeft, 
  FaCreditCard, 
  FaQrcode, 
  FaMoneyBillWave,
  FaCheckCircle,
  FaCopy,
  FaSpinner,
  FaCheck,
  FaMapMarkerAlt,
  FaPlus,
  FaLock
} from "react-icons/fa";
import "./Pagamento.css";

import logoMascote from "../../../../../imgs/LogoYummy_2.png";
import logoNome from "../../../../../imgs/LogoYummy_3.png";

const ORDER_ITEMS = [
  { id: 1, title: "1x Comida 1 - Batata frita c/ cheddar", price: 14.50 },
  { id: 2, title: "2x Sanduíche Codó Burguer", price: 38.00 }
];

export default function Pagamento() {
  const containerRef = useRef(null);

  // Estados Gerais
  const [selectedMethod, setSelectedMethod] = useState("credit");
  
  // Estado do Endereço
  const [address, setAddress] = useState("Setor Leste, Quadra 42, Lote 01");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);

  // Estados de Cartão de Crédito
  const [savedCards, setSavedCards] = useState([
    { id: "1", brand: "Mastercard", last4: "4321", name: "João Silva" },
    { id: "2", brand: "Visa", last4: "8899", name: "João Silva" }
  ]);
  const [selectedCardId, setSelectedCardId] = useState("1");
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCard, setNewCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  // Estados de Dinheiro / Pix
  const [needChange, setNeedChange] = useState(false);
  const [changeAmount, setChangeAmount] = useState("");
  const [pixCopied, setPixCopied] = useState(false);

  // Estados de Processamento e Modal
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const subtotal = ORDER_ITEMS.reduce((acc, item) => acc + item.price, 0);
  const deliveryFee = 7.50;
  const total = subtotal + deliveryFee;

  // Cartão atualmente ativo
  const currentCard = savedCards.find((c) => c.id === selectedCardId) || savedCards[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stagger-pay",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      );

      gsap.fromTo(
        ".payment-brand-side",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Salvar Endereço
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (tempAddress.trim()) {
      setAddress(tempAddress);
      setIsEditingAddress(false);
    }
  };

  // Copiar Pix
  const handleCopyPix = () => {
    const dummyPixKey = "00020126580014br.gov.bcb.pix0136yummy-pay-key-123456789520400005303986540560.005802BR";
    navigator.clipboard.writeText(dummyPixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  // Adicionar Novo Cartão
  const handleAddNewCard = (e) => {
    e.preventDefault();
    if (!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvv) {
      alert("Por favor, preencha todos os campos do cartão.");
      return;
    }

    const last4 = newCard.number.replace(/\s/g, "").slice(-4) || "0000";
    const createdCard = {
      id: Date.now().toString(),
      brand: "Cartão",
      last4,
      name: newCard.name
    };

    setSavedCards([...savedCards, createdCard]);
    setSelectedCardId(createdCard.id);
    setShowAddCardForm(false);
    setNewCard({ number: "", name: "", expiry: "", cvv: "" });
  };

  // Confirmar Pagamento
  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccessModalOpen(true);
    }, 1800);
  };

  return (
    <div className="payment-page-bg" ref={containerRef}>
      <header className="payment-header">
        <button className="btn-back" onClick={() => window.history.back()} aria-label="Voltar">
          <FaArrowLeft />
        </button>
        <h1 className="payment-page-title">Pagamento</h1>
      </header>

      <main className="payment-main-container">
        {/* Branding */}
        <div className="payment-brand-side">
          <div className="brand-logo-wrapper">
            <img src={logoNome} alt="Yummy" className="brand-logo-img" />
          </div>
          <div className="mascot-illustration-wrapper">
            <img src={logoMascote} alt="Mascote Yummy" className="mascot-img" />
          </div>
        </div>

        {/* Card do Checkout */}
        <div className="payment-card-side stagger-pay">
          {/* Resumo do Pedido */}
          <section className="payment-section">
            <h2 className="section-subtitle">RESUMO DO PEDIDO</h2>
            <div className="order-items-list">
              {ORDER_ITEMS.map((item) => (
                <div key={item.id} className="order-item-row">
                  <span className="item-title">{item.title}</span>
                  <span className="item-price">
                    {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              ))}
            </div>

            <div className="financial-summary">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              <div className="summary-line">
                <span>Taxa de entrega</span>
                <span>{deliveryFee.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              <div className="summary-line total">
                <strong>Total</strong>
                <strong>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
              </div>
            </div>
          </section>

          {/* Endereço de Entrega */}
          <section className="payment-section">
            <h2 className="section-subtitle">ENDEREÇO DE ENTREGA</h2>
            {!isEditingAddress ? (
              <div className="address-row">
                <span className="address-text">
                  <FaMapMarkerAlt className="address-icon" /> {address}
                </span>
                <button className="btn-change-address" onClick={() => setIsEditingAddress(true)}>
                  Alterar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveAddress} className="address-edit-form">
                <input
                  type="text"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  className="address-input"
                  placeholder="Digite seu endereço completo"
                  autoFocus
                />
                <div className="address-form-actions">
                  <button type="submit" className="btn-save-addr">Salvar</button>
                  <button type="button" className="btn-cancel-addr" onClick={() => setIsEditingAddress(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Forma de Pagamento */}
          <section className="payment-section">
            <h2 className="section-subtitle">FORMA DE PAGAMENTO</h2>
            <div className="payment-methods-list">
              
              {/* Opção Cartão de Crédito */}
              <button
                type="button"
                className={`method-option ${selectedMethod === "credit" ? "active" : ""}`}
                onClick={() => setSelectedMethod("credit")}
              >
                <div className="method-info">
                  <FaCreditCard className="method-icon" />
                  <span>
                    Cartão de crédito {currentCard ? `••••${currentCard.last4}` : ""}
                  </span>
                </div>
                {selectedMethod === "credit" && <FaCheckCircle className="check-icon" />}
              </button>

              {/* Painel Expansível: Cartão de Crédito */}
              {selectedMethod === "credit" && (
                <div className="method-extra-panel">
                  <span className="panel-label">Selecione um cartão ou adicione um novo:</span>
                  
                  {/* Lista de Cartões Cadastrados */}
                  <div className="cards-selection-list">
                    {savedCards.map((card) => (
                      <label key={card.id} className={`card-radio-item ${selectedCardId === card.id ? "selected" : ""}`}>
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

                  {/* Botão para exibir formulário de novo cartão */}
                  {!showAddCardForm ? (
                    <button
                      type="button"
                      className="btn-show-add-card"
                      onClick={() => setShowAddCardForm(true)}
                    >
                      <FaPlus /> Adicionar novo cartão
                    </button>
                  ) : (
                    /* Formulário Inline de Novo Cartão */
                    <form onSubmit={handleAddNewCard} className="new-card-form">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Número do cartão"
                          maxLength="19"
                          value={newCard.number}
                          onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                          className="card-input"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Nome impresso no cartão"
                          value={newCard.name}
                          onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                          className="card-input"
                        />
                      </div>
                      <div className="form-row-2">
                        <input
                          type="text"
                          placeholder="MM/AA"
                          maxLength="5"
                          value={newCard.expiry}
                          onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                          className="card-input"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          maxLength="4"
                          value={newCard.cvv}
                          onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
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

              {/* Opção Pix */}
              <button
                type="button"
                className={`method-option ${selectedMethod === "pix" ? "active" : ""}`}
                onClick={() => setSelectedMethod("pix")}
              >
                <div className="method-info">
                  <FaQrcode className="method-icon" />
                  <span>Pix</span>
                </div>
                {selectedMethod === "pix" && <FaCheckCircle className="check-icon" />}
              </button>

              {/* Painel Expansível Pix */}
              {selectedMethod === "pix" && (
                <div className="method-extra-panel">
                  <p className="pix-instruction">Copie o código abaixo e pague no app do seu banco:</p>
                  <button type="button" className="btn-copy-pix" onClick={handleCopyPix}>
                    {pixCopied ? <><FaCheck /> Código copiado!</> : <><FaCopy /> Copiar chave Pix</>}
                  </button>
                </div>
              )}

              {/* Opção Dinheiro */}
              <button
                type="button"
                className={`method-option ${selectedMethod === "cash" ? "active" : ""}`}
                onClick={() => setSelectedMethod("cash")}
              >
                <div className="method-info">
                  <FaMoneyBillWave className="method-icon" />
                  <span>Dinheiro na entrega</span>
                </div>
                {selectedMethod === "cash" && <FaCheckCircle className="check-icon" />}
              </button>

              {/* Painel Expansível Dinheiro */}
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
              <span>Forma de pagamento: <strong>
                {selectedMethod === "credit"
                  ? `Cartão (••••${currentCard?.last4})`
                  : selectedMethod.toUpperCase()}
              </strong></span>
              <span>Entrega em: <strong>{address}</strong></span>
            </div>
            <button
              className="btn-modal-close"
              onClick={() => {
                setIsSuccessModalOpen(false);
                window.location.href = "/";
              }}
            >
              Acompanhar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}