import React, { useState } from "react";
import { FaCog, FaBell, FaLock, FaShieldAlt } from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import "./Seguranca.css";

export default function Seguranca() {
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome (Windows 10)", location: "Brasília, DF • Dispositivo Atual", active: true },
    { id: 2, device: "App Mobile (iOS)", location: "Brasília, DF • Há 2 horas", active: false }
  ]);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    alert("Senha alterada com sucesso!");
    setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleRevoke = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
    alert("Sessão encerrada com sucesso.");
  };

  return (
    <div className="seguranca-page-layout">
      <Sidebar />

      <main className="seguranca-main-content">
        <header className="seguranca-top-bar">
          <h1 className="page-heading">Segurança e Acessos</h1>

          <div className="top-bar-right">
            <button className="action-circle-btn"><FaCog /></button>
            <button className="action-circle-btn"><FaBell /></button>
            <div className="user-profile-avatar">
              <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="seguranca-dashboard-body">
          <div className="security-grid">
            <div className="security-card">
              <h3><FaLock /> Alterar Senha de Acesso</h3>
              <form onSubmit={handlePasswordChange} className="security-form">
                <div className="form-group">
                  <label>Senha Atual</label>
                  <input
                    type="password"
                    value={passData.currentPassword}
                    onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nova Senha</label>
                  <input
                    type="password"
                    value={passData.newPassword}
                    onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={passData.confirmPassword}
                    onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-save-security">Atualizar Senha</button>
              </form>
            </div>

            <div className="security-card">
              <h3><FaShieldAlt /> Sessões Ativas</h3>
              <div className="sessions-list">
                {sessions.map((session) => (
                  <div key={session.id} className="session-item">
                    <div className="session-info">
                      <span className="session-device">{session.device}</span>
                      <span className="session-location">{session.location}</span>
                    </div>
                    {session.active ? (
                      <span className="status-pill status-ativa">Ativa</span>
                    ) : (
                      <button className="btn-revoke" onClick={() => handleRevoke(session.id)}>Desconectar</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}