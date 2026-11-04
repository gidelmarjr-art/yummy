import React, { useEffect, useState } from "react";
import { FaCreditCard, FaTrash } from "react-icons/fa";
import PerfilLayout from "../PerfilLayout";
import { criarCartao, excluirCartao, getCartoes } from "../../../../services/api";

export default function Pagamentos() {
  const [cards, setCards] = useState([]);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCartoes().then(setCards).catch((erro) => setMessage(erro.detail || "Não foi possível carregar os cartões."));
  }, []);

  const add = async (event) => {
    event.preventDefault();
    const digits = number.replace(/\D/g, "");
    if (digits.length < 4) { setMessage("Informe pelo menos os quatro últimos dígitos do cartão."); return; }
    setMessage("");
    try {
      // A API armazena apenas os quatro últimos dígitos do cartão.
      const card = await criarCartao({ final: digits.slice(-4) });
      setCards((atuais) => [...atuais, card]); setNumber(""); setMessage("Cartão salvo com sucesso.");
    } catch (erro) { setMessage(erro.detail || "Não foi possível salvar o cartão."); }
  };

  const remover = async (id) => {
    setMessage("");
    try { await excluirCartao(id); setCards((atuais) => atuais.filter((item) => item.id !== id)); }
    catch (erro) { setMessage(erro.detail || "Não foi possível excluir o cartão."); }
  };

  return <PerfilLayout title="Pagamentos" description="Gerencie os cartões que você usa nos seus pedidos.">
    <form className="profile-add-inline" onSubmit={add}><label>Adicionar cartão<input required inputMode="numeric" value={number} placeholder="Número do cartão" onChange={(e) => setNumber(e.target.value)} /></label><button className="profile-primary-button" type="submit">Adicionar</button></form>
    {message && <p className={message.includes("sucesso") ? "profile-success" : "profile-error"}>{message}</p>}
    <div className="profile-list">{cards.length ? cards.map((card) => <article className="profile-list-card" key={card.id}><FaCreditCard className="profile-list-card__icon" /><div><h3>Cartão salvo</h3><p>•••• •••• •••• {card.final}</p></div><button className="profile-icon-button is-danger" onClick={() => remover(card.id)} aria-label="Excluir cartão"><FaTrash /></button></article>) : <div className="profile-empty">Nenhum cartão salvo. Você também poderá escolher outra forma de pagamento no checkout.</div>}</div>
  </PerfilLayout>;
}
