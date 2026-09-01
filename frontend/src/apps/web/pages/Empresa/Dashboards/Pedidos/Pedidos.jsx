import React, { useState } from "react";
import {
  FaSearch,
  FaCog,
  FaBell,
  FaReceipt,
  FaChevronDown,
  FaPlus,
  FaPrint,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaTimes,
  FaMotorcycle,
  FaUtensils
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import "./Pedidos.css";

const STATUS_TABS = [
  "Novos",
  "Em preparo",
  "Prontos",
  "Entregues",
  "Concluídos",
  "Todos"
];

// Pedidos Iniciais de Exemplo
const INITIAL_ORDERS = [
  {
    id: "131.",
    customer: "João Silva",
    location: "Mesa 04",
    itemsSummary: "1x Sorvete com Brownie, 2x Coca-Cola",
    items: [
      { name: "Sorvete com Brownie", qty: 1, price: 18.00 },
      { name: "Coca-Cola Zero", qty: 2, price: 6.00 }
    ],
    status: "Em preparo",
    timeAgo: "12 min",
    total: 30.00
  },
  {
    id: "132.",
    customer: "Maria Oliveira",
    location: "Entrega (Rua das Flores, 12)",
    itemsSummary: "2x Codó Burguer, 1x Batata Frita",
    items: [
      { name: "Codó Burguer", qty: 2, price: 38.00 },
      { name: "Batata Frita c/ Cheddar", qty: 1, price: 14.50 }
    ],
    status: "Novos",
    timeAgo: "3 min",
    total: 90.50
  },
  {
    id: "133.",
    customer: "Carlos Eduardo",
    location: "Mesa 01",
    itemsSummary: "1x Chopp Artesanal, 1x Porção de Pastéis",
    items: [
      { name: "Chopp Artesanal", qty: 1, price: 14.00 },
      { name: "Porção de Pastéis", qty: 1, price: 24.00 }
    ],
    status: "Prontos",
    timeAgo: "25 min",
    total: 38.00
  },
  {
    id: "134.",
    customer: "Ana Paula",
    location: "Entrega (Av. Central, 450)",
    itemsSummary: "1x Sorvete com Brownie",
    items: [
      { name: "Sorvete com Brownie", qty: 1, price: 18.00 }
    ],
    status: "Entregues",
    timeAgo: "40 min",
    total: 25.50
  }
];

export default function Pedidos() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState("Em preparo");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusDropdownFilter, setStatusDropdownFilter] = useState("Todos");

  // Modais
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // Formulário de Novo Pedido
  const [newOrderForm, setNewOrderForm] = useState({
    customer: "",
    location: "Mesa 01",
    itemName: "Sorvete com Brownie",
    quantity: 1,
    price: 18.00
  });

  // Próxima etapa do status
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "Novos": return "Em preparo";
      case "Em preparo": return "Prontos";
      case "Prontos": return "Entregues";
      case "Entregues": return "Concluídos";
      default: return "Concluídos";
    }
  };

  // Avançar Status
  const handleAdvanceStatus = (id) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === id) {
          return { ...ord, status: getNextStatus(ord.status) };
        }
        return ord;
      })
    );
  };

  // Cadastrar Novo Pedido
  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!newOrderForm.customer) return alert("Informe o nome do cliente.");

    const priceNum = Number(newOrderForm.price);
    const qtyNum = Number(newOrderForm.quantity);
    const orderTotal = priceNum * qtyNum;

    const newOrder = {
      id: `${Math.floor(100 + Math.random() * 900)}.`,
      customer: newOrderForm.customer,
      location: newOrderForm.location,
      itemsSummary: `${qtyNum}x ${newOrderForm.itemName}`,
      items: [{ name: newOrderForm.itemName, qty: qtyNum, price: priceNum }],
      status: "Novos",
      timeAgo: "Agora",
      total: orderTotal
    };

    setOrders([newOrder, ...orders]);
    setIsNewOrderModalOpen(false);
    setNewOrderForm({ customer: "", location: "Mesa 01", itemName: "Sorvete com Brownie", quantity: 1, price: 18.00 });
  };

  // Filtragem dos Pedidos
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "Todos" || order.status === activeTab;
    const matchesDropdown = statusDropdownFilter === "Todos" || order.status === statusDropdownFilter;
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm) ||
      order.itemsSummary.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesDropdown && matchesSearch;
  });

  return (
    <div className="pedidos-page-layout">
      <Sidebar />

      <main className="pedidos-main-content">
        {/* Header Superior */}
        <header className="pedidos-top-bar">
          <h1 className="page-heading">Pedidos em Tempo Real</h1>

          <div className="top-bar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar pedido, cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="action-circle-btn" aria-label="Configurações">
              <FaCog />
            </button>
            <button className="action-circle-btn" aria-label="Notificações">
              <FaBell />
            </button>

            <div className="user-profile-avatar">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                alt="Avatar"
              />
            </div>
          </div>
        </header>

        {/* Corpo Laranja */}
        <div className="pedidos-dashboard-body">
          <div className="top-controls-row">
            {/* Dropdown de Status Superior Esquerdo */}
            <div className="dropdown-filter-wrapper">
              <select
                className="status-dropdown-select"
                value={statusDropdownFilter}
                onChange={(e) => setStatusDropdownFilter(e.target.value)}
              >
                <option value="Todos">Filtrar: Todos os status</option>
                <option value="Novos">Novos</option>
                <option value="Em preparo">Em preparo</option>
                <option value="Prontos">Prontos</option>
                <option value="Entregues">Entregues</option>
                <option value="Concluídos">Concluídos</option>
              </select>
              <FaChevronDown className="dropdown-icon" />
            </div>

            {/* Card Novo Pedido no Canto Superior Direito */}
            <div className="novo-pedido-card-top">
              <span className="card-title">Novo Pedido</span>
              <div className="novo-pedido-buttons">
                <button
                  className="btn-orange-action"
                  onClick={() => setIsNewOrderModalOpen(true)}
                >
                  <FaPlus /> Criar Pedido
                </button>
                <button
                  className="btn-orange-action"
                  onClick={() => alert("Imprimindo relatórios do turno...")}
                >
                  <FaPrint /> Relatório
                </button>
              </div>
            </div>
          </div>

          {/* Tabela de Pedidos Principal */}
          <div className="pedidos-table-container">
            {/* Abas de Navegação */}
            <div className="status-tab-bar">
              {STATUS_TABS.map((tab) => {
                const count = tab === "Todos" 
                  ? orders.length 
                  : orders.filter((o) => o.status === tab).length;

                return (
                  <button
                    key={tab}
                    className={`status-tab-item ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab} {count > 0 && <span className="tab-badge">{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Lista de Pedidos */}
            <div className="pedidos-items-list">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div key={order.id} className="pedido-row-item">
                    <div className="order-receipt-icon">
                      <FaReceipt />
                    </div>

                    <div className="order-id-col">
                      <strong className="order-code">{order.id}</strong>
                      <span className="order-time"><FaClock /> {order.timeAgo}</span>
                    </div>

                    <div className="order-info-col">
                      <strong className="customer-name">{order.customer} ({order.location})</strong>
                      <p className="order-summary">{order.itemsSummary}</p>
                    </div>

                    <div className="order-status-badge-col">
                      <span className={`status-pill status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                    </div>

                    <span className="order-total-price">
                      {order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>

                    <div className="order-actions-col">
                      <button
                        className="btn-view-details"
                        onClick={() => setSelectedOrderDetails(order)}
                        title="Ver Detalhes"
                      >
                        <FaEye /> Ver
                      </button>

                      {order.status !== "Concluídos" && (
                        <button
                          className="btn-advance-status"
                          onClick={() => handleAdvanceStatus(order.id)}
                        >
                          Mudar p/ {getNextStatus(order.status)}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-orders-msg">
                  Nenhum pedido encontrado nesta seção.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Detalhes do Pedido */}
      {selectedOrderDetails && (
        <div className="pedidos-modal-overlay">
          <div className="pedidos-modal-card">
            <div className="modal-header">
              <h2>Detalhes do Pedido #{selectedOrderDetails.id}</h2>
              <button className="btn-close-modal" onClick={() => setSelectedOrderDetails(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body-details">
              <p><strong>Cliente:</strong> {selectedOrderDetails.customer}</p>
              <p><strong>Local:</strong> {selectedOrderDetails.location}</p>
              <p><strong>Status Atual:</strong> {selectedOrderDetails.status}</p>

              <hr />
              <h3>Itens Solicitados:</h3>
              <ul className="modal-items-list">
                {selectedOrderDetails.items.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.qty}x {item.name}</span>
                    <strong>
                      {(item.qty * item.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </strong>
                  </li>
                ))}
              </ul>
              <div className="modal-total-line">
                <strong>Total:</strong>
                <strong>
                  {selectedOrderDetails.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </strong>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-print-ticket" onClick={() => alert("Imprimindo via impressora térmica...")}>
                <FaPrint /> Imprimir Comanda
              </button>
              <button className="btn-cancel-modal" onClick={() => setSelectedOrderDetails(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criar Novo Pedido Manual */}
      {isNewOrderModalOpen && (
        <div className="pedidos-modal-overlay">
          <div className="pedidos-modal-card">
            <div className="modal-header">
              <h2>Lançar Novo Pedido</h2>
              <button className="btn-close-modal" onClick={() => setIsNewOrderModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="modal-form">
              <div className="form-group">
                <label>Nome do Cliente</label>
                <input
                  type="text"
                  placeholder="Ex: Roberto Ramos"
                  value={newOrderForm.customer}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customer: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Mesa / Tipo</label>
                  <input
                    type="text"
                    value={newOrderForm.location}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Item Principais</label>
                  <input
                    type="text"
                    value={newOrderForm.itemName}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, itemName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Qtd</label>
                  <input
                    type="number"
                    min="1"
                    value={newOrderForm.quantity}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Preço Un. (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newOrderForm.price}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save-modal">
                  Confirmar Pedido
                </button>
                <button
                  type="button"
                  className="btn-cancel-modal"
                  onClick={() => setIsNewOrderModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}