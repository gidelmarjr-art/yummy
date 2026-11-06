import React, { useEffect, useRef, useState } from "react";
import {
  FaUtensils,
  FaPlus,
  FaTrashAlt,
  FaSave,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import TopHeader from "../../../../components/TopHeader/TopHeader";
import DashboardSelect from "../components/DashboardSelect";
import {
  getEstoque,
  criarProduto,
  getCardapio,
  getCategorias,
} from "../../../../services/api";
import "../dashboards-shared.css";
import "./Cadastro_Pratos.css";

const TIPOS_DE_IMAGEM_ACEITOS = new Set(["image/png", "image/jpeg"]);
const EXTENSOES_DE_IMAGEM_ACEITAS = /\.(png|jpe?g)$/i;
const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

export default function CadastroPratos() {
  const imageInputRef = useRef(null);
  const [dados, setDados] = useState({
    nome: "",
    categoria: "",
    preco: "",
    status: "Em estoque",
    imagem_url: "",
    descricao: "",
  });

  const [fichaTecnica, setFichaTecnica] = useState([
    { insumo_id: "", quantidade_necessaria: "" },
  ]);

  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]);
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
      .catch((err) =>
        setMensagem({
          tipo: "erro",
          texto:
            "Não foi possível carregar os insumos: " +
            (err.detail || err.message),
        }),
      )
      .finally(() => setCarregandoInsumos(false));
    carregarRecentes();
    getCategorias()
      .then((data) => {
        setCategorias(data);
        setDados((atual) => ({
          ...atual,
          categoria: atual.categoria || data[0]?.slug || "",
        }));
      })
      .catch(() =>
        setMensagem({
          tipo: "erro",
          texto: "Não foi possível carregar as categorias.",
        }),
      );
  }, []);

  const handleFichaChange = (index, campo, valor) => {
    setFichaTecnica((prev) =>
      prev.map((linha, i) =>
        i === index ? { ...linha, [campo]: valor } : linha,
      ),
    );
  };

  const adicionarLinhaFicha = () => {
    setFichaTecnica((prev) => [
      ...prev,
      { insumo_id: "", quantidade_necessaria: "" },
    ]);
  };

  const removerLinhaFicha = (index) => {
    setFichaTecnica((prev) => prev.filter((_, i) => i !== index));
  };

  const insumoUnidade = (insumoId) =>
    insumos.find((i) => i.id === Number(insumoId))?.unidade || "";

  const removerImagem = () => {
    setDados((atual) => ({ ...atual, imagem_url: "" }));
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleImagemSelecionada = (event) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const tipoValido = TIPOS_DE_IMAGEM_ACEITOS.has(arquivo.type);
    const extensaoValida = EXTENSOES_DE_IMAGEM_ACEITAS.test(arquivo.name);
    if (!tipoValido || !extensaoValida) {
      setMensagem({
        tipo: "erro",
        texto: "Selecione uma imagem PNG, JPG ou JPEG.",
      });
      event.target.value = "";
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
      setMensagem({
        tipo: "erro",
        texto: "A imagem deve ter no máximo 5 MB.",
      });
      event.target.value = "";
      return;
    }

    const leitor = new FileReader();
    leitor.onload = () => {
      setDados((atual) => ({ ...atual, imagem_url: leitor.result }));
      setMensagem(null);
    };
    leitor.onerror = () => {
      setMensagem({
        tipo: "erro",
        texto: "Não foi possível ler a imagem selecionada.",
      });
      event.target.value = "";
    };
    leitor.readAsDataURL(arquivo);
  };

  // Função para formatar o valor como Moeda Brasileira (R$ 0,00) em tempo real
  const handlePrecoChange = (e) => {
    let valorLimpo = e.target.value.replace(/\D/g, "");
    if (!valorLimpo) {
      setDados({ ...dados, preco: "" });
      return;
    }
    const numero = Number(valorLimpo) / 100;
    const formatado = numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setDados({ ...dados, preco: formatado });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    if (!dados.nome || !dados.preco) {
      setMensagem({
        tipo: "erro",
        texto: "Preencha ao menos o nome e o preço do prato.",
      });
      return;
    }

    // Converte o formato "R$ 28,50" para float numérico padrão (28.50) para enviar à API
    const precoNumerico = parseFloat(
      String(dados.preco)
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", "."),
    );

    const linhasValidas = fichaTecnica.filter(
      (l) => l.insumo_id && l.quantidade_necessaria,
    );
    if (
      fichaTecnica.some(
        (l) =>
          (l.insumo_id && !l.quantidade_necessaria) ||
          (!l.insumo_id && l.quantidade_necessaria),
      )
    ) {
      setMensagem({
        tipo: "erro",
        texto: "Complete ou remova as linhas de ficha técnica em branco.",
      });
      return;
    }

    setSalvando(true);
    try {
      await criarProduto({
        nome: dados.nome,
        categoria: dados.categoria,
        preco: precoNumerico,
        status: dados.status,
        imagem_url: dados.imagem_url || null,
        descricao: dados.descricao || null,
        ficha_tecnica: linhasValidas.map((l) => ({
          insumo_id: Number(l.insumo_id),
          quantidade_necessaria: parseFloat(
            String(l.quantidade_necessaria).replace(",", "."),
          ),
        })),
      });
      setMensagem({
        tipo: "sucesso",
        texto: `"${dados.nome}" foi cadastrado no cardápio!`,
      });
      setDados({
        nome: "",
        categoria: dados.categoria,
        preco: "",
        status: "Em estoque",
        imagem_url: "",
        descricao: "",
      });
      if (imageInputRef.current) imageInputRef.current.value = "";
      setFichaTecnica([{ insumo_id: "", quantidade_necessaria: "" }]);
      carregarRecentes();
    } catch (err) {
      setMensagem({
        tipo: "erro",
        texto: err.detail || "Não foi possível cadastrar o prato.",
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="cadastro-pratos-page-layout">
      <Sidebar />

      <main className="cadastro-pratos-main-content">
        <TopHeader title="Cadastro de Pratos" />

        <div className="cadastro-pratos-body-content">
          <form
            onSubmit={handleSubmit}
            className="cadastro-pratos-form-wrapper"
          >
            {mensagem && (
              <p
                className={
                  mensagem.tipo === "erro"
                    ? "form-error-msg"
                    : "form-success-msg"
                }
              >
                {mensagem.texto}
              </p>
            )}

            <div className="cp-card" style={{ "--i": 0 }}>
              <h3 className="section-title">
                <FaUtensils style={{ color: "var(--laranja, #ed5b22)" }} />{" "}
                Dados do Prato
              </h3>

              <div className="cp-form-grid">
                {/* LINHA 1 - ESQUERDA: Nome do Prato */}
                <div className="cp-input-group">
                  <label>Nome do Prato</label>
                  <input
                    type="text"
                    placeholder="Ex: X-Burger Artesanal"
                    value={dados.nome}
                    onChange={(e) =>
                      setDados({ ...dados, nome: e.target.value })
                    }
                    required
                  />
                </div>

                {/* LINHA 1 - DIREITA: Categoria */}
                <div className="cp-input-group">
                  <label>Categoria</label>
                  <DashboardSelect
                    value={dados.categoria}
                    onChange={(categoria) => setDados({ ...dados, categoria })}
                    options={categorias.map((cat) => ({
                      value: cat.slug,
                      label: cat.nome,
                      color: "#3b82f6",
                    }))}
                    placeholder="Selecione uma categoria"
                  />
                </div>

                {/* LINHA 2 - ESQUERDA: Preço de Venda com Máscara Monetária */}
                <div className="cp-input-group">
                  <label>Preço de Venda (R$)</label>
                  <input
                    type="text"
                    placeholder="R$ 0,00"
                    value={dados.preco}
                    onChange={handlePrecoChange}
                    required
                  />
                </div>

                {/* LINHA 2 - DIREITA: Status Inicial */}
                <div className="cp-input-group">
                  <label>Status Inicial</label>
                  <DashboardSelect
                    value={dados.status}
                    onChange={(status) => setDados({ ...dados, status })}
                    options={[
                      {
                        value: "Em estoque",
                        label: "Em estoque",
                        color: "#16a34a",
                      },
                      {
                        value: "Esgotado",
                        label: "Esgotado",
                        color: "#dc2626",
                      },
                    ]}
                  />
                </div>

                {/* LINHA 3 - ESQUERDA: URL da Imagem */}
                <div className="cp-input-group">
                  <label>URL da imagem (opcional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={dados.imagem_url}
                    onChange={(e) =>
                      setDados({ ...dados, imagem_url: e.target.value })
                    }
                  />
                </div>

                {/* LINHA 3 - DIREITA: Upload de Arquivo de Imagem */}
                <div className="cp-input-group">
                  <label>Imagem do prato (opcional)</label>
                  <div className="cp-image-upload">
                    <input
                      ref={imageInputRef}
                      id="imagem-do-prato"
                      className="cp-image-upload__input"
                      type="file"
                      accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                      onChange={handleImagemSelecionada}
                    />
                    {dados.imagem_url ? (
                      <div className="cp-image-upload__preview">
                        <img src={dados.imagem_url} alt="Prévia do prato" />
                        <div>
                          <strong>Imagem selecionada</strong>
                        </div>
                        <button
                          type="button"
                          className="cp-image-upload__remove"
                          onClick={removerImagem}
                          aria-label="Remover imagem selecionada"
                          title="Remover imagem"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="imagem-do-prato"
                        className="cp-image-upload__trigger"
                      >
                        <FaImage />
                        <span>
                          <strong>Selecionar arquivo</strong> (PNG, JPG · máx
                          5MB)
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* LINHA 4 - LARGURA TOTAL: Descrição */}
                <div className="cp-input-group full-width">
                  <label>Descrição (opcional)</label>
                  <textarea
                    rows={3}
                    placeholder="Descreva os ingredientes e detalhes do prato..."
                    value={dados.descricao}
                    onChange={(e) =>
                      setDados({ ...dados, descricao: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="cp-card" style={{ "--i": 1 }}>
              <h3 className="section-title">
                📋 Ficha Técnica (composição de insumos)
              </h3>
              <p className="cp-hint">
                Diga o que esse prato consome do estoque. A cada venda, o
                sistema desconta automaticamente essa quantidade dos insumos — e
                bloqueia o prato sozinho se algum faltar.
              </p>

              {carregandoInsumos ? (
                <p className="dashboard-loading-msg">Carregando insumos…</p>
              ) : insumos.length === 0 ? (
                <p className="dashboard-empty-msg">
                  Nenhum insumo cadastrado ainda. Cadastre insumos na tela de
                  Estoque antes de montar a ficha técnica (ou salve o prato sem
                  ficha técnica por enquanto).
                </p>
              ) : (
                <div className="cp-ficha-list">
                  {fichaTecnica.map((linha, index) => (
                    <div className="cp-ficha-row" key={index}>
                      <DashboardSelect
                        value={linha.insumo_id}
                        onChange={(insumoId) =>
                          handleFichaChange(index, "insumo_id", insumoId)
                        }
                        options={[
                          { value: "", label: "Selecione um insumo…" },
                          ...insumos.map((insumo) => ({
                            value: insumo.id,
                            label: `${insumo.nome} (${insumo.codigo})`,
                            color: "#14b8a6",
                          })),
                        ]}
                      />

                      <div className="cp-ficha-qtd">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Qtd. por unidade"
                          value={linha.quantidade_necessaria}
                          onChange={(e) =>
                            handleFichaChange(
                              index,
                              "quantidade_necessaria",
                              e.target.value,
                            )
                          }
                        />
                        <span className="cp-unidade">
                          {insumoUnidade(linha.insumo_id)}
                        </span>
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

                  <button
                    type="button"
                    className="cp-btn-add-row"
                    onClick={adicionarLinhaFicha}
                  >
                    <FaPlus /> Adicionar insumo à ficha técnica
                  </button>
                </div>
              )}
            </div>

            <div className="cp-actions-wrapper" style={{ "--i": 2 }}>
              <button
                type="submit"
                className="save-config-btn"
                disabled={salvando}
              >
                <FaSave style={{ marginRight: "8px" }} />{" "}
                {salvando ? "Salvando…" : "Cadastrar Prato"}
              </button>
            </div>
          </form>

          {recentes.length > 0 && (
            <div className="cp-card cp-recentes" style={{ "--i": 3 }}>
              <h3 className="section-title">Últimos pratos cadastrados</h3>
              <div className="cp-recentes-list">
                {recentes.map((p) => (
                  <div key={p.id} className="cp-recente-item">
                    <div>
                      <strong>{p.nome}</strong>
                      <span className="cp-recente-sub">
                        {p.categoria} • {p.codigo}
                      </span>
                    </div>
                    <div className="cp-recente-right">
                      <span className="cp-recente-ficha">
                        {p.ficha_tecnica.length > 0
                          ? `${p.ficha_tecnica.length} insumo(s) na ficha técnica`
                          : "Sem ficha técnica"}
                      </span>
                      <span
                        className={`status-pill status-${p.status.toLowerCase().replace(/\s+/g, "-")}`}
                      >
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
