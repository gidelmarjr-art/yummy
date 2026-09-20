import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Guarda de rota: qualquer rota que passar por aqui exige um access_token
// salvo no localStorage — o mesmo que o LoginCliente.jsx grava quando o
// login dá certo. Sem token, manda direto pro /login (então digitar
// "/home" na barra do navegador sem estar logado não entra mais).
//
// Também guarda de onde a pessoa veio (location), pra no futuro dar pra
// mandar ela de volta pra essa mesma página depois que fizer login.
export default function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}