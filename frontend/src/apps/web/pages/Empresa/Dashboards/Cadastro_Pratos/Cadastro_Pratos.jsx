import React, { useEffect, useState } from "react";
import { FaSearch, FaCog, FaBell, FaUtensils, FaPlus, FaTrashAlt, FaSave } from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import { getEstoque, criarProduto, getCardapio } from "../../../../services/api";
import "../dashboards-shared.css";
import "./Cadastro_Pratos.css";

const CATEGORIES = [
  "Entradas",
  "Pratos principais",
  "Sobremesas",
  "Bebidas",
  "Bebidas com Alcoól",
  "Adicionais",
];

export default function CadastroPratos() {
  const [dados, setDados] = useState({
    nome: "",
    categoria: "Pratos principais",
    preco: "",
    status: "Em estoque",
  });

  // Cada linha da ficha técnica: qual insumo e quanto ele gasta por unidade vendida.
  const [fichaTecnica, setFichaTecnica] = useState([{ insumo_id: "", quantidade_necessaria: "" }]);

  const [insumos, setInsumos] = useState([]);
  const [carregandoInsumos, setCarregandoInsumos] = useState(true);
  const [recentes, setRecentes] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const carregarRecentes = () => {
    getCardapio()
      .then((data) => setRecentes(data.slice(-5).reverse()))
      .catch(() => {});
  };

  useEffect(() => {
    getEstoque()
      .then(setInsumos)
      .catch((err) => setMensagem({ tipo: "erro", texto: "Não foi possível carregar os insumos: " + (err.detail || err.message) }))
      .finally(() => setCarregandoInsumos(false));
    carregarRecentes();
  }, []);

  const handleFichaChange = (index, campo, valor) => {
    setFichaTecnica((prev) => prev.map((linha, i) => (i === index ? { ...linha, [campo]: valor } : linha)));
  };

  const adicionarLinhaFicha = () => {
    setFichaTecnica((prev) => [...prev, { insumo_id: "", quantidade_necessaria: "" }]);
  };

  const removerLinhaFicha = (index) => {
    setFichaTecnica((prev) => prev.filter((_, i) => i !== index));
  };

  const insumoUnidade = (insumoId) => insumos.find((i) => i.id === Number(insumoId))?.unidade || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    if (!dados.nome || !dados.preco) {
      setMensagem({ tipo: "erro", texto: "Preencha ao menos o nome e o preço do prato." });
      return;
    }

    const linhasValidas = fichaTecnica.filter((l) => l.insumo_id && l.quantidade_necessaria);
    if (fichaTecnica.some((l) => (l.insumo_id && !l.quantidade_necessaria) || (!l.insumo_id && l.quantidade_necessaria))) {
      setMensagem({ tipo: "erro", texto: "Complete ou remova as linhas de ficha técnica em branco." });
      return;
    }

    setSalvando(true);
    try {
      await criarProduto({
        nome: dados.nome,
        categoria: dados.categoria,
        preco: parseFloat(String(dados.preco).replace(",", ".")),
        status: dados.status,
        ficha_tecnica: linhasValidas.map((l) => ({
          insumo_id: Number(l.insumo_id),
          quantidade_necessaria: parseFloat(String(l.quantidade_necessaria).replace(",", ".")),
        })),
      });
      setMensagem({ tipo: "sucesso", texto: `"${dados.nome}" foi cadastrado no cardápio!` });
      setDados({ nome: "", categoria: dados.categoria, preco: "", status: "Em estoque" });
      setFichaTecnica([{ insumo_id: "", quantidade_necessaria: "" }]);
      carregarRecentes();
    } catch (err) {
      setMensagem({ tipo: "erro", texto: err.detail || "Não foi possível cadastrar o prato." });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="cadastro-pratos-page-layout">
      <Sidebar />

      <main className="cadastro-pratos-main-content">
        <header className="cadastro-pratos-top-bar">
          <h1 className="page-heading">Cadastro de Pratos</h1>

          <div className="top-bar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Pesquisar..." />
            </div>
            <button className="action-circle-btn" aria-label="Configurações"><FaCog /></button>
            <button className="action-circle-btn" aria-label="Notificações"><FaBell /></button>
            <div className="user-profile-avatar">
              <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="cadastro-pratos-body-content">
          <form onSubmit={handleSubmit} className="cadastro-pratos-form-wrapper">
            {mensagem && (
              <p className={mensagem.tipo === "erro" ? "form-error-msg" : "form-success-msg"}>{mensagem.texto}</p>
            )}

            <div className="cp-card">
              <h3 className="section-title"><FaUtensils style={{ color: "#ff5500" }} /> Dados do Prato</h3>

              <div className="cp-form-grid">
                <div className="cp-input-group full-width">
                  <label>Nome do Prato</label>
                  <input
                    type="text"
                    placeholder="Ex: X-Burger Artesanal"
                    value={dados.nome}
                    onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="cp-input-group">
                  <label>Categoria</label>
                  <select value={dados.categoria} onChange={(e) => setDados({ ...dados, categoria: e.target.value })}>
                    {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>

                <div className="cp-input-group">
                  <label>Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="28.50"
                    value={dados.preco}
                    onChange={(e) => setDados({ ...dados, preco: e.target.value })}
                    required
                  />
                </div>

                <div className="cp-input-group">
                  <label>Status Inicial</label>
                  <select value={dados.status} onChange={(e) => setDados({ ...dados, status: e.target.value })}>
                    <option value="Em estoque">Em estoque</option>
                    <option value="Esgotado">Esgotado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="cp-card">
              <h3 className="section-title">📋 Ficha Técnica (composição de insumos)</h3>
              <p className="cp-hint">
                Diga o que esse prato consome do estoque. A cada venda, o sistema desconta
                automaticamente essa quantidade dos insumos — e bloqueia o prato sozinho se algum faltar.
              </p>

              {carregandoInsumos ? (
                <p className="dashboard-loading-msg">Carregando insumos…</p>
              ) : insumos.length === 0 ? (
                <p className="dashboard-empty-msg">
                  Nenhum insumo cadastrado ainda. Cadastre insumos na tela de Estoque antes de montar a ficha técnica
                  (ou salve o prato sem ficha técnica por enquanto).
                </p>
              ) : (
                <div className="cp-ficha-list">
                  {fichaTecnica.map((linha, index) => (
                    <div className="cp-ficha-row" key={index}>
                      <select
                        value={linha.insumo_id}
                        onChange={(e) => handleFichaChange(index, "insumo_id", e.target.value)}
                      >
                        <option value="">Selecione um insumo…</option>
                        {insumos.map((insumo) => (
                          <option key={insumo.id} value={insumo.id}>
                            {insumo.nome} ({insumo.codigo})
                          </option>
                        ))}
                      </select>

                      <div className="cp-ficha-qtd">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Qtd. por unidade"
                          value={linha.quantidade_necessaria}
                          onChange={(e) => handleFichaChange(index, "quantidade_necessaria", e.target.value)}
                        />
                        <span className="cp-unidade">{insumoUnidade(linha.insumo_id)}</span>
                      </div>

                      <button
                        type="button"
                        className="cp-btn-remove-row"
                        onClick={() => removerLinhaFicha(index)}
                        disabled={fichaTecnica.length === 1}
                        title="Remover linha"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))}

                  <button type="button" className="cp-btn-add-row" onClick={adicionarLinhaFicha}>
                    <FaPlus /> Adicionar insumo à ficha técnica
                  </button>
                </div>
              )}
            </div>

            <div className="cp-actions-wrapper">
              <button type="submit" className="save-config-btn" disabled={salvando}>
                <FaSave style={{ marginRight: "8px" }} /> {salvando ? "Salvando…" : "Cadastrar Prato"}
              </button>
            </div>
          </form>

          {recentes.length > 0 && (
            <div className="cp-card cp-recentes">
              <h3 className="section-title">Últimos pratos cadastrados</h3>
              <div className="cp-recentes-list">
                {recentes.map((p) => (
                  <div key={p.id} className="cp-recente-item">
                    <div>
                      <strong>{p.nome}</strong>
                      <span className="cp-recente-sub">{p.categoria} • {p.codigo}</span>
                    </div>
                    <div className="cp-recente-right">
                      <span className="cp-recente-ficha">
                        {p.ficha_tecnica.length > 0
                          ? `${p.ficha_tecnica.length} insumo(s) na ficha técnica`
                          : "Sem ficha técnica"}
                      </span>
                      <span className={`status-pill status-${p.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
