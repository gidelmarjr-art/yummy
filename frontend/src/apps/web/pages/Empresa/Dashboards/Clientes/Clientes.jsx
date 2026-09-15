import React, { useEffect, useState } from "react";
import { FaSearch, FaCog, FaBell, FaUser, FaEye, FaTimes } from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import { getClientes } from "../../../../services/api";
import "../dashboards-shared.css";
import "./Clientes.css";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch((err) => setErro(err.detail || err.message))
      .finally(() => setCarregando(false));
  }, []);

  const filteredClientes = clientes.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clientes-page-layout">
      <Sidebar />

      <main className="clientes-main-content">
        <header className="clientes-top-bar">
          <h1 className="page-heading">Gestão de Clientes</h1>

          <div className="top-bar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar cliente, tel ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="action-circle-btn"><FaCog /></button>
            <button className="action-circle-btn"><FaBell /></button>
            <div className="user-profile-avatar">
              <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="clientes-dashboard-body">
          {erro && <p className="dashboard-error-msg">{erro}</p>}
          <div className="clientes-table-container">
            <div className="clientes-items-list">
              {carregando ? (
                <p className="dashboard-loading-msg">Carregando clientes…</p>
              ) : filteredClientes.length > 0 ? (
                filteredClientes.map((cliente) => (
                  <div key={cliente.id} className="cliente-row-item">
                    <div className="cliente-icon"><FaUser /></div>
                    <div className="cliente-name-col">
                      <strong className="cliente-name">{cliente.name}</strong>
                      <span className="cliente-email">{cliente.email}</span>
                    </div>

                    <span className="cliente-phone">{cliente.phone}</span>
                    <span className="cliente-orders">{cliente.ordersCount} Pedidos Realizados</span>

                    <div>
                      <button className="btn-view-details" onClick={() => setSelectedClient(cliente)}>
                        <FaEye /> Perfil
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-msg">Nenhum cliente encontrado.</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedClient && (
        <div className="clientes-modal-overlay">
          <div className="clientes-modal-card">
            <div className="modal-header">
              <h2>Detalhes do Cliente</h2>
              <button className="btn-close-modal" onClick={() => setSelectedClient(null)}><FaTimes /></button>
            </div>
            <p><strong>Nome:</strong> {selectedClient.name}</p>
            <p><strong>E-mail:</strong> {selectedClient.email}</p>
            <p><strong>Telefone:</strong> {selectedClient.phone}</p>
            <p><strong>Histórico:</strong> {selectedClient.ordersCount} pedidos cadastrados no sistema.</p>
            <div className="modal-actions">
              <button className="btn-cancel-modal" onClick={() => setSelectedClient(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}