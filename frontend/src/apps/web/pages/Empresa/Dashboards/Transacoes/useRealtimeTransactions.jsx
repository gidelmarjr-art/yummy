import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://yummy-ms7e.onrender.com";
const WS_URL = API_URL.replace(/^http/, "ws") + "/ws/transacoes";

const METRICAS_INICIAIS = {
  totalRevenue: "R$ 0,00",
  numTransactions: "0",
  averageTicket: "R$ 0,00",
};

export function useRealtimeTransactions() {
  const [metrics, setMetrics] = useState(METRICAS_INICIAIS);
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [channelsData, setChannelsData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = () => {
    const token = localStorage.getItem("access_token");
    return fetch(`${API_URL}/transacoes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar as transações.");
        return res.json();
      })
      .then((data) => {
        setMetrics(data.metrics);
        setYearlyData(data.yearlyData);
        setMonthlyRevenueData(data.monthlyRevenueData);
        setChannelsData(data.channelsData);
        setRecentTransactions(data.recentTransactions);
      });
  };

  // Carga inicial via REST.
  useEffect(() => {
    carregar()
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Tempo real: qualquer pedido concluído gera uma transação nova no
  // backend, que avisa aqui via WebSocket — a gente só recarrega.
  useEffect(() => {
    let socket;
    let reconectarTimeout;

    const conectar = () => {
      socket = new WebSocket(WS_URL);
      socket.onmessage = () => carregar().catch(() => {});
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

  return { metrics, yearlyData, monthlyRevenueData, channelsData, recentTransactions, loading, erro };
}
