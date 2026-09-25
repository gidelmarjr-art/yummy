import React, { useState } from "react";
import PerfilLayout from "../PerfilLayout";
import { getProfile, updateProfile } from "../profileStorage";

export default function DadosPessoais() {
  const [form, setForm] = useState(() => getProfile()); const [message, setMessage] = useState("");
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => { event.preventDefault(); updateProfile(form); setMessage("Dados atualizados com sucesso."); };
  return <PerfilLayout title="Dados pessoais" description="Mantenha suas informações de contato atualizadas.">
    <form className="profile-form-card" onSubmit={submit}><div className="profile-form-grid"><label>Nome completo<input required name="name" value={form.name} onChange={change} /></label><label>E-mail<input required type="email" name="email" value={form.email} onChange={change} /></label><label>Telefone<input name="phone" placeholder="(00) 00000-0000" value={form.phone} onChange={change} /></label><label>Data de nascimento<input type="date" name="birthDate" value={form.birthDate} onChange={change} /></label></div>{message && <p className="profile-success">{message}</p>}<div className="profile-form-actions"><button className="profile-primary-button" type="submit">Salvar alterações</button></div></form>
  </PerfilLayout>;
}
