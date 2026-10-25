import React, { useEffect, useState } from "react";
import { FaUser, FaEye, FaTimes } from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import TopHeader from "../../../../components/TopHeader/TopHeader";
import { getClientes } from "../../../../services/api";
import "../dashboards-shared.css";
import "./Clientes.css";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch((err) => setErro(err.detail || err.message))
      .finally(() => setCarregando(false));
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const filteredClientes = clientes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={`clientes-page-layout ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="clientes-main-content">
        <TopHeader
          title="Gestão de Clientes"
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="clientes-dashboard-body">
          {erro && <p className="dashboard-error-msg">{erro}</p>}
          <div className="clientes-table-container">
            {/* Linha superior interna com a barra de pesquisa integrada */}
            <div className="clientes-controls-top-row">
              <h3 className="section-subtitle">
                Lista de Clientes Cadastrados
              </h3>
              <div className="search-box inline-search">
                <input
                  type="text"
                  placeholder="Buscar cliente, tel ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="clientes-items-list">
              {carregando ? (
                <p className="dashboard-loading-msg">Carregando clientes…</p>
              ) : filteredClientes.length > 0 ? (
                filteredClientes.map((cliente) => (
                  <div key={cliente.id} className="cliente-row-item">
                    <div className="cliente-icon">
                      <FaUser />
                    </div>
                    <div className="cliente-name-col">
                      <strong className="cliente-name">{cliente.name}</strong>
                      <span className="cliente-email">{cliente.email}</span>
                    </div>

                    <span className="cliente-phone">{cliente.phone}</span>
                    <span className="cliente-orders">
                      {cliente.ordersCount} Pedidos Realizados
                    </span>

                    <div>
                      <button
                        className="btn-view-details"
                        onClick={() => setSelectedClient(cliente)}
                      >
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
              <button
                className="btn-close-modal"
                onClick={() => setSelectedClient(null)}
              >
                <FaTimes />
              </button>
            </div>
            <p>
              <strong>Nome:</strong> {selectedClient.name}
            </p>
            <p>
              <strong>E-mail:</strong> {selectedClient.email}
            </p>
            <p>
              <strong>Telefone:</strong> {selectedClient.phone}
            </p>
            <p>
              <strong>Histórico:</strong> {selectedClient.ordersCount} pedidos
              cadastrados no sistema.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel-modal"
                onClick={() => setSelectedClient(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
