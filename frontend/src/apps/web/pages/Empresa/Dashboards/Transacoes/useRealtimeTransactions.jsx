import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

export function useRealtimeTransactions() {
  const [metrics, setMetrics] = useState({
    totalRevenue: "R$ 150.000",
    numTransactions: "1.250",
    averageTicket: "R$ 120,00 (+5.8%)",
  });

  const [yearlyData, setYearlyData] = useState([
    { year: "2021", amount: 15000 },
    { year: "2022", amount: 23000 },
    { year: "2023", amount: 18000 },
    { year: "2024", amount: 36000 },
    { year: "2025", amount: 29000 },
    { year: "2026", amount: 42000 },
  ]);

  const [monthlyRevenueData, setMonthlyRevenueData] = useState([
    { year: "Jan", revenue: 11000 },
    { year: "Fev", revenue: 19000 },
    { year: "Mar", revenue: 26000 },
    { year: "Abr", revenue: 21000 },
    { year: "Mai", revenue: 24000 },
    { year: "Jun", revenue: 34000 },
  ]);

  const [channelsData, setChannelsData] = useState([
    {
      id: 1,
      name: "App Yummy (Delivery)",
      category: "Entregas Online",
      value: "R$ 84.000",
      percentage: "+16%",
      isPositive: true,
      bg: "#ffe8ec",
      iconColor: "#ff4d6d",
      type: "delivery",
    },
    {
      id: 2,
      name: "Mesa / Balcão",
      category: "Consumo Presencial",
      value: "R$ 45.300",
      percentage: "-4%",
      isPositive: false,
      bg: "#e8f0fe",
      iconColor: "#4285f4",
      type: "local",
    },
    {
      id: 3,
      name: "Retirada (Takeaway)",
      category: "Pedidos para Levar",
      value: "R$ 20.700",
      percentage: "+25%",
      isPositive: true,
      bg: "#fff8e1",
      iconColor: "#ffb300",
      type: "takeaway",
    },
  ]);

  const [recentTransactions, setRecentTransactions] = useState([
    { id: "#1024", name: "Lucas Silva", price: "R$ 120,00", status: "Pix (Aprovado)", isPositive: true },
    { id: "#1023", name: "Maria Oliveira", price: "R$ 85,50", status: "Crédito", isPositive: true },
    { id: "#1022", name: "João Santos", price: "R$ 42,00", status: "Estornado", isPositive: false },
    { id: "#1021", name: "Ana Costa", price: "R$ 190,00", status: "Pix (Aprovado)", isPositive: true },
    { id: "#1020", name: "Carlos Souza", price: "R$ 67,00", status: "Cancelado", isPositive: false },
  ]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });

    socket.connect();

    socket.on("transactions_update", (data) => {
      if (data.metrics) setMetrics(data.metrics);
      if (data.yearlyData) setYearlyData(data.yearlyData);
      if (data.monthlyRevenueData) setMonthlyRevenueData(data.monthlyRevenueData);
    });

    const interval = setInterval(() => {
      setMonthlyRevenueData((prev) =>
        prev.map((item) =>
          item.year === "Jun"
            ? { ...item, revenue: item.revenue + Math.floor(Math.random() * 500 - 200) }
            : item
        )
      );
    }, 4000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  return { metrics, yearlyData, monthlyRevenueData, channelsData, recentTransactions };
}