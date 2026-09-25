import React, { useState } from "react";
import { FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import PerfilLayout from "../PerfilLayout";
import { getProfile, updateProfile } from "../profileStorage";

export default function Enderecos() {
  const [profile, setProfile] = useState(getProfile()); const [form, setForm] = useState({ label: "Casa", street: "", number: "", complement: "", city: "" }); const [adding, setAdding] = useState(false);
  const save = (addresses) => { const next = updateProfile({ addresses }); setProfile(next); };
  const submit = (event) => { event.preventDefault(); save([...profile.addresses, { ...form, id: Date.now() }]); setAdding(false); setForm({ label: "Casa", street: "", number: "", complement: "", city: "" }); };
  return <PerfilLayout title="Endereços" description="Cadastre os locais onde você quer receber seus pedidos.">
    <div className="profile-section-action"><h2>Endereços salvos</h2><button className="profile-primary-button" onClick={() => setAdding(!adding)}>{adding ? "Cancelar" : "Adicionar endereço"}</button></div>
    {adding && <form className="profile-form-card" onSubmit={submit}><div className="profile-form-grid"><label>Identificação<input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></label><label>Rua / Avenida<input required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} /></label><label>Número<input required value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} /></label><label>Complemento<input value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} /></label><label>Cidade<input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label></div><div className="profile-form-actions"><button className="profile-primary-button" type="submit">Salvar endereço</button></div></form>}
    <div className="profile-list">{profile.addresses.length ? profile.addresses.map((address) => <article className="profile-list-card" key={address.id}><FaMapMarkerAlt className="profile-list-card__icon" /><div><h3>{address.label}</h3><p>{address.street}, {address.number}{address.complement ? ` — ${address.complement}` : ""}<br />{address.city}</p></div><button className="profile-icon-button is-danger" onClick={() => save(profile.addresses.filter((item) => item.id !== address.id))} aria-label="Excluir endereço"><FaTrash /></button></article>) : <div className="profile-empty">Nenhum endereço cadastrado. Adicione seu endereço para agilizar seu próximo pedido.</div>}</div>
  </PerfilLayout>;
}
