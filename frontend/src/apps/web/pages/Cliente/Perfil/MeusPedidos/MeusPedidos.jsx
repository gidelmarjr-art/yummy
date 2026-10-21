import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import PerfilLayout from "../PerfilLayout";
import { getMeusPedidos } from "../../../../services/api";
import "./MeusPedidos.css";

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeusPedidos()
      .then(setPedidos)
      .catch(() => setPedidos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PerfilLayout
      title="Meus pedidos"
      description="Veja o andamento e o histórico das suas compras."
    >
      {loading ? (
        <p className="profile-loading-msg">Carregando pedidos…</p>
      ) : pedidos.length > 0 ? (
        <div className="profile-list">
          {pedidos.map((pedido) => (
            <div className="profile-list-item" key={pedido.id}>
              <div className="profile-item-info">
                <strong>Pedido #{pedido.codigo}</strong>
                <p>
                  {new Date(pedido.criado_em).toLocaleString("pt-BR")} ·{" "}
                  {pedido.itens.length} item(ns)
                </p>
              </div>

              <div className="profile-item-action-group">
                <div className="profile-item-status-price">
                  <strong className="status-label">{pedido.status}</strong>
                  <p>R$ {Number(pedido.total).toFixed(2).replace(".", ",")}</p>
                </div>

                <Link
                  className="profile-primary-button"
                  to="/acompanhar-entrega"
                  state={{ order: pedido }}
                >
                  Acompanhar
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="profile-empty profile-empty--large">
          <FaShoppingBag />
          <h2>Você ainda não fez nenhum pedido</h2>
          <p>Quando você finalizar uma compra, seus pedidos aparecerão aqui.</p>
          <Link className="profile-primary-button" to="/home">
            Ver cardápio
          </Link>
        </div>
      )}
    </PerfilLayout>
  );
}
