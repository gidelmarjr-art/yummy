import React, { useCallback, useEffect, useState } from "react";
import {
  FaPizzaSlice,
  FaHamburger,
  FaUtensils,
  FaFish,
  FaLeaf,
  FaCookieBite,
  FaGlassMartiniAlt,
  FaDrumstickBite,
} from "react-icons/fa";
import { getCardapio, getCategorias } from "../../../services/api";
import { findLocalImage, CATEGORY_DEFAULTS } from "./Productsdata";
import fotoPadrao from "../../../../../imgs/LogoYummy_2.png";

// Ícone por slug (ou pelo campo "icone" da categoria, se a loja definir um).
// Categoria nova criada pela loja sem ícone conhecido usa o talher.
const ICONES = {
  lanches: <FaHamburger />,
  pizzas: <FaPizzaSlice />,
  japonesa: <FaFish />,
  saudavel: <FaLeaf />,
  doces: <FaCookieBite />,
  bebidas: <FaGlassMartiniAlt />,
  frango: <FaDrumstickBite />,
};

const formatarPreco = (valor) =>
  `R$${Number(valor).toFixed(2).replace(".", ",")}`;

// "carne-assada" -> "Carne assada" (usado só quando a categoria não vem de /categorias)
const rotuloDoSlug = (slug) => {
  const texto = String(slug).replace(/[-_]+/g, " ").trim();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

// Converte um produto do banco no formato que os cards da Home já usam.
// Foto: imagem_url do banco -> foto local pelo nome -> imagem padrão.
function produtoParaCard(produto) {
  const esgotado = produto.status !== "Em estoque";
  return {
    id: produto.id, // id real do banco: é ele que o pedido envia ao backend
    category: produto.categoria,
    title: produto.nome,
    desc: produto.descricao || CATEGORY_DEFAULTS[produto.categoria]?.desc || "",
    price: esgotado ? "Esgotado" : formatarPreco(produto.preco),
    esgotado,
    img: produto.imagem_url || findLocalImage(produto.nome) || fotoPadrao,
  };
}

export default function useCardapio() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    const [resCardapio, resCategorias] = await Promise.allSettled([
      getCardapio(),
      getCategorias(),
    ]);

    if (resCardapio.status === "rejected") {
      setErro(
        resCardapio.reason?.detail || "Não foi possível carregar o cardápio.",
      );
      setCarregando(false);
      return;
    }

    const cards = resCardapio.value.map(produtoParaCard);

    // Categorias ativas, na ordem definida pela loja
    const doBanco =
      resCategorias.status === "fulfilled"
        ? resCategorias.value
            .filter((c) => c.ativo)
            .sort((a, b) => a.ordem - b.ordem)
            .map((c) => ({
              id: c.slug,
              label: c.nome,
              icon: ICONES[c.icone] || ICONES[c.slug] || <FaUtensils />,
            }))
        : [];

    // Se algum prato usa uma categoria que não está na lista (ou /categorias
    // falhou), ela aparece mesmo assim, para nenhum prato ficar escondido.
    const conhecidas = new Set(doBanco.map((c) => c.id));
    const extras = [];
    cards.forEach((card) => {
      if (card.category && !conhecidas.has(card.category)) {
        conhecidas.add(card.category);
        extras.push({
          id: card.category,
          label: rotuloDoSlug(card.category),
          icon: ICONES[card.category] || <FaUtensils />,
        });
      }
    });

    setProdutos(cards);
    setCategorias([...doBanco, ...extras]);
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { produtos, categorias, carregando, erro, recarregar: carregar };
}
