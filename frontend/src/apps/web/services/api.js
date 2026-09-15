// Cliente HTTP compartilhado por todos os dashboards da empresa.
// Centraliza a URL base, o header de autenticação e o tratamento de
// erros/401 num único lugar.

export const API_URL =
  process.env.REACT_APP_API_URL || "https://yummy-ms7e.onrender.com";

export class ApiError extends Error {
  constructor(status, detail) {
    super(detail || `Erro ${status}`);
    this.status = status;
    this.detail = detail;
  }
}

async function authFetch(path, { method = "GET", body, headers } = {}) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    throw new ApiError(401, "Sessão expirada. Faça login novamente.");
  }

  if (!response.ok) {
    let detail = `Erro ${response.status}`;
    try {
      const data = await response.json();
      detail = data.detail || detail;
    } catch {
      // resposta sem corpo JSON (ex: 204) — ignora
    }
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) return null;
  return response.json();
}

// ---------- Geral ----------
export const getGeral = () => authFetch("/geral");

// ---------- Pedidos ----------
export const getPedidos = (status) =>
  authFetch(`/pedidos${status ? `?status_filtro=${encodeURIComponent(status)}` : ""}`);
export const criarPedido = (dados) => authFetch("/pedidos", { method: "POST", body: dados });
export const avancarPedido = (id) => authFetch(`/pedidos/${id}/avancar`, { method: "PATCH" });
export const definirStatusPedido = (id, status) =>
  authFetch(`/pedidos/${id}/status`, { method: "PATCH", body: { status } });
export const excluirPedido = (id) => authFetch(`/pedidos/${id}`, { method: "DELETE" });

// ---------- Cardápio ----------
export const getCardapio = (categoria) =>
  authFetch(`/cardapio${categoria ? `?categoria=${encodeURIComponent(categoria)}` : ""}`);
export const criarProduto = (dados) => authFetch("/cardapio", { method: "POST", body: dados });
export const atualizarProduto = (id, dados) =>
  authFetch(`/cardapio/${id}`, { method: "PUT", body: dados });
export const alternarStatusProduto = (id) =>
  authFetch(`/cardapio/${id}/alternar-status`, { method: "PATCH" });
export const excluirProduto = (id) => authFetch(`/cardapio/${id}`, { method: "DELETE" });
export const excluirProdutosPorCategoria = (categoria) =>
  authFetch(`/cardapio?categoria=${encodeURIComponent(categoria)}`, { method: "DELETE" });

// ---------- Estoque ----------
export const getEstoque = () => authFetch("/estoque");
export const criarInsumo = (dados) => authFetch("/estoque", { method: "POST", body: dados });
export const atualizarInsumo = (id, dados) =>
  authFetch(`/estoque/${id}`, { method: "PUT", body: dados });
export const reporInsumo = (id, quantidade_adicional = 20) =>
  authFetch(`/estoque/${id}/repor`, { method: "PATCH", body: { quantidade_adicional } });
export const excluirInsumo = (id) => authFetch(`/estoque/${id}`, { method: "DELETE" });

// ---------- Clientes ----------
export const getClientes = () => authFetch("/clientes");
export const getCliente = (id) => authFetch(`/clientes/${id}`);

// ---------- Transações / Relatórios (uso pelos hooks de tempo real) ----------
export const getTransacoes = () => authFetch("/transacoes");
export const getRelatorios = () => authFetch("/relatorios");

// ---------- Segurança ----------
export const alterarSenha = (senha_atual, nova_senha) =>
  authFetch("/seguranca/alterar-senha", { method: "POST", body: { senha_atual, nova_senha } });
export const getSessoes = () => authFetch("/seguranca/sessoes");
export const revogarSessao = (id) => authFetch(`/seguranca/sessoes/${id}`, { method: "DELETE" });

// ---------- Configurações ----------
export const getConfiguracoes = () => authFetch("/configuracoes");
export const atualizarConfiguracoes = (dados) =>
  authFetch("/configuracoes", { method: "PUT", body: dados });

// ---------- Auth ----------
export const getMe = () => authFetch("/auth/me");
export const logout = () => authFetch("/auth/logout", { method: "POST" });
export const criarFuncionario = (dados) => authFetch("/auth/funcionarios", { method: "POST", body: dados });

// ---------- Utilitários ----------
export function formatTimeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 1) return "Agora";
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas}h`;
  return `${Math.floor(horas / 24)}d`;
}

export function wsUrl(caminho) {
  return API_URL.replace(/^http/, "ws") + caminho;
}
