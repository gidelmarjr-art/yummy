import React, { useEffect, useState } from "react";
import PerfilLayout from "../PerfilLayout";
import { getPerfil, atualizarPerfil } from "../../../../services/api";
import { updateProfile } from "../profileStorage";

const paraFormulario = (perfil) => ({
  name: perfil.nome_completo || "",
  email: perfil.usuario || "",
  phone: perfil.telefone || "",
  birthDate: perfil.data_nascimento || "",
});

export default function DadosPessoais() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", birthDate: "" });
  const [message, setMessage] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    getPerfil()
      .then((perfil) => {
        if (!ativo) return;
        const dados = paraFormulario(perfil);
        setForm(dados);
        updateProfile(dados);
      })
      .catch((erro) => ativo && setMessage(erro.detail || "Não foi possível carregar seus dados."))
      .finally(() => ativo && setCarregando(false));
    return () => { ativo = false; };
  }, []);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const perfil = await atualizarPerfil({
        nome_completo: form.name,
        telefone: form.phone || null,
        data_nascimento: form.birthDate || null,
      });
      const dados = paraFormulario(perfil);
      setForm(dados);
      updateProfile(dados);
      setMessage("Dados atualizados com sucesso.");
    } catch (erro) {
      setMessage(erro.detail || "Não foi possível salvar seus dados.");
    }
  };

  return <PerfilLayout title="Dados pessoais" description="Mantenha suas informações de contato atualizadas.">
    <form className="profile-form-card" onSubmit={submit}><div className="profile-form-grid"><label>Nome completo<input required name="name" value={form.name} onChange={change} disabled={carregando} /></label><label>E-mail<input required type="email" name="email" value={form.email} readOnly title="O e-mail de login não pode ser alterado nesta tela." /></label><label>Telefone<input name="phone" placeholder="(00) 00000-0000" value={form.phone} onChange={change} disabled={carregando} /></label><label>Data de nascimento<input type="date" name="birthDate" value={form.birthDate} onChange={change} disabled={carregando} /></label></div>{message && <p className={message.includes("sucesso") ? "profile-success" : "profile-error"}>{message}</p>}<div className="profile-form-actions"><button className="profile-primary-button" type="submit" disabled={carregando}>{carregando ? "Carregando…" : "Salvar alterações"}</button></div></form>
  </PerfilLayout>;
}
