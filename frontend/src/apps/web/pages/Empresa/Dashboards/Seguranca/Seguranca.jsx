import React, { useEffect, useState } from "react";
import { FaCog, FaBell, FaLock, FaShieldAlt } from "react-icons/fa";
import Sidebar from "../../../../components/Sidebar/Siderbar";
import { alterarSenha, getSessoes, revogarSessao } from "../../../../services/api";
import "../dashboards-shared.css";
import "./Seguranca.css";

export default function Seguranca() {
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [mensagemSenha, setMensagemSenha] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [carregandoSessoes, setCarregandoSessoes] = useState(true);
  const [erroSessoes, setErroSessoes] = useState(null);

  useEffect(() => {
    getSessoes()
      .then(setSessions)
      .catch((err) => setErroSessoes(err.detail || err.message))
      .finally(() => setCarregandoSessoes(false));
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMensagemSenha(null);
    if (passData.newPassword !== passData.confirmPassword) {
      setMensagemSenha({ tipo: "erro", texto: "As senhas não coincidem!" });
      return;
    }
    setSalvandoSenha(true);
    try {
      await alterarSenha(passData.currentPassword, passData.newPassword);
      setMensagemSenha({ tipo: "sucesso", texto: "Senha alterada com sucesso!" });
      setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMensagemSenha({ tipo: "erro", texto: err.detail || "Não foi possível alterar a senha." });
    } finally {
      setSalvandoSenha(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await revogarSessao(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.detail || "Não foi possível encerrar a sessão.");
    }
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

              {mensagemSenha && (
                <p className={mensagemSenha.tipo === "erro" ? "form-error-msg" : "form-success-msg"}>
                  {mensagemSenha.texto}
                </p>
              )}

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
                <button type="submit" className="btn-save-security" disabled={salvandoSenha}>
                  {salvandoSenha ? "Atualizando…" : "Atualizar Senha"}
                </button>
              </form>
            </div>

            <div className="security-card">
              <h3><FaShieldAlt /> Sessões Ativas</h3>
              {erroSessoes && <p className="dashboard-error-msg">{erroSessoes}</p>}
              <div className="sessions-list">
                {carregandoSessoes ? (
                  <p className="dashboard-loading-msg">Carregando sessões…</p>
                ) : sessions.length === 0 ? (
                  <p className="dashboard-empty-msg">Nenhuma sessão ativa.</p>
                ) : (
                  sessions.map((session) => (
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
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
