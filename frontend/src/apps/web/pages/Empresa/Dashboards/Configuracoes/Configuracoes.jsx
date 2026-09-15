import React, { useEffect, useState } from "react";
import { FaSearch, FaCog, FaBell, FaStore, FaSave } from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import { getConfiguracoes, atualizarConfiguracoes } from "../../../../services/api";
import "../dashboards-shared.css";
import "./Configuracoes.css";

export default function Configuracoes() {
  const [storeData, setStoreData] = useState({
    storeName: "",
    phone: "",
    email: "",
    address: "",
    taxRate: "",
  });

  const [notifications, setNotifications] = useState({
    newOrdersAlert: true,
    emailReports: false,
    soundAlerts: true,
  });

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    getConfiguracoes()
      .then((data) => {
        setStoreData({
          storeName: data.nome_loja || "",
          phone: data.telefone || "",
          email: data.email || "",
          address: data.endereco || "",
          taxRate: data.taxa_servico || "",
        });
        setNotifications({
          newOrdersAlert: data.alerta_novos_pedidos,
          emailReports: data.relatorios_email,
          soundAlerts: data.sons_alerta,
        });
      })
      .catch((err) => setMensagem({ tipo: "erro", texto: err.detail || err.message }))
      .finally(() => setCarregando(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem(null);
    try {
      await atualizarConfiguracoes({
        nome_loja: storeData.storeName,
        telefone: storeData.phone,
        email: storeData.email,
        endereco: storeData.address,
        taxa_servico: storeData.taxRate,
        alerta_novos_pedidos: notifications.newOrdersAlert,
        relatorios_email: notifications.emailReports,
        sons_alerta: notifications.soundAlerts,
      });
      setMensagem({ tipo: "sucesso", texto: "Configurações salvas com sucesso!" });
    } catch (err) {
      setMensagem({ tipo: "erro", texto: err.detail || "Não foi possível salvar as configurações." });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="config-page-layout">
      <Sidebar />

      <main className="config-main-content">
        <header className="config-top-bar">
          <h1 className="page-heading">Configurações</h1>

          <div className="top-bar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Pesquisar..." />
            </div>
            <button className="action-circle-btn" aria-label="Configurações"><FaCog /></button>
            <button className="action-circle-btn" aria-label="Notificações"><FaBell /></button>
            <div className="user-profile-avatar">
              <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="config-body-content">
          {carregando ? (
            <p className="dashboard-loading-msg">Carregando configurações…</p>
          ) : (
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {mensagem && (
                <p className={mensagem.tipo === "erro" ? "form-error-msg" : "form-success-msg"}>
                  {mensagem.texto}
                </p>
              )}

              <div className="config-card-container">
                <h3 className="section-title">
                  <FaStore style={{ color: "#ff5500" }} /> Informações do Estabelecimento
                </h3>

                <div className="config-form-grid">
                  <div className="config-input-group">
                    <label>Nome do Estabelecimento</label>
                    <input type="text" name="storeName" value={storeData.storeName} onChange={handleInputChange} />
                  </div>
                  <div className="config-input-group">
                    <label>Telefone / WhatsApp</label>
                    <input type="text" name="phone" value={storeData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="config-input-group">
                    <label>E-mail de Contato</label>
                    <input type="email" name="email" value={storeData.email} onChange={handleInputChange} />
                  </div>
                  <div className="config-input-group">
                    <label>Taxa de Serviço / Padrão</label>
                    <input type="text" name="taxRate" value={storeData.taxRate} onChange={handleInputChange} />
                  </div>
                  <div className="config-input-group full-width">
                    <label>Endereço Completo</label>
                    <input type="text" name="address" value={storeData.address} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

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
                      <input type="checkbox" checked={notifications.newOrdersAlert} onChange={() => handleToggle("newOrdersAlert")} />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="config-toggle-item">
                    <div className="toggle-info">
                      <h4>Relatórios por E-mail</h4>
                      <p>Enviar um resumo consolidado de faturamento ao final de cada dia útil.</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifications.emailReports} onChange={() => handleToggle("emailReports")} />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="config-toggle-item">
                    <div className="toggle-info">
                      <h4>Sons de Notificação</h4>
                      <p>Reproduzir alerta sonoro em alteração de status e chamados.</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifications.soundAlerts} onChange={() => handleToggle("soundAlerts")} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="config-actions-wrapper">
                <button type="submit" className="save-config-btn" disabled={salvando}>
                  <FaSave style={{ marginRight: "8px" }} /> {salvando ? "Salvando…" : "Salvar Alterações"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
