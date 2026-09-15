import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe o CartProvider do local correto onde ele está salvo
import { CartProvider } from './context/CartContext'; 

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
import CadastroPratos from './apps/web/pages/Empresa/Dashboards/Cadastro_Pratos/Cadastro_Pratos';
import RedefinirSenha from "./apps/web/pages/Cliente/RedefinirSenha/RedefinirSenha";
import Privacidade from "./apps/web/pages/Privacidade/Privacidade";
import MenuCaroussel from './apps/web/pages/Cliente/MenuCarrossel/MenuCarrossel';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cadastro" element={<CadastroCliente />} />
          <Route path="/login" element={<LoginCliente />} />
          <Route path="/home" element={<Home />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/Sobre" element={<Sobre />} />
          
          <Route path="/restaurantes" element={<Home />} />
          <Route path="/favoritos" element={<Home />} />  

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
          <Route path="/cadastro-pratos" element={<CadastroPratos />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/menu-carousel" element={<MenuCaroussel />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;