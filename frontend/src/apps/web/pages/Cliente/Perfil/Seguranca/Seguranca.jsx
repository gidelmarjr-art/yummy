import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import PerfilLayout from "../PerfilLayout";
export default function Seguranca() {
  const [form, setForm] = useState({ current: "", password: "", confirm: "" }); const [message, setMessage] = useState("");
  const submit = (event) => { event.preventDefault(); if (form.password.length < 6) return setMessage("A nova senha deve ter ao menos 6 caracteres."); if (form.password !== form.confirm) return setMessage("A confirmação de senha não confere."); setMessage("Senha atualizada com sucesso."); setForm({ current: "", password: "", confirm: "" }); };
  return <PerfilLayout title="Segurança" description="Atualize a senha da sua conta."><form className="profile-form-card profile-form-card--narrow" onSubmit={submit}><h2><FaLock /> Alterar senha</h2><div className="profile-form-stack"><label>Senha atual<input required type="password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} /></label><label>Nova senha<input required minLength="6" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><label>Confirmar nova senha<input required type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></label></div>{message && <p className={message.includes("sucesso") ? "profile-success" : "profile-error"}>{message}</p>}<div className="profile-form-actions"><button className="profile-primary-button" type="submit">Atualizar senha</button></div></form></PerfilLayout>;
}
