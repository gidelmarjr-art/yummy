import React, { useEffect, useState } from "react";
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
import {
  getCardapio,
  criarProduto,
  atualizarProduto,
  alternarStatusProduto,
  excluirProduto,
  excluirProdutosPorCategoria,
  getCategorias,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria,
} from "../../../../services/api";
import "../dashboards-shared.css";
import "./Cardapio.css";

function produtoParaItem(produto) {
  return {
    id: produto.id,
    code: produto.codigo,
    name: produto.nome,
    category: produto.categoria,
    status: produto.status,
    price: Number(produto.preco),
    image: produto.imagem_url || produto.foto || produto.imagem || null,
    description: produto.descricao || produto.description || "",
  };
}

export default function GestaoCardapio() {
  const [items, setItems] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Pratos principais",
    status: "Em estoque",
    price: "",
    description: "",
    image: "",
  });

  const carregarCardapio = () => {
    return Promise.all([getCardapio(), getCategorias(true)])
      .then(([data, cats]) => { setItems(data.map(produtoParaItem)); setCategories(cats); setActiveCategory((current) => current || cats.find((cat) => cat.ativo)?.slug || ""); })
      .catch((err) => setErro(err.detail || err.message));
  };

  useEffect(() => {
    carregarCardapio().finally(() => setCarregando(false));
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const atualizado = await alternarStatusProduto(id);
      setItems((prev) => prev.map((item) => (item.id === id ? produtoParaItem(atualizado) : item)));
    } catch (err) {
      alert(err.detail || "Não foi possível alternar o status.");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleClearAllCategory = async () => {
    if (!window.confirm(`Tem certeza que deseja apagar todos os itens da categoria "${activeCategory}"?`)) return;
    try {
      await excluirProdutosPorCategoria(activeCategory);
      setItems((prev) => prev.filter((item) => item.category !== activeCategory));
    } catch (err) {
      alert(err.detail || "Não foi possível apagar a categoria.");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Deseja realmente remover este item do cardápio?")) return;
    try {
      await excluirProduto(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.detail || "Não foi possível excluir o item.");
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (!newCategory.trim()) return;
    try { const category = await criarCategoria({ nome: newCategory }); setCategories((prev) => [...prev, category]); setActiveCategory(category.slug); setNewCategory(""); }
    catch (err) { alert(err.detail || "Não foi possível criar a categoria."); }
  };
  const handleToggleCategory = async (category) => {
    try { const updated = await atualizarCategoria(category.id, { ativo: !category.ativo }); setCategories((prev) => prev.map((item) => item.id === updated.id ? updated : item)); }
    catch (err) { alert(err.detail || "Não foi possível atualizar a categoria."); }
  };
  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Excluir a categoria "${category.nome}"?`)) return;
    try { await excluirCategoria(category.id); setCategories((prev) => prev.filter((item) => item.id !== category.id)); }
    catch (err) { alert(err.detail || "Não é possível excluir esta categoria."); }
  };

  const handleOpenModal = (itemToEdit = null) => {
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setFormData({
        name: itemToEdit.name,
        category: itemToEdit.category,
        status: itemToEdit.status,
        price: itemToEdit.price.toString(),
        description: itemToEdit.description || "",
        image: itemToEdit.image || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        category: activeCategory,
        status: "Em estoque",
        price: "",
        description: "",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Por favor, preencha o nome e o preço do item.");
      return;
    }

    const priceNum = parseFloat(formData.price.replace(",", "."));
    setSalvando(true);
    try {
      if (editingItem) {
        const atualizado = await atualizarProduto(editingItem.id, {
          nome: formData.name,
          categoria: formData.category,
          status: formData.status,
          preco: priceNum,
          descricao: formData.description,
          imagem_url: formData.image,
        });
        setItems((prev) => prev.map((item) => (item.id === editingItem.id ? produtoParaItem(atualizado) : item)));
      } else {
        const criado = await criarProduto({
          nome: formData.name,
          categoria: formData.category,
          status: formData.status,
          preco: priceNum,
          descricao: formData.description,
          imagem_url: formData.image,
          ficha_tecnica: [],
        });
        setItems((prev) => [...prev, produtoParaItem(criado)]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.detail || "Não foi possível salvar o item.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="cardapio-page-layout">
      <Sidebar />

      <main className="cardapio-main-content">
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
            <button className="action-circle-btn" aria-label="Configurações"><FaCog /></button>
            <button className="action-circle-btn" aria-label="Notificações"><FaBell /></button>
            <div className="user-profile-avatar">
              <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Avatar Hamburguer" />
            </div>
          </div>
        </header>

        <div className="cardapio-dashboard-body">
          {erro && <p className="dashboard-error-msg">{erro}</p>}

          <div className="top-action-buttons">
            <button className="btn-primary-orange" onClick={() => handleOpenModal(null)}>
              <FaPlus /> ADICIONAR ITEM
            </button>
            <button className="btn-primary-orange" onClick={() => setShowCategories(true)}>GERENCIAR CATEGORIAS</button>
            <button className="btn-primary-orange btn-danger-action" onClick={handleClearAllCategory}>
              <FaTrashAlt /> APAGAR TUDO
            </button>
          </div>

          <div className="cardapio-table-container">
            <div className="categories-tab-bar">
              {categories.filter((cat) => cat.ativo).map((cat) => (
                <button
                  key={cat.id}
                  className={`category-tab-item ${activeCategory === cat.slug ? "active" : ""}`}
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    setCurrentPage(1);
                  }}
                >
                  {cat.nome}
                </button>
              ))}
            </div>

            <div className="menu-items-table">
              {carregando ? (
                <p className="dashboard-loading-msg">Carregando cardápio…</p>
              ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <div key={item.id} className="menu-item-row">
                    <div className="item-photo">
                      {item.image ? (
                        <img src={item.image} alt={item.name} loading="lazy" />
                      ) : (
                        <FaCamera />
                      )}
                    </div>
                    <span className="item-code">{item.code}</span>
                    <div className="item-title-col">
                      <span className="item-title">{item.name}</span>
                      {item.description && (
                        <span className="item-desc">{item.description}</span>
                      )}
                    </div>

                    <div className="item-status-col">
                      <button
                        type="button"
                        className={`btn-toggle-stock ${item.status === "Em estoque" ? "in-stock" : "out-stock"}`}
                        onClick={() => handleToggleStatus(item.id)}
                        title="Clique para alternar disponibilidade"
                      >
                        {item.status === "Em estoque" ? (
                          <><FaCheck className="status-icon" /> Em estoque</>
                        ) : (
                          <><FaBan className="status-icon" /> Esgotado</>
                        )}
                      </button>
                    </div>

                    <span className="item-cost">
                      {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>

                    <div className="item-actions-col">
                      <button className="btn-edit-item" onClick={() => handleOpenModal(item)}>Editar</button>
                      <button className="btn-delete-single" onClick={() => handleDeleteItem(item.id)} title="Excluir item">
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-table-message">Nenhum item encontrado nesta categoria.</div>
              )}
            </div>
          </div>

          <footer className="cardapio-pagination">
            <button className="btn-page-step" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
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
            <button className="btn-page-step" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
              Next <FaChevronRight />
            </button>
          </footer>
        </div>
      </main>

      {isModalOpen && (
        <div className="cardapio-modal-overlay">
          <div className="cardapio-modal-card">
            <div className="modal-header">
              <h2>{editingItem ? "Editar Item" : "Novo Item do Cardápio"}</h2>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
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

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Blend artesanal, bacon crocante e molho barbecue da casa."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Foto (URL da imagem)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
                {formData.image && (
                  <img className="modal-image-preview" src={formData.image} alt="Prévia" />
                )}
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Categoria</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    {categories.filter((cat) => cat.ativo).map((cat) => (<option key={cat.id} value={cat.slug}>{cat.nome}</option>))}
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
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Em estoque">Em estoque</option>
                  <option value="Esgotado">Esgotado</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save-modal" disabled={salvando}>
                  {salvando ? "Salvando…" : editingItem ? "Salvar Alterações" : "Adicionar Item"}
                </button>
                <button type="button" className="btn-cancel-modal" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showCategories && <div className="cardapio-modal-overlay"><div className="cardapio-modal-card"><div className="modal-header"><h2>Gerenciar categorias</h2><button className="btn-close-modal" onClick={() => setShowCategories(false)}><FaTimes /></button></div><form className="modal-form" onSubmit={handleCreateCategory}><div className="form-group"><label>Nova categoria</label><input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Ex: Carne Assada" /></div><button className="btn-save-modal">Adicionar categoria</button></form><div className="menu-items-table">{categories.map((category) => <div className="menu-item-row" key={category.id}><span className="item-title">{category.nome}</span><span>{category.ativo ? "Ativa" : "Inativa"}</span><div className="item-actions-col"><button className="btn-edit-item" onClick={() => handleToggleCategory(category)}>{category.ativo ? "Desativar" : "Ativar"}</button><button className="btn-delete-single" onClick={() => handleDeleteCategory(category)}><FaTimes /></button></div></div>)}</div></div></div>}
    </div>
  );
}
