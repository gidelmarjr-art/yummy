import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import PerfilLayout from "../PerfilLayout";
export default function MeusPedidos() { return <PerfilLayout title="Meus pedidos" description="Veja o andamento e o histórico das suas compras."><div className="profile-empty profile-empty--large"><FaShoppingBag /><h2>Você ainda não fez nenhum pedido</h2><p>Quando você finalizar uma compra, seus pedidos aparecerão aqui.</p><Link className="profile-primary-button" to="/home">Ver cardápio</Link></div></PerfilLayout>; }
