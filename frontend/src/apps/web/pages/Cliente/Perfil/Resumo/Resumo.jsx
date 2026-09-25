import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaShoppingBag, FaUser } from "react-icons/fa";
import PerfilLayout from "../PerfilLayout";
import { getProfile } from "../profileStorage";

export default function Resumo() {
  const [profile, setProfile] = useState(getProfile());
  useEffect(() => { setProfile(getProfile()); }, []);
  const firstName = profile.name.trim().split(" ")[0] || "cliente";
  const cards = [
    { icon: <FaShoppingBag />, title: "Meus pedidos", text: "Acompanhe seus pedidos e veja seu histórico.", path: "/perfil/pedidos", action: "Ver pedidos" },
    { icon: <FaMapMarkerAlt />, title: "Endereços", text: `${profile.addresses.length} endereço(s) salvo(s).`, path: "/perfil/enderecos", action: "Gerenciar" },
    { icon: <FaHeart />, title: "Favoritos", text: `${profile.favorites.length} restaurante(s) favorito(s).`, path: "/perfil/favoritos", action: "Ver favoritos" },
  ];
  return <PerfilLayout title={`Olá, ${firstName}!`} description="Tenha controle sobre sua conta e seus pedidos.">
    <div className="profile-welcome-card"><div className="profile-welcome-card__avatar"><FaUser /></div><div><span>CONTA YUMMY</span><h2>{profile.name}</h2><p>{profile.email}</p></div><Link className="profile-secondary-button" to="/perfil/dados-pessoais">Editar perfil</Link></div>
    <div className="profile-summary-grid">{cards.map((card) => <article className="profile-summary-card" key={card.title}><span className="profile-card-icon">{card.icon}</span><h2>{card.title}</h2><p>{card.text}</p><Link to={card.path}>{card.action} →</Link></article>)}</div>
    <article className="profile-info-card"><h2>Precisa de ajuda?</h2><p>Consulte o status de um pedido ou atualize os dados que a Yummy utiliza para preparar suas entregas.</p><Link to="/perfil/pedidos" className="profile-primary-button">Acompanhar pedido</Link></article>
  </PerfilLayout>;
}
