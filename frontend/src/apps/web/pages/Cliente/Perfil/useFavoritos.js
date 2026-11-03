import { useCallback, useEffect, useRef, useState } from "react";
import {
  desfavoritarProduto,
  favoritarProduto,
  getFavoritos,
} from "../../../services/api";
import { getProfile, updateProfile } from "./profileStorage";

// O banco é a fonte de verdade. O localStorage é atualizado apenas como cache
// para não quebrar a tela enquanto a lista autenticada ainda está carregando.
export default function useFavoritos() {
  const [favoritos, setFavoritos] = useState(
    () => getProfile().favorites || [],
  );
  const favoritosRef = useRef(favoritos);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const aplicarFavoritos = useCallback((proximos) => {
    favoritosRef.current = proximos;
    setFavoritos(proximos);
    updateProfile({ favorites: proximos });
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarFavoritos() {
      try {
        const resposta = await getFavoritos();
        if (!ativo) return;

        // A API retorna { produto_id, criado_em }. O restante das informações
        // é sempre obtido do cardápio, para refletir preço e estoque atuais.
        aplicarFavoritos(resposta.map((favorito) => ({ id: favorito.produto_id })));
        setErro(null);
      } catch (error) {
        if (ativo) setErro(error);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarFavoritos();
    return () => {
      ativo = false;
    };
  }, [aplicarFavoritos]);

  const isFavorito = useCallback(
    (id) => favoritos.some((f) => f.id === id),
    [favoritos],
  );

  // Marca/desmarca um prato e persiste a mudança para o usuário autenticado.
  const alternarFavorito = useCallback(async (produto) => {
    const atuais = favoritosRef.current;
    const jaEra = atuais.some((f) => f.id === produto.id);
    const proximos = jaEra
      ? atuais.filter((f) => f.id !== produto.id)
      : [
          ...atuais,
          {
            id: produto.id,
            name: produto.title,
            description: produto.desc,
            category: produto.category,
          },
        ];
    aplicarFavoritos(proximos);
    setErro(null);

    try {
      if (jaEra) await desfavoritarProduto(produto.id);
      else await favoritarProduto(produto.id);
    } catch (error) {
      // Não deixamos a interface indicar uma preferência que não foi salva.
      aplicarFavoritos(atuais);
      setErro(error);
      return false;
    }
    return !jaEra;
  }, [aplicarFavoritos]);

  const removerFavorito = useCallback(async (id) => {
    const atuais = favoritosRef.current;
    const proximos = atuais.filter((f) => f.id !== id);
    if (proximos.length === atuais.length) return false;

    aplicarFavoritos(proximos);
    setErro(null);
    try {
      await desfavoritarProduto(id);
      return true;
    } catch (error) {
      aplicarFavoritos(atuais);
      setErro(error);
      return false;
    }
  }, [aplicarFavoritos]);

  return {
    favoritos,
    isFavorito,
    alternarFavorito,
    removerFavorito,
    carregando,
    erro,
  };
}
