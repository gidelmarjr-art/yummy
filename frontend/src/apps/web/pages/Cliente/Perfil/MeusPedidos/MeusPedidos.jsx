import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import PerfilLayout from "../PerfilLayout";
import { getMeusPedidos } from "../../../../services/api";
import { findLocalImage } from "../../Homepage/Productsdata";
import fotoPadrao from "../../../../../../imgs/LogoYummy_2.png";
import "./MeusPedidos.css";

// Status do pedido no banco -> texto e cor mostrados ao cliente.
const STATUS_INFO = {
  Novos: { label: "Confirmado", tone: "novo" },
  "Em preparo": { label: "Em preparo", tone: "preparo" },
  Prontos: { label: "Saiu para entrega", tone: "entrega" },
  Entregues: { label: "Entregue", tone: "entregue" },
  Concluídos: { label: "Concluído", tone: "entregue" },
  Cancelado: { label: "Cancelado", tone: "cancelado" },
};

// Abas de filtro: cada uma agrupa um ou mais status do banco.
const FILTROS = [
  { key: "todos", label: "Todos", status: null },
  { key: "novos", label: "Confirmados", status: ["Novos"] },
  { key: "preparo", label: "Em preparo", status: ["Em preparo"] },
  { key: "entrega", label: "A caminho", status: ["Prontos"] },
  {
    key: "concluidos",
    label: "Concluídos",
    status: ["Entregues", "Concluídos"],
  },
  { key: "cancelados", label: "Cancelados", status: ["Cancelado"] },
];

// Atualiza a lista sozinha, para o status mudar quando a cozinha avançar o pedido.
const REFRESH_MS = 15000;

const formatarPreco = (v) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;
const limparCodigo = (codigo) => String(codigo || "").replace(/\.$/, "");

// O backend devolve a data em UTC sem o "Z"; sem ele o navegador entenderia
// como horário local e mostraria 3 horas a menos.
function parseData(iso) {
  if (!iso) return null;
  const temFuso = /(Z|[+-]\d{2}:?\d{2})$/.test(iso);
  return new Date(temFuso ? iso : `${iso}Z`);
}

const formatarData = (iso) => {
  const d = parseData(iso);
  return d
    ? d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : "";
};

function formaPagamentoParaCodigo(texto) {
  const t = String(texto || "").toLowerCase();
  if (t.includes("pix")) return "pix";
  if (t.includes("dinheiro")) return "cash";
  return "credit";
}

// Converte o pedido da API no formato que a tela de acompanhamento espera.
function pedidoParaAcompanhamento(pedido) {
  return {
    pedidoId: pedido.id,
    code: pedido.codigo,
    status: pedido.status,
    total: pedido.total,
    address: String(pedido.local || "").replace(/^Entrega\s*[—-]\s*/, ""),
    method: formaPagamentoParaCodigo(pedido.forma_pagamento),
    items: pedido.itens.map((item) => ({
      id: item.id,
      title: item.nome_produto,
      image: findLocalImage(item.nome_produto) || fotoPadrao,
      price: item.preco_unitario,
      quantity: item.quantidade,
    })),
  };
}

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  const carregar = useCallback(async ({ silencioso = false } = {}) => {
    try {
      const dados = await getMeusPedidos();
      setPedidos(dados);
      setErro(null);
    } catch (err) {
      // Numa atualização automática, mantém o que já está na tela.
      if (!silencioso)
        setErro(err.detail || "Não foi possível carregar seus pedidos.");
    } finally {
      if (!silencioso) setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
    const timer = setInterval(() => carregar({ silencioso: true }), REFRESH_MS);
    return () => clearInterval(timer);
  }, [carregar]);

  // Mais recentes primeiro
  const ordenados = useMemo(
    () => [...pedidos].sort((a, b) => b.id - a.id),
    [pedidos],
  );

  const contagem = useMemo(() => {
    const contar = {};
    FILTROS.forEach((f) => {
      contar[f.key] = f.status
        ? ordenados.filter((p) => f.status.includes(p.status)).length
        : ordenados.length;
    });
    return contar;
  }, [ordenados]);

  const filtroAtual = FILTROS.find((f) => f.key === filtro);
  const visiveis = filtroAtual.status
    ? ordenados.filter((p) => filtroAtual.status.includes(p.status))
    : ordenados;

  return (
    <PerfilLayout
      title="Meus pedidos"
      description="Veja o andamento e o histórico das suas compras."
    >
      <div className="meus-pedidos">
        {loading ? (
          <p className="meus-pedidos-msg">Carregando pedidos…</p>
        ) : erro ? (
          <div className="meus-pedidos-msg">
            <p>{erro}</p>
            <button
              className="profile-primary-button"
              onClick={() => carregar()}
            >
              Tentar de novo
            </button>
          </div>
        ) : ordenados.length === 0 ? (
          <div className="profile-empty profile-empty--large">
            <FaShoppingBag />
            <h2>Você ainda não fez nenhum pedido</h2>
            <p>
              Quando você finalizar uma compra, seus pedidos aparecerão aqui.
            </p>
            <Link className="profile-primary-button" to="/home">
              Ver cardápio
            </Link>
          </div>
        ) : (
          <>
            <div
              className="meus-pedidos-filtros"
              role="tablist"
              aria-label="Filtrar pedidos"
            >
              {FILTROS.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filtro === f.key}
                  className={`meus-pedidos-filtro ${filtro === f.key ? "active" : ""}`}
                  onClick={() => setFiltro(f.key)}
                >
                  {f.label}
                  <span className="meus-pedidos-filtro__count">
                    {contagem[f.key]}
                  </span>
                </button>
              ))}
            </div>

            {visiveis.length === 0 ? (
              <p className="meus-pedidos-msg">Nenhum pedido nesta etapa.</p>
            ) : (
              <div className="meus-pedidos-lista">
                {visiveis.map((pedido) => {
                  const info = STATUS_INFO[pedido.status] || {
                    label: pedido.status,
                    tone: "novo",
                  };
                  const emAndamento = [
                    "Novos",
                    "Em preparo",
                    "Prontos",
                  ].includes(pedido.status);
                  const resumo = pedido.itens
                    .map((i) => `${i.quantidade}x ${i.nome_produto}`)
                    .join(", ");

                  return (
                    <div className="meus-pedidos-item" key={pedido.id}>
                      <div className="meus-pedidos-item__info">
                        <div className="meus-pedidos-item__topo">
                          <strong>Pedido #{limparCodigo(pedido.codigo)}</strong>
                          <span
                            className={`meus-pedidos-badge meus-pedidos-badge--${info.tone}`}
                          >
                            {info.label}
                          </span>
                        </div>
                        <p className="meus-pedidos-item__resumo">{resumo}</p>
                        <p className="meus-pedidos-item__data">
                          {formatarData(pedido.criado_em)}
                        </p>
                      </div>

                      <div className="meus-pedidos-item__acao">
                        <strong className="meus-pedidos-item__total">
                          {formatarPreco(pedido.total)}
                        </strong>
                        <Link
                          className="profile-primary-button"
                          to="/acompanhar-entrega"
                          state={{ order: pedidoParaAcompanhamento(pedido) }}
                        >
                          {emAndamento ? "Acompanhar" : "Ver detalhes"}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </PerfilLayout>
  );
}
