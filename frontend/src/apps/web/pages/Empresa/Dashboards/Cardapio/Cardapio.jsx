import React, { useState } from "react";
import {
FaSearch,
  FaCog,
  FaBell,
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaBan,
  FaPlus,
  FaTrashAlt,
  FaTimes,
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import "./Cardapio.css";

const CATEGORIES = [
  "Entradas",
  "Pratos principais",
  "Sobremesas",
  "Bebidas",
  "Bebidas com Alcoól",
  "Adicionais",
];

// Dados iniciais de exemplo
const INITIAL_ITEMS = [
  { id: 1, code: "131.", name: "Sorvete com Brownie", category: "Pratos principais", status: "Em estoque", price: 18.00 },
  { id: 2, code: "132.", name: "Hambúrguer Artesanal", category: "Pratos principais", status: "Em estoque", price: 28.50 },
  { id: 3, code: "133.", name: "Batata Frita Especial", category: "Entradas", status: "Esgotado", price: 15.00 },
  { id: 4, code: "134.", name: "Coca-Cola Zero 350ml", category: "Bebidas", status: "Em estoque", price: 6.00 },
  { id: 5, code: "135.", name: "Pudim de Leite", category: "Sobremesas", status: "Em estoque", price: 12.00 },
  { id: 6, code: "136.", name: "Petit Gateau", category: "Sobremesas", status: "Esgotado", price: 22.00 },
  { id: 7, code: "137.", name: "Chopp Artesanal 500ml", category: "Bebidas com Alcoól", status: "Em estoque", price: 14.00 },
  { id: 8, code: "138.", name: "Molho Cheddar Extra", category: "Adicionais", status: "Em estoque", price: 4.50 },
];

export default function GestaoCardapio() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [activeCategory, setActiveCategory] = useState("Pratos principais");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Pratos principais",
    status: "Em estoque",
    price: "",
  });

  // Alternar rapidamente o estoque entre "Em estoque" e "Esgotado"
  const handleToggleStatus = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "Em estoque" ? "Esgotado" : "Em estoque";
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Filtragem por Categoria e Busca
  const filteredItems = items.filter((item) => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.code.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Apagar todos da categoria ativa
  const handleClearAllCategory = () => {
    if (window.confirm(`Tem certeza que deseja apagar todos os itens da categoria "${activeCategory}"?`)) {
      setItems((prev) => prev.filter((item) => item.category !== activeCategory));
    }
  };

  // Excluir item individual
  const handleDeleteItem = (id) => {
    if (window.confirm("Deseja realmente remover este item do cardápio?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Abrir Modal de Adicionar/Editar
  const handleOpenModal = (itemToEdit = null) => {
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setFormData({
        name: itemToEdit.name,
        category: itemToEdit.category,
        status: itemToEdit.status,
        price: itemToEdit.price.toString(),
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        category: activeCategory,
        status: "Em estoque",
        price: "",
      });
    }
    setIsModalOpen(true);
  };

  // Salvar Item (Novo ou Edição)
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Por favor, preencha o nome e o preço do item.");
      return;
    }

    const priceNum = parseFloat(formData.price.replace(",", "."));

    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, name: formData.name, category: formData.category, status: formData.status, price: priceNum }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        code: `${Math.floor(100 + Math.random() * 900)}.`,
        name: formData.name,
        category: formData.category,
        status: formData.status,
        price: priceNum,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="cardapio-page-layout">
      <Sidebar />

      <main className="cardapio-main-content">
        {/* Top Header */}
        <header className="cardapio-top-bar">
          <h1 className="page-heading">Gestão de Cardápio</h1>

          <div className="top-bar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar item ou código..."
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
                alt="Avatar Hamburguer"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="cardapio-dashboard-body">
          <div className="top-action-buttons">
            <button className="btn-primary-orange" onClick={() => handleOpenModal(null)}>
              <FaPlus /> ADICIONAR ITEM
            </button>
            <button className="btn-primary-orange btn-danger-action" onClick={handleClearAllCategory}>
              <FaTrashAlt /> APAGAR TUDO
            </button>
          </div>

          {/* Card Principal da Tabela */}
          <div className="cardapio-table-container">
            {/* Abas de Categorias */}
            <div className="categories-tab-bar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`category-tab-item ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Listagem de Produtos */}
            <div className="menu-items-table">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <div key={item.id} className="menu-item-row">
                    <div className="item-camera-icon">
                      <FaCamera />
                    </div>
                    <span className="item-code">{item.code}</span>
                    <span className="item-title">{item.name}</span>

                    {/* Botão Rápido de Toggle de Estoque */}
                    <div className="item-status-col">
                      <button
                        type="button"
                        className={`btn-toggle-stock ${item.status === "Em estoque" ? "in-stock" : "out-stock"}`}
                        onClick={() => handleToggleStatus(item.id)}
                        title="Clique para alternar disponibilidade"
                      >
                        {item.status === "Em estoque" ? (
                          <>
                            <FaCheck className="status-icon" /> Em estoque
                          </>
                        ) : (
                          <>
                            <FaBan className="status-icon" /> Esgotado
                          </>
                        )}
                      </button>
                    </div>

                    <span className="item-cost">
                      {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>

                    <div className="item-actions-col">
                      <button className="btn-edit-item" onClick={() => handleOpenModal(item)}>
                        Editar
                      </button>
                      <button
                        className="btn-delete-single"
                        onClick={() => handleDeleteItem(item.id)}
                        title="Excluir item"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-table-message">
                  Nenhum item encontrado nesta categoria.
                </div>
              )}
            </div>
          </div>

          {/* Paginação */}
          <footer className="cardapio-pagination">
            <button
              className="btn-page-step"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <FaChevronLeft /> Previous
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`btn-page-number ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="btn-page-step"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next <FaChevronRight />
            </button>
          </footer>
        </div>
      </main>

      {/* Modal para Criar / Editar Item */}
      {isModalOpen && (
        <div className="cardapio-modal-overlay">
          <div className="cardapio-modal-card">
            <div className="modal-header">
              <h2>{editingItem ? "Editar Item" : "Novo Item do Cardápio"}</h2>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="modal-form">
              <div className="form-group">
                <label>Nome do Produto</label>
                <input
                  type="text"
                  placeholder="Ex: Sorvete com Brownie"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="18.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status de Estoque Inicial</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Em estoque">Em estoque</option>
                  <option value="Esgotado">Esgotado</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save-modal">
                  {editingItem ? "Salvar Alterações" : "Adicionar Item"}
                </button>
                <button
                  type="button"
                  className="btn-cancel-modal"
                  onClick={() => setIsModalOpen(false)}
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