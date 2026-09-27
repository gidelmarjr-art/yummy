// Configuracoes.jsx
import React, { useState } from "react";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import TopHeader from "../../../../components/TopHeader/TopHeader";
import { FaBell, FaMotorcycle, FaSave } from "react-icons/fa";
import "./Configuracoes.css";

export default function Configuracoes() {
  const [config, setConfig] = useState({
    taxaEntregaPadrao: "5.00",
    tempoPreparoMinutos: "40",
    aceitaPixAuto: true,
    aceitaCartaoEntrega: true,
    alertaEstoqueMinimo: true,
    alertaSonsPedidos: true,
    impressaoAutomatica: false,
  });

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const handleToggle = (key) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      setMensagem("Configurações do sistema salvas com sucesso!");
    }, 800);
  };

  return (
    <div className="config-page-layout">
      <Sidebar />
      <main className="config-main-content">
        <TopHeader title="Configurações do Sistema" />

        <div className="config-body-content">
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {mensagem && <div className="form-success-msg">{mensagem}</div>}

            {/* Bloco 1: Parâmetros Operacionais */}
            <div className="config-card-container">
              <h3 className="section-title">
                <FaMotorcycle /> Operação de Pedidos e Entregas
              </h3>
              <div className="config-form-grid">
                <div className="config-input-group">
                  <label>Taxa Padrão de Entrega (R$)</label>
                  <input
                    type="number"
                    step="0.50"
                    name="taxaEntregaPadrao"
                    value={config.taxaEntregaPadrao}
                    onChange={handleChange}
                  />
                </div>
                <div className="config-input-group">
                  <label>Tempo Estimado de Preparo (minutos)</label>
                  <input
                    type="number"
                    name="tempoPreparoMinutos"
                    value={config.tempoPreparoMinutos}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Bloco 2: Automação e Notificações */}
            <div className="config-card-container">
              <h3 className="section-title">
                <FaBell /> Alertas & Automação de Pedidos
              </h3>
              <div className="config-toggle-list">
                <div className="config-toggle-item">
                  <div className="toggle-info">
                    <h4>Alerta de Estoque Mínimo</h4>
                    <p>Notificar no painel superior quando um insumo estiver acabando.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={config.alertaEstoqueMinimo}
                      onChange={() => handleToggle("alertaEstoqueMinimo")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="config-toggle-item">
                  <div className="toggle-info">
                    <h4>Som de Alerta para Novos Pedidos</h4>
                    <p>Tocar um aviso sonoro quando um pedido for recebido no sistema.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={config.alertaSonsPedidos}
                      onChange={() => handleToggle("alertaSonsPedidos")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="config-toggle-item">
                  <div className="toggle-info">
                    <h4>Impressão Automática na Cozinha</h4>
                    <p>Enviar comanda direto para a impressora assim que aceitar o pedido.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={config.impressaoAutomatica}
                      onChange={() => handleToggle("impressaoAutomatica")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="config-actions-wrapper">
              <button type="submit" className="save-config-btn" disabled={salvando}>
                <FaSave /> {salvando ? "Salvando..." : "Salvar Configurações"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}