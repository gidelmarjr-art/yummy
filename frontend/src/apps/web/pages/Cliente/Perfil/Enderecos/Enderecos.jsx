import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import PerfilLayout from "../PerfilLayout";
import { criarEndereco, excluirEndereco, getEnderecos } from "../../../../services/api";

const FORM_INICIAL = { label: "Casa", street: "", number: "", complement: "", city: "" };
const paraTela = (endereco) => ({ id: endereco.id, label: endereco.apelido, street: endereco.rua, number: endereco.numero, complement: endereco.complemento || "", city: endereco.cidade });

export default function Enderecos() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getEnderecos().then((enderecos) => setAddresses(enderecos.map(paraTela))).catch((erro) => setMessage(erro.detail || "Não foi possível carregar os endereços."));
  }, []);

  const submit = async (event) => {
    event.preventDefault(); setMessage("");
    try {
      const criado = await criarEndereco({ apelido: form.label, rua: form.street, numero: form.number, complemento: form.complement || null, cidade: form.city });
      setAddresses((atuais) => [...atuais, paraTela(criado)]);
      setAdding(false); setForm(FORM_INICIAL); setMessage("Endereço salvo com sucesso.");
    } catch (erro) { setMessage(erro.detail || "Não foi possível salvar o endereço."); }
  };

  const remover = async (id) => {
    setMessage("");
    try { await excluirEndereco(id); setAddresses((atuais) => atuais.filter((item) => item.id !== id)); }
    catch (erro) { setMessage(erro.detail || "Não foi possível excluir o endereço."); }
  };

  return <PerfilLayout title="Endereços" description="Cadastre os locais onde você quer receber seus pedidos.">
    <div className="profile-section-action"><h2>Endereços salvos</h2><button className="profile-primary-button" onClick={() => setAdding(!adding)}>{adding ? "Cancelar" : "Adicionar endereço"}</button></div>
    {adding && <form className="profile-form-card" onSubmit={submit}><div className="profile-form-grid"><label>Identificação<input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></label><label>Rua / Avenida<input required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} /></label><label>Número<input required value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} /></label><label>Complemento<input value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} /></label><label>Cidade<input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label></div><div className="profile-form-actions"><button className="profile-primary-button" type="submit">Salvar endereço</button></div></form>}
    {message && <p className={message.includes("sucesso") ? "profile-success" : "profile-error"}>{message}</p>}
    <div className="profile-list">{addresses.length ? addresses.map((address) => <article className="profile-list-card" key={address.id}><FaMapMarkerAlt className="profile-list-card__icon" /><div><h3>{address.label}</h3><p>{address.street}, {address.number}{address.complement ? ` — ${address.complement}` : ""}<br />{address.city}</p></div><button className="profile-icon-button is-danger" onClick={() => remover(address.id)} aria-label="Excluir endereço"><FaTrash /></button></article>) : <div className="profile-empty">Nenhum endereço cadastrado. Adicione seu endereço para agilizar seu próximo pedido.</div>}</div>
  </PerfilLayout>;
}
