import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

export function useRealtimeDashboard() {
  const [metrics, setMetrics] = useState({
    tempoAceitacao: 5,
    tempoPreparo: 30,
    cancelamentoDelivery: 10,
    cancelamentoLocal: 2,
  });

  const [weeklyData, setWeeklyData] = useState([
    { day: "Sab", deposit: 480, withdraw: 240 },
    { day: "Dom", deposit: 350, withdraw: 130 },
    { day: "Seg", deposit: 320, withdraw: 250 },
    { day: "Ter", deposit: 470, withdraw: 380 },
    { day: "Qua", deposit: 150, withdraw: 240 },
    { day: "Qui", deposit: 380, withdraw: 240 },
    { day: "Sex", deposit: 390, withdraw: 330 },
  ]);

  const [paymentData] = useState([
    { name: "Crédito", value: 35, color: "#ff4d00" },
    { name: "Pix", value: 30, color: "#ffaa00" },
    { name: "Débito", value: 20, color: "#fce4d6" },
    { name: "Dinheiro", value: 15, color: "#e63900" },
  ]);

  const [monthlyData, setMonthlyData] = useState([
    { month: "Jul", faturamento: 200 },
    { month: "Aug", faturamento: 380 },
    { month: "Sep", faturamento: 280 },
    { month: "Oct", faturamento: 780 },
    { month: "Nov", faturamento: 210 },
    { month: "Dec", faturamento: 520 },
    { month: "Jan", faturamento: 680 },
  ]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });

    socket.connect();

    socket.on("dashboard_update", (newData) => {
      if (newData.metrics) setMetrics(newData.metrics);
      if (newData.weeklyData) setWeeklyData(newData.weeklyData);
      if (newData.monthlyData) setMonthlyData(newData.monthlyData);
    });

    const interval = setInterval(() => {
      setWeeklyData((prev) =>
        prev.map((item) =>
          item.day === "Sex"
            ? { ...item, deposit: item.deposit + Math.floor(Math.random() * 15) }
            : item
        )
      );
    }, 5000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  return { metrics, weeklyData, paymentData, monthlyData };
}