import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RedefinirSenha.css";

export default function RedefinirSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você integraria a lógica de envio de e-mail de recuperação
    setEnviado(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Redefinir Senha</h2>
        {!enviado ? (
          <form onSubmit={handleSubmit}>
            <p className="auth-description">
              Digite seu e-mail cadastrado e enviaremos instruções para você redefinir sua senha.
            </p>
            <div className="input-group">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <button type="submit" className="auth-btn">Enviar Instruções</button>
          </form>
        ) : (
          <div className="success-message">
            <p>E-mail enviado com sucesso! Verifique sua caixa de entrada.</p>
            <button onClick={() => navigate("/login")} className="auth-btn">
              Voltar para o Login
            </button>
          </div>
        )}
        <div className="auth-footer">
          <Link to="/login">Lembrou a senha? Faça login</Link>
        </div>
      </div>
    </div>
  );
}