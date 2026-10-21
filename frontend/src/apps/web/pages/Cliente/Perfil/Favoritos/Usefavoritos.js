import { useCallback, useState } from "react";
import { getProfile, updateProfile } from "./profileStorage";

// Favoritos do cliente. Ficam salvos junto com o resto do perfil
// (profileStorage / localStorage) — só o id do prato é o que importa: nome,
// foto e preço atuais são buscados no cardápio na hora de mostrar.
export default function useFavoritos() {
  const [favoritos, setFavoritos] = useState(
    () => getProfile().favorites || [],
  );

  const isFavorito = useCallback(
    (id) => favoritos.some((f) => f.id === id),
    [favoritos],
  );

  // Marca/desmarca um prato. Aceita o card da Home ({ id, title, desc, category }).
  const alternarFavorito = useCallback((produto) => {
    // Lê do storage (e não do estado) para não sobrescrever mudanças feitas em outra aba.
    const atuais = getProfile().favorites || [];
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
    updateProfile({ favorites: proximos });
    setFavoritos(proximos);
    return !jaEra;
  }, []);

  const removerFavorito = useCallback((id) => {
    const proximos = (getProfile().favorites || []).filter((f) => f.id !== id);
    updateProfile({ favorites: proximos });
    setFavoritos(proximos);
  }, []);

  return { favoritos, isFavorito, alternarFavorito, removerFavorito };
}
