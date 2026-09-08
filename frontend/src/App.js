import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './apps/web/pages/landing/Landing';
import CadastroCliente from './apps/web/pages/Cliente/CadastroCliente/CadastroCliente';
import LoginCliente from './apps/web/pages/Cliente/LoginCliente/LoginCliente';
import Home from './apps/web/pages/Cliente/Homepage/Homepage';
import Cart from './apps/web/pages/Cliente/Carrinho/Carrinho';
import Sobre from './apps/web/pages/Sobre/Sobre';

import Pagamento from './apps/web/pages/Cliente/Pagamento/Pagamento';
import Cardapio from './apps/web/pages/Empresa/Dashboards/Cardapio/Cardapio';
import Pedidos from './apps/web/pages/Empresa/Dashboards/Pedidos/Pedidos';
import Relatorios from './apps/web/pages/Empresa/Dashboards/Relatorios/Relatorios';
import Transacoes from './apps/web/pages/Empresa/Dashboards/Transacoes/Transacoes';
import Estoque from './apps/web/pages/Empresa/Dashboards/Estoque/Estoque';
import Seguranca from './apps/web/pages/Empresa/Dashboards/Seguranca/Seguranca';
import Clientes from './apps/web/pages/Empresa/Dashboards/Clientes/Clientes';
import Geral from './apps/web/pages/Empresa/Dashboards/Geral/Geral';
import Configuracoes from './apps/web/pages/Empresa/Dashboards/Configuracoes/Configuracoes';
import RedefinirSenha from "./apps/web/pages/Cliente/RedefinirSenha/RedefinirSenha";


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
        
        {/* Rotas novas para os botões do menu */}
        <Route path="/restaurantes" element={<Home />} /> {/* Ajuste para a página correta se houver */}
        <Route path="/favoritos" element={<Home />} />     {/* Ajuste para a página correta se houver */}

        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/seguranca" element={<Seguranca />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/dashboard" element={<Geral />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;