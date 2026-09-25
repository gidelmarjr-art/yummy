import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCreditCard, FaHeart, FaHome, FaLock, FaMapMarkerAlt, FaShoppingBag, FaUser } from "react-icons/fa";
import "./Perfil.css";

const NAVIGATION = [
  { label: "Visão geral", path: "/perfil", icon: <FaHome /> },
  { label: "Dados pessoais", path: "/perfil/dados-pessoais", icon: <FaUser /> },
  { label: "Endereços", path: "/perfil/enderecos", icon: <FaMapMarkerAlt /> },
  { label: "Meus pedidos", path: "/perfil/pedidos", icon: <FaShoppingBag /> },
  { label: "Favoritos", path: "/perfil/favoritos", icon: <FaHeart /> },
  { label: "Pagamentos", path: "/perfil/pagamentos", icon: <FaCreditCard /> },
  { label: "Segurança", path: "/perfil/seguranca", icon: <FaLock /> },
];

export default function PerfilLayout({ title, description, children }) {
  const location = useLocation(); const navigate = useNavigate();
  return <div className="profile-page">
    <header className="profile-topbar"><button className="profile-back" onClick={() => navigate("/home")} aria-label="Voltar ao cardápio"><FaArrowLeft /></button><Link to="/home" className="profile-brand">Yummy</Link><Link to="/carrinho" className="profile-cart">Carrinho</Link></header>
    <main className="profile-shell"><aside className="profile-sidebar"><div className="profile-sidebar__heading"><span className="profile-sidebar__avatar"><FaUser /></span><div><strong>Minha conta</strong><small>Gerencie seu perfil</small></div></div><nav aria-label="Navegação do perfil">{NAVIGATION.map((item) => <Link key={item.path} to={item.path} className={`profile-nav-link ${location.pathname === item.path ? "is-active" : ""}`}>{item.icon}<span>{item.label}</span></Link>)}</nav></aside><section className="profile-content"><div className="profile-title"><h1>{title}</h1><p>{description}</p></div>{children}</section></main>
  </div>;
}
