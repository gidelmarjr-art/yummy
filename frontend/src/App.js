import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importe o CartProvider do local correto onde ele está salvo
import { CartProvider } from './context/CartContext'; 

import LandingPage from './apps/web/pages/landing/Landing';
import Cadastro from './apps/web/pages/Cadastro/Cadastro';
import Login from './apps/web/pages/Login/Login';
import Home from './apps/web/pages/Cliente/Homepage/Homepage';
import Cart from './apps/web/pages/Cliente/Carrinho/Carrinho';
import Sobre from './apps/web/pages/Sobre/Sobre';
import RedefinirSenha from "./apps/web/pages/RedefinirSenha/RedefinirSenha";

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

import Privacidade from "./apps/web/pages/Privacidade/Privacidade";
import MenuCaroussel from './apps/web/pages/Cliente/MenuCarrossel/MenuCarrossel';
import MapaNavegacao from './apps/web/pages/Mapa/MapaNavegacao';
import AcompanharEntrega from './apps/web/pages/Cliente/AcompanharEntrega/AcompanharEntrega';
import PerfilResumo from './apps/web/pages/Cliente/Perfil/Resumo/Resumo';
import DadosPessoais from './apps/web/pages/Cliente/Perfil/DadosPessoais/DadosPessoais';
import Enderecos from './apps/web/pages/Cliente/Perfil/Enderecos/Enderecos';
import MeusPedidos from './apps/web/pages/Cliente/Perfil/MeusPedidos/MeusPedidos';
import Favoritos from './apps/web/pages/Cliente/Perfil/Favoritos/Favoritos';
import PagamentosPerfil from './apps/web/pages/Cliente/Perfil/Pagamentos/Pagamentos';
import SegurancaPerfil from './apps/web/pages/Cliente/Perfil/Seguranca/Seguranca';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/Sobre" element={<Sobre />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          
          <Route path="/restaurantes" element={<Home />} />
          <Route path="/favoritos" element={<Home />} />  

          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/acompanhar-entrega" element={<AcompanharEntrega />} />
          <Route path="/perfil" element={<PerfilResumo />} />
          <Route path="/perfil/dados-pessoais" element={<DadosPessoais />} />
          <Route path="/perfil/enderecos" element={<Enderecos />} />
          <Route path="/perfil/pedidos" element={<MeusPedidos />} />
          <Route path="/perfil/favoritos" element={<Favoritos />} />
          <Route path="/perfil/pagamentos" element={<PagamentosPerfil />} />
          <Route path="/perfil/seguranca" element={<SegurancaPerfil />} />
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
          
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/menu-carousel" element={<MenuCaroussel />} />
          <Route path="/mapa-navegacao" element={<MapaNavegacao />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
