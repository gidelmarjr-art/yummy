import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://yummy-ms7e.onrender.com";
const WS_URL = API_URL.replace(/^http/, "ws") + "/ws/dashboard";

const METRICAS_INICIAIS = {
  tempoAceitacao: 0,
  tempoPreparo: 0,
  cancelamentoDelivery: 0,
  cancelamentoLocal: 0,
};

export function useRealtimeDashboard() {
  const [metrics, setMetrics] = useState(METRICAS_INICIAIS);
  const [weeklyData, setWeeklyData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Carga inicial via REST (/relatorios) — o WebSocket só cuida de
  // atualizações depois que a tela já está montada.
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`${API_URL}/relatorios`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os relatórios.");
        return res.json();
      })
      .then((data) => {
        setMetrics(data.metrics);
        setWeeklyData(data.weeklyData);
        setPaymentData(data.paymentData);
        setMonthlyData(data.monthlyData);
      })
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Tempo real: quando um pedido avança de status (o que pode afetar
  // faturamento/cancelamento), o backend faz o broadcast e a gente
  // simplesmente busca os relatórios de novo.
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    let socket;
    let reconectarTimeout;

    const conectar = () => {
      socket = new WebSocket(WS_URL);

      socket.onmessage = () => {
        fetch(`${API_URL}/relatorios`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            setMetrics(data.metrics);
            setWeeklyData(data.weeklyData);
            setPaymentData(data.paymentData);
            setMonthlyData(data.monthlyData);
          })
          .catch(() => {});
      };

      socket.onclose = () => {
        reconectarTimeout = setTimeout(conectar, 3000);
      };
    };

    conectar();

    return () => {
      clearTimeout(reconectarTimeout);
      socket?.close();
    };
  }, []);

  return { metrics, weeklyData, paymentData, monthlyData, loading, erro };
}
