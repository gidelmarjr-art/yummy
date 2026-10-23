import { useEffect, useRef, useState } from "react";

export function useContagem(alvo, duracao = 1100) {
  const reduzido =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [valor, setValor] = useState(reduzido ? alvo : 0);
  const atual = useRef(valor);

  useEffect(() => {
    if (reduzido) {
      setValor(alvo);
      return;
    }
    const de = atual.current;
    const inicio = performance.now();
    let q;

    const passo = (t) => {
      const p = Math.min((t - inicio) / duracao, 1);
      atual.current = de + (alvo - de) * (1 - (1 - p) ** 4); // ease-out
      setValor(atual.current);
      if (p < 1) {
        q = requestAnimationFrame(passo);
      }
    };

    q = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(q);
  }, [alvo, duracao, reduzido]);

  return valor;
}
