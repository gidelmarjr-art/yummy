import React, { useEffect, useState, useCallback } from "react";
import {
  FaSearch,
  FaCog,
  FaBell,
  FaReceipt,
  FaChevronDown,
  FaPlus,
  FaPrint,
  FaClock,
  FaEye,
  FaTimes,
  FaBan,
  FaExclamationTriangle,
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import {
  getPedidos,
  criarPedido,
  avancarPedido,
  cancelarPedidoAdmin,
  formatTimeAgo,
  wsUrl,
} from "../../../../services/api";
import "../dashboards-shared.css";
import "./Pedidos.css";

const STATUS_TABS = [
  "Novos",
  "Em preparo",
  "Prontos",
  "Entregues",
  "Concluídos",
  "Cancelado",
  "Todos",
];

const PROXIMO_STATUS = {
  Novos: "Em preparo",
  "Em preparo": "Prontos",
  Prontos: "Entregues",
  Entregues: "Concluídos",
};

function pedidoParaLinha(pedido) {
  return {
    dbId: pedido.id,
    id: pedido.codigo,
    customer: pedido.cliente_nome,
    location: pedido.local,
    itemsSummary:
      pedido.itens
        .map((i) => `${i.quantidade}x ${i.nome_produto}`)
        .join(", ") || "—",
    items: pedido.itens.map((i) => ({
      name: i.nome_produto,
      qty: i.quantidade,
      price: Number(i.preco_unitario),
    })),
    status: pedido.status,
    timeAgo: formatTimeAgo(pedido.criado_em),
    total: Number(pedido.total),
  };
}

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [activeTab, setActiveTab] = useState("Em preparo");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusDropdownFilter, setStatusDropdownFilter] = useState("Todos");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [orderParaCancelar, setOrderParaCancelar] = useState(null);
  const [salvandoPedido, setSalvandoPedido] = useState(false);
  const [loadingCancelAdmin, setLoadingCancelAdmin] = useState(false);

  const [newOrderForm, setNewOrderForm] = useState({
    customer: "",
    location: "Mesa 01",
    itemName: "Sorvete com Brownie",
    quantity: 1,
    price: 18.0,
  });

  const carregarPedidos = useCallback(() => {
    return getPedidos()
      .then((data) => setOrders(data.map(pedidoParaLinha)))
      .catch((err) => setErro(err.detail || err.message));
  }, []);

  useEffect(() => {
    carregarPedidos().finally(() => setCarregando(false));
  }, [carregarPedidos]);

  useEffect(() => {
    let socket;
    let retry;
    const conectar = () => {
      socket = new WebSocket(wsUrl("/ws/dashboard"));
      socket.onmessage = () => carregarPedidos().catch(() => {});
      socket.onclose = () => {
        retry = setTimeout(conectar, 3000);
      };
    };
    conectar();
    return () => {
      clearTimeout(retry);
      socket?.close();
    };
  }, [carregarPedidos]);

  const handleAdvanceStatus = async (dbId) => {
    try {
      await avancarPedido(dbId);
      await carregarPedidos();
    } catch (err) {
      alert(err.detail || "Não foi possível avançar o status do pedido.");
    }
  };

  const confirmarCancelamentoAdmin = async () => {
    if (!orderParaCancelar) return;
    setLoadingCancelAdmin(true);
    try {
      await cancelarPedidoAdmin(orderParaCancelar);
      setOrderParaCancelar(null);
      setSelectedOrderDetails(null);
      await carregarPedidos();
    } catch (err) {
      alert(err.detail || err.message || "Erro ao cancelar pedido.");
    } finally {
      setLoadingCancelAdmin(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrderForm.customer) return alert("Informe o nome do cliente.");

    const priceNum = Number(newOrderForm.price);
    const qtyNum = Number(newOrderForm.quantity);

    setSalvandoPedido(true);
    try {
      await criarPedido({
        cliente_nome: newOrderForm.customer,
        local: newOrderForm.location,
        canal: "local",
        itens: [
          {
            nome_produto: newOrderForm.itemName,
            quantidade: qtyNum,
            preco_unitario: priceNum,
          },
        ],
      });
      await carregarPedidos();
      setIsNewOrderModalOpen(false);
      setNewOrderForm({
        customer: "",
        location: "Mesa 01",
        itemName: "Sorvete com Brownie",
        quantity: 1,
        price: 18.0,
      });
    } catch (err) {
      alert(err.detail || "Não foi possível lançar o pedido.");
    } finally {
      setSalvandoPedido(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "Todos" || order.status === activeTab;
    const matchesDropdown =
      statusDropdownFilter === "Todos" || order.status === statusDropdownFilter;
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm) ||
      order.itemsSummary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesDropdown && matchesSearch;
  });

  return (
    <div className="pedidos-page-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <main className="pedidos-main-content">
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

        <div className="pedidos-dashboard-body">
          {erro && <p className="dashboard-error-msg">{erro}</p>}

          <div className="top-controls-row">
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
                <option value="Cancelado">Cancelado</option>
              </select>
              <FaChevronDown className="dropdown-icon" />
            </div>

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
                  onClick={() => window.print()}
                >
                  <FaPrint /> Relatório
                </button>
              </div>
            </div>
          </div>

          <div className="pedidos-table-container">
            <div className="status-tab-bar">
              {STATUS_TABS.map((tab) => {
                const count =
                  tab === "Todos"
                    ? orders.length
                    : orders.filter((o) => o.status === tab).length;
                return (
                  <button
                    key={tab}
                    className={`status-tab-item ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}{" "}
                    {count > 0 && <span className="tab-badge">{count}</span>}
                  </button>
                );
              })}
            </div>

            <div className="pedidos-items-list">
              {carregando ? (
                <p className="dashboard-loading-msg">Carregando pedidos…</p>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div key={order.dbId} className="pedido-row-item">
                    <div className="order-receipt-icon">
                      <FaReceipt />
                    </div>

                    <div className="order-id-col">
                      <strong className="order-code">{order.id}</strong>
                      <span className="order-time">
                        <FaClock /> {order.timeAgo}
                      </span>
                    </div>

                    <div className="order-info-col">
                      <strong className="customer-name">
                        {order.customer} ({order.location})
                      </strong>
                      <p className="order-summary">{order.itemsSummary}</p>
                    </div>

                    <div className="order-status-badge-col">
                      <span
                        className={`status-pill status-${order.status.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <span className="order-total-price">
                      {order.total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>

                    <div className="order-actions-col">
                      <button
                        className="btn-view-details"
                        onClick={() => setSelectedOrderDetails(order)}
                        title="Ver Detalhes"
                      >
                        <FaEye /> Ver
                      </button>

                      {order.status !== "Concluídos" &&
                        order.status !== "Cancelado" && (
                          <>
                            <button
                              className="btn-advance-status"
                              onClick={() => handleAdvanceStatus(order.dbId)}
                            >
                              Mudar p/{" "}
                              {PROXIMO_STATUS[order.status] || "Concluídos"}
                            </button>
                            <button
                              className="btn-cancel-admin"
                              onClick={() => setOrderParaCancelar(order.dbId)}
                              title="Cancelar Pedido"
                            >
                              <FaBan />
                            </button>
                          </>
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
              <button
                className="btn-close-modal"
                onClick={() => setSelectedOrderDetails(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body-details">
              <p>
                <strong>Cliente:</strong> {selectedOrderDetails.customer}
              </p>
              <p>
                <strong>Local:</strong> {selectedOrderDetails.location}
              </p>
              <p>
                <strong>Status Atual:</strong> {selectedOrderDetails.status}
              </p>

              <hr />
              <h3>Itens Solicitados:</h3>
              <ul className="modal-items-list">
                {selectedOrderDetails.items.map((item, idx) => (
                  <li key={idx}>
                    <span>
                      {item.qty}x {item.name}
                    </span>
                    <strong>
                      {(item.qty * item.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </strong>
                  </li>
                ))}
              </ul>
              <div className="modal-total-line">
                <strong>Total:</strong>
                <strong>
                  {selectedOrderDetails.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </div>
            </div>

            <div
              className="modal-actions"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <button
                className="btn-print-ticket"
                onClick={() => window.print()}
              >
                <FaPrint /> Comanda
              </button>
              {selectedOrderDetails.status !== "Concluídos" &&
                selectedOrderDetails.status !== "Cancelado" && (
                  <button
                    onClick={() =>
                      setOrderParaCancelar(selectedOrderDetails.dbId)
                    }
                    style={{
                      backgroundColor: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "0.75rem",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    Cancelar Pedido
                  </button>
                )}
              <button
                className="btn-cancel-modal"
                onClick={() => setSelectedOrderDetails(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Cancelamento do Admin */}
      {orderParaCancelar && (
        <div className="pedidos-modal-overlay">
          <div
            className="pedidos-modal-card"
            style={{ maxWidth: "400px", textAlign: "center", padding: "2rem" }}
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
            <h2 style={{ marginBottom: "0.8rem", color: "#0f172a" }}>
              Cancelar Pedido?
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
              }}
            >
              Tem certeza que deseja cancelar este pedido? Se aplicável, os
              itens serão retornados ao estoque automaticamente.
            </p>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button
                onClick={confirmarCancelamentoAdmin}
                disabled={loadingCancelAdmin}
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
                {loadingCancelAdmin ? "Cancelando..." : "Sim, Cancelar"}
              </button>
              <button
                onClick={() => setOrderParaCancelar(null)}
                disabled={loadingCancelAdmin}
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

      {/* Modal de Novo Pedido */}
      {isNewOrderModalOpen && (
        <div className="pedidos-modal-overlay">
          <div className="pedidos-modal-card">
            <div className="modal-header">
              <h2>Lançar Novo Pedido</h2>
              <button
                className="btn-close-modal"
                onClick={() => setIsNewOrderModalOpen(false)}
              >
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
                  onChange={(e) =>
                    setNewOrderForm({
                      ...newOrderForm,
                      customer: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Mesa / Tipo</label>
                  <input
                    type="text"
                    value={newOrderForm.location}
                    onChange={(e) =>
                      setNewOrderForm({
                        ...newOrderForm,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Item Principal</label>
                  <input
                    type="text"
                    value={newOrderForm.itemName}
                    onChange={(e) =>
                      setNewOrderForm({
                        ...newOrderForm,
                        itemName: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setNewOrderForm({
                        ...newOrderForm,
                        quantity: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Preço Un. (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newOrderForm.price}
                    onChange={(e) =>
                      setNewOrderForm({
                        ...newOrderForm,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn-save-modal"
                  disabled={salvandoPedido}
                >
                  {salvandoPedido ? "Salvando…" : "Confirmar Pedido"}
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
