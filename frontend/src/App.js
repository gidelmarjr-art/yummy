import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './apps/web/pages/landing/Landing';
import CadastroCliente from './apps/web/pages/Cliente/CadastroCliente/CadastroCliente';
import LoginCliente from './apps/web/pages/Cliente/LoginCliente/LoginCliente';
import Home from './apps/web/pages/Cliente/Homepage/Homepage';
import Cart from './apps/web/pages/Cliente/Carrinho/Carrinho';
import Sobre from './apps/web/pages/Sobre/Sobre';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cadastro" element={<CadastroCliente />} />
        <Route path="/login" element={<LoginCliente />} />
        <Route path="/home" element={<Home />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/Sobre" element={<Sobre />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
