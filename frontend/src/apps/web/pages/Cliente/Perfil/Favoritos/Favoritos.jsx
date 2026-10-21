import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaPlus, FaCheck } from "react-icons/fa";
import PerfilLayout from "../PerfilLayout";
import useFavoritos from "../useFavoritos";
import useCardapio from "../../Homepage/useCardapio";
import { useCart } from "../../../../../../context/CartContext";

export default function Favoritos() {
  const { favoritos, removerFavorito } = useFavoritos();
  const { produtos, carregando } = useCardapio();
  const { addToCart } = useCart();
  const [adicionadoId, setAdicionadoId] = useState(null);

  const adicionar = (produto) => {
    addToCart(produto);
    setAdicionadoId(produto.id);
    setTimeout(
      () => setAdicionadoId((atual) => (atual === produto.id ? null : atual)),
      1200,
    );
  };

  return (
    <PerfilLayout
      title="Favoritos"
      description="Os pratos que você mais gosta ficam reunidos aqui."
    >
      <div className="profile-list">
        {favoritos.length ? (
          favoritos.map((fav) => {
            // Dados atuais do prato (foto, preço, estoque). Se ele foi removido
            // do cardápio, mostra o que foi guardado e avisa que não está disponível.
            const produto = produtos.find((p) => p.id === fav.id);
            const indisponivel = !carregando && !produto;

            return (
              <article className="profile-list-card favorito-card" key={fav.id}>
                {produto ? (
                  <img
                    className="favorito-card__foto"
                    src={produto.img}
                    alt={produto.title}
                  />
                ) : (
                  <FaHeart className="profile-list-card__icon profile-list-card__icon--heart" />
                )}

                <div className="favorito-card__texto">
                  <h3>{produto?.title || fav.name}</h3>
                  <p>
                    {indisponivel
                      ? "Este prato não está mais no cardápio."
                      : produto?.desc || fav.description || ""}
                  </p>
                  {produto && (
                    <strong className="favorito-card__preco">
                      {produto.price}
                    </strong>
                  )}
                </div>

                <div className="favorito-card__acoes">
                  {produto && (
                    <button
                      className="profile-icon-button favorito-card__add"
                      onClick={() => adicionar(produto)}
                      disabled={produto.esgotado}
                      aria-label={`Adicionar ${produto.title} ao carrinho`}
                      title={
                        produto.esgotado ? "Esgotado" : "Adicionar ao carrinho"
                      }
                    >
                      {adicionadoId === produto.id ? <FaCheck /> : <FaPlus />}
                    </button>
                  )}
                  <button
                    className="profile-icon-button is-danger"
                    onClick={() => removerFavorito(fav.id)}
                    aria-label="Remover favorito"
                    title="Remover dos favoritos"
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="profile-empty profile-empty--large">
            <FaHeart />
            <h2>Nenhum favorito por enquanto</h2>
            <p>
              Toque no coração de um prato no cardápio para encontrá-lo aqui
              depois.
            </p>
            <Link className="profile-primary-button" to="/home">
              Ver cardápio
            </Link>
          </div>
        )}
      </div>
    </PerfilLayout>
  );
}
