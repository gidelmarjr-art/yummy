import React, { useState } from "react";
import { FaCreditCard, FaTrash } from "react-icons/fa";
import PerfilLayout from "../PerfilLayout";
import { getProfile, updateProfile } from "../profileStorage";

export default function Pagamentos() {
  const [profile, setProfile] = useState(getProfile()); const [number, setNumber] = useState("");
  const save = (payments) => setProfile(updateProfile({ payments }));
  const add = (event) => { event.preventDefault(); const digits = number.replace(/\D/g, ""); if (digits.length < 4) return; save([...profile.payments, { id: Date.now(), last4: digits.slice(-4) }]); setNumber(""); };
  return <PerfilLayout title="Pagamentos" description="Gerencie os cartões que você usa nos seus pedidos.">
    <form className="profile-add-inline" onSubmit={add}><label>Adicionar cartão<input required inputMode="numeric" value={number} placeholder="Número do cartão" onChange={(e) => setNumber(e.target.value)} /></label><button className="profile-primary-button" type="submit">Adicionar</button></form>
    <div className="profile-list">{profile.payments.length ? profile.payments.map((card) => <article className="profile-list-card" key={card.id}><FaCreditCard className="profile-list-card__icon" /><div><h3>Cartão salvo</h3><p>•••• •••• •••• {card.last4}</p></div><button className="profile-icon-button is-danger" onClick={() => save(profile.payments.filter((item) => item.id !== card.id))} aria-label="Excluir cartão"><FaTrash /></button></article>) : <div className="profile-empty">Nenhum cartão salvo. Você também poderá escolher outra forma de pagamento no checkout.</div>}</div>
  </PerfilLayout>;
}
