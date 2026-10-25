// PerfilLoja.jsx
import React, { useState } from "react";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import TopHeader from "../../../../components/TopHeader/TopHeader";
import { FaStore, FaSave, FaCamera } from "react-icons/fa";
import "../dashboards-shared.css";
import "./PerfilLoja.css";

export default function PerfilLoja() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [storeProfile, setStoreProfile] = useState({
    storeName: "Codó Burger",
    phone: "(61) 99876-5432",
    email: "contato@yummyburger.com.br",
    address: "Setor leste, quadra 42, lote 01, Codó - MA",
    description:
      "A melhor hamburgueria artesanal da cidade, focada em ingredientes selecionados e entrega rápida.",
    openingHours: "18:00 - 23:30",
    bannerUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000",
  });

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSalvando(true);
    setTimeout(() => {
      setSalvando(false);
      setMensagem("Perfil da loja atualizado com sucesso!");
    }, 1000);
  };

  return (
    <div className={`page-layout ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="main-content">
        <TopHeader
          title="Perfil da Loja"
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="page-body">
          <form onSubmit={handleSave} className="profile-container">
            {mensagem && <div className="form-success-msg">{mensagem}</div>}

            {/* Banner e Foto da Loja com animação indexada */}
            <div className="profile-card banner-card" style={{ "--i": 0 }}>
              <div
                className="store-banner"
                style={{ backgroundImage: `url(${storeProfile.bannerUrl})` }}
              >
                <button type="button" className="edit-banner-btn">
                  <FaCamera /> Alterar Capa
                </button>
              </div>
              <div className="store-avatar-wrapper">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                  alt="Logo"
                />
                <button type="button" className="edit-avatar-btn">
                  <FaCamera />
                </button>
              </div>
            </div>

            {/* Formulário de Dados da Loja com animação indexada */}
            <div className="profile-card" style={{ "--i": 1 }}>
              <h3 className="section-title">
                <FaStore /> Dados Visíveis ao Cliente
              </h3>

              <div className="form-grid">
                <div className="input-group">
                  <label>Nome Comercial</label>
                  <input
                    type="text"
                    name="storeName"
                    value={storeProfile.storeName}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Telefone / WhatsApp</label>
                  <input
                    type="text"
                    name="phone"
                    value={storeProfile.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>E-mail da Loja</label>
                  <input
                    type="email"
                    name="email"
                    value={storeProfile.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Horário de Funcionamento</label>
                  <input
                    type="text"
                    name="openingHours"
                    value={storeProfile.openingHours}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group full-width">
                  <label>Endereço Físico</label>
                  <input
                    type="text"
                    name="address"
                    value={storeProfile.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group full-width">
                  <label>Bio / Descrição do Estabelecimento</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={storeProfile.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="actions-wrapper" style={{ "--i": 2 }}>
              <button type="submit" className="save-btn" disabled={salvando}>
                <FaSave /> {salvando ? "Salvando..." : "Salvar Perfil"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
