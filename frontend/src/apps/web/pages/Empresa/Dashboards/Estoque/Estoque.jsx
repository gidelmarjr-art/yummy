import React, { useState } from "react";
import {
  FaSearch,
  FaCog,
  FaBell,
  FaBoxes,
  FaChevronDown,
  FaPlus,
  FaPrint,
  FaEye,
  FaTimes,
  FaWarehouse
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import "./Estoque.css";

const STATUS_TABS = ["Estável", "Baixo", "Crítico", "Todos"];

const INITIAL_ESTOQUE = [
  { id: "EST-01", name: "Blend de Carne Bovina", category: "Carnes", quantity: 45, unit: "kg", cost: 22.50, status: "Estável" },
  { id: "EST-02", name: "Pão de Hambúrguer Artesanal", category: "Panificação", quantity: 15, unit: "un", cost: 1.80, status: "Baixo" },
  { id: "EST-03", name: "Queijo Cheddar Fatiado", category: "Laticínios", quantity: 4, unit: "kg", cost: 35.00, status: "Crítico" },
  { id: "EST-04", name: "Batata Congelada Especial", category: "Porções", quantity: 60, unit: "kg", cost: 12.00, status: "Estável" },
  { id: "EST-05", name: "Coca-Cola Zero 350ml", category: "Bebidas", quantity: 80, unit: "un", cost: 3.50, status: "Estável" }
];

export default function Estoque() {
  const [estoque, setEstoque] = useState(INITIAL_ESTOQUE);
  const [activeTab, setActiveTab] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownFilter, setDropdownFilter] = useState("Todos");

  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState({ name: "", category: "Carnes", quantity: 10, unit: "kg", cost: 10.00 });

  const getStatusType = (qty) => {
    if (qty <= 5) return "Crítico";
    if (qty <= 20) return "Baixo";
    return "Estável";
  };

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!newItemForm.name) return alert("Informe o nome do insumo.");

    const qty = Number(newItemForm.quantity);
    const item = {
      id: `EST-${Math.floor(10 + Math.random() * 90)}`,
      name: newItemForm.name,
      category: newItemForm.category,
      quantity: qty,
      unit: newItemForm.unit,
      cost: Number(newItemForm.cost),
      status: getStatusType(qty)
    };

    setEstoque([item, ...estoque]);
    setIsNewItemModalOpen(false);
    setNewItemForm({ name: "", category: "Carnes", quantity: 10, unit: "kg", cost: 10.00 });
  };

  const handleRestock = (id) => {
    setEstoque((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + 20;
          return { ...item, quantity: newQty, status: getStatusType(newQty) };
        }
        return item;
      })
    );
  };

  const filteredEstoque = estoque.filter((item) => {
    const matchesTab = activeTab === "Todos" || item.status === activeTab;
    const matchesDropdown = dropdownFilter === "Todos" || item.status === dropdownFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesDropdown && matchesSearch;
  });

  return (
    <div className="estoque-page-layout">
      <Sidebar />

      <main className="estoque-main-content">
        <header className="estoque-top-bar">
          <h1 className="page-heading">Controle de Estoque e Insumos</h1>

          <div className="top-bar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar insumo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="action-circle-btn"><FaCog /></button>
            <button className="action-circle-btn"><FaBell /></button>
            <div className="user-profile-avatar">
              <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="estoque-dashboard-body">
          <div className="top-controls-row">
            <div className="dropdown-filter-wrapper">
              <select
                className="status-dropdown-select"
                value={dropdownFilter}
                onChange={(e) => setDropdownFilter(e.target.value)}
              >
                <option value="Todos">Filtrar: Todos os níveis</option>
                <option value="Estável">Estável</option>
                <option value="Baixo">Baixo</option>
                <option value="Crítico">Crítico</option>
              </select>
              <FaChevronDown className="dropdown-icon" />
            </div>

            <div className="novo-pedido-card-top">
              <span className="card-title">Gestão de Insumos</span>
              <div className="novo-pedido-buttons">
                <button className="btn-orange-action" onClick={() => setIsNewItemModalOpen(true)}>
                  <FaPlus /> Novo Insumo
                </button>
                <button className="btn-orange-action" onClick={() => alert("Gerando relatório de suprimentos...")}>
                  <FaPrint /> Relatório
                </button>
              </div>
            </div>
          </div>

          <div className="estoque-table-container">
            <div className="status-tab-bar">
              {STATUS_TABS.map((tab) => {
                const count = tab === "Todos" ? estoque.length : estoque.filter((i) => i.status === tab).length;
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

            <div className="estoque-items-list">
              {filteredEstoque.length > 0 ? (
                filteredEstoque.map((item) => (
                  <div key={item.id} className="estoque-row-item">
                    <div className="estoque-icon"><FaBoxes /></div>
                    <div className="item-name-col">
                      <strong className="item-name">{item.name}</strong>
                      <span className="item-category">{item.category} • {item.id}</span>
                    </div>

                    <span className="item-qty">{item.quantity} {item.unit}</span>

                    <div>
                      <span className={`status-pill status-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </div>

                    <span className="item-cost">
                      {item.cost.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>

                    <div className="estoque-actions-col">
                      <button className="btn-view-details" onClick={() => setSelectedItemDetails(item)}>
                        <FaEye /> Ver
                      </button>
                      <button className="btn-repor-stock" onClick={() => handleRestock(item.id)}>
                        +20 Repor
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-msg">Nenhum insumo encontrado nesta categoria.</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Detalhes */}
      {selectedItemDetails && (
        <div className="estoque-modal-overlay">
          <div className="estoque-modal-card">
            <div className="modal-header">
              <h2>Detalhes do Insumo</h2>
              <button className="btn-close-modal" onClick={() => setSelectedItemDetails(null)}><FaTimes /></button>
            </div>
            <p><strong>Código:</strong> {selectedItemDetails.id}</p>
            <p><strong>Nome:</strong> {selectedItemDetails.name}</p>
            <p><strong>Categoria:</strong> {selectedItemDetails.category}</p>
            <p><strong>Quantidade Atual:</strong> {selectedItemDetails.quantity} {selectedItemDetails.unit}</p>
            <p><strong>Custo Unitário:</strong> {selectedItemDetails.cost.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <div className="modal-actions" style={{ marginTop: "1.5rem" }}>
              <button className="btn-cancel-modal" onClick={() => setSelectedItemDetails(null)} style={{ width: "100%" }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Insumo */}
      {isNewItemModalOpen && (
        <div className="estoque-modal-overlay">
          <div className="estoque-modal-card">
            <div className="modal-header">
              <h2>Cadastrar Novo Insumo</h2>
              <button className="btn-close-modal" onClick={() => setIsNewItemModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleCreateItem} className="modal-form">
              <div className="form-group">
                <label>Nome do Insumo</label>
                <input
                  type="text"
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Categoria</label>
                  <input
                    type="text"
                    value={newItemForm.category}
                    onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Unidade</label>
                  <select
                    value={newItemForm.unit}
                    onChange={(e) => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                  >
                    <option value="kg">kg</option>
                    <option value="un">un</option>
                    <option value="L">L</option>
                  </select>
                </div>
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Qtd Inicial</label>
                  <input
                    type="number"
                    value={newItemForm.quantity}
                    onChange={(e) => setNewItemForm({ ...newItemForm, quantity: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemForm.cost}
                    onChange={(e) => setNewItemForm({ ...newItemForm, cost: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save-modal">Salvar Insumo</button>
                <button type="button" className="btn-cancel-modal" onClick={() => setIsNewItemModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}