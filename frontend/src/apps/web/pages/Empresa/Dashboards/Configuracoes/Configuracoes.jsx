import React, { useState } from "react";
import {
  FaSearch,
  FaCog,
  FaBell,
  FaStore,
  FaBellSlash,
  FaShieldAlt,
  FaSave
} from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import "./Configuracoes.css";

export default function Configuracoes() {
  const [storeData, setStoreData] = useState({
    storeName: "Yummy Lanches & Sorvetes",
    phone: "(61) 99888-7766",
    email: "contato@yummy.com",
    address: "Quadra Central, Comércio Local, Gama - DF",
    taxRate: "5%"
  });

  const [notifications, setNotifications] = useState({
    newOrdersAlert: true,
    emailReports: false,
    soundAlerts: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="config-page-layout">
      <Sidebar />

      <main className="config-main-content">
        {/* Header Superior */}
        <header className="config-top-bar">
          <h1 className="page-heading">Configurações</h1>

          <div className="top-bar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Pesquisar..." />
            </div>

            <button className="action-circle-btn" aria-label="Configurações">
              <FaCog />
            </button>
            <button className="action-circle-btn" aria-label="Notificações">
              <FaBell />
            </button>

            <div className="user-profile-avatar">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                alt="Avatar"
              />
            </div>
          </div>
        </header>

        {/* Corpo Laranja */}
        <div className="config-body-content">
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Informações da Loja */}
            <div className="config-card-container">
              <h3 className="section-title">
                <FaStore style={{ color: "#ff5500" }} /> Informações do Estabelecimento
              </h3>
              
              <div className="config-form-grid">
                <div className="config-input-group">
                  <label>Nome do Estabelecimento</label>
                  <input
                    type="text"
                    name="storeName"
                    value={storeData.storeName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="config-input-group">
                  <label>Telefone / WhatsApp</label>
                  <input
                    type="text"
                    name="phone"
                    value={storeData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="config-input-group">
                  <label>E-mail de Contato</label>
                  <input
                    type="email"
                    name="email"
                    value={storeData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="config-input-group">
                  <label>Taxa de Serviço / Padrão</label>
                  <input
                    type="text"
                    name="taxRate"
                    value={storeData.taxRate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="config-input-group full-width">
                  <label>Endereço Completo</label>
                  <input
                    type="text"
                    name="address"
                    value={storeData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Preferências de Notificação */}
            <div className="config-card-container">
              <h3 className="section-title">
                <FaBell style={{ color: "#ff5500" }} /> Preferências de Alertas e Notificações
              </h3>

              <div className="config-toggle-list">
                <div className="config-toggle-item">
                  <div className="toggle-info">
                    <h4>Alertas de Novos Pedidos</h4>
                    <p>Receber avisos visuais e sonoros na tela assim que um cliente fechar um pedido.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.newOrdersAlert}
                      onChange={() => handleToggle("newOrdersAlert")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="config-toggle-item">
                  <div className="toggle-info">
                    <h4>Relatórios por E-mail</h4>
                    <p>Enviar um resumo consolidado de faturamento ao final de cada dia útil.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.emailReports}
                      onChange={() => handleToggle("emailReports")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="config-toggle-item">
                  <div className="toggle-info">
                    <h4>Sons de Notificação</h4>
                    <p>Reproduzir alerta sonoro em alteração de status e chamados.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.soundAlerts}
                      onChange={() => handleToggle("soundAlerts")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="config-actions-wrapper">
              <button type="submit" className="save-config-btn">
                <FaSave style={{ marginRight: "8px" }} /> Salvar Alterações
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}