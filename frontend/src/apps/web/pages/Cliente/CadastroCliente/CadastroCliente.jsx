import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gsap } from "gsap";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Zap,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import "./CadastroCliente.css";

import logoIcone from "../../../../../imgs/LogoYummy.png";

const SELOS_SEGURANCA = ["DADOS_CRIPTOGRAFADOS", "SENHA_COM_HASH", "LGPD_COMPLIANT"];

const BENEFICIOS = [
  {
    icon: <Zap size={18} />,
    titulo: "Cadastro em 2 minutos",
    texto: "Só o essencial, sem burocracia.",
  },
  {
    icon: <MapPin size={18} />,
    titulo: "Endereço salvo",
    texto: "Peça de novo sem redigitar nada.",
  },
  {
    icon: <ShieldCheck size={18} />,
    titulo: "Dados protegidos (LGPD)",
    texto: "Senha com hash, conexão criptografada.",
  },
];

export default function CadastroCliente() {
  const rootRef = useRef(null);
  const ticketRef = useRef(null);
  const navigate = useNavigate();

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const [formData, setFormData] = useState({
    nome_completo: "",
    usuario: "",
    telefone: "",
    cpf: "",
    endereco: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro(null);

    if (formData.senha !== formData.confirmarSenha) {
      setErro({
        codigo: "ERR_SENHA_DIVERGENTE",
        mensagem: "As senhas não coincidem.",
      });
      return;
    }

    setCarregando(true);
    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "https://yummy-ms7e.onrender.com";

      await axios.post(`${API_URL}/auth/cadastrar`, {
        usuario: formData.usuario,
        senha: formData.senha,
        nome_completo: formData.nome_completo,
        telefone: formData.telefone,
        cpf: formData.cpf,
        endereco: formData.endereco,
      });

      navigate("/login");
    } catch (err) {
      setErro({
        codigo: "ERR_CADASTRO",
        mensagem:
          err.response?.data?.detail ||
          "Erro ao realizar cadastro. Verifique os dados.",
      });
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".cadastro-page__back", { opacity: 0, y: -10, duration: 0.5 })
        .from(
          ".cadastro-page__eyebrow",
          { opacity: 0, y: 16, duration: 0.6 },
          "-=0.2",
        )
        .from(
          ".cadastro-page__title-line",
          { opacity: 0, y: 32, stagger: 0.1, duration: 0.8 },
          "-=0.3",
        )
        .from(
          ".cadastro-page__sub",
          { opacity: 0, y: 16, duration: 0.6 },
          "-=0.4",
        )
        .from(
          ".cadastro-page__benefit",
          { opacity: 0, x: -16, stagger: 0.08, duration: 0.5 },
          "-=0.3",
        )
        .from(
          ".cadastro-page__chip",
          { opacity: 0, y: 8, stagger: 0.05, duration: 0.4 },
          "-=0.3",
        )
        .from(
          ticketRef.current,
          { opacity: 0, x: 60, rotate: 8, duration: 0.9 },
          "-=0.6",
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="cadastro-page" ref={rootRef}>
      <Link to="/" className="cadastro-page__back">
        <ArrowLeft size={16} /> Início
      </Link>

      <div className="cadastro-page__layout">
        <div className="cadastro-page__info">
          <span className="cadastro-page__logo">
            Yummy<span className="cadastro-page__logo-dot">.</span>
          </span>

          <p className="cadastro-page__eyebrow">Nova conta</p>

          <h1 className="cadastro-page__title">
            <span className="cadastro-page__title-line">
              Sua próxima refeição,
            </span>
            <span className="cadastro-page__title-line cadastro-page__title-line--em">
              a um pedido de distância.
            </span>
          </h1>

          <p className="cadastro-page__sub">
            Crie sua conta Yummy e peça em segundos, com endereço salvo e
            acompanhamento em tempo real do primeiro toque no cardápio até a
            entrega.
          </p>

          <div className="cadastro-page__benefits">
            {BENEFICIOS.map((b) => (
              <div className="cadastro-page__benefit" key={b.titulo}>
                <span className="cadastro-page__benefit-icon">{b.icon}</span>
                <div>
                  <h3>{b.titulo}</h3>
                  <p>{b.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cadastro-page__chips">
            {SELOS_SEGURANCA.map((s) => (
              <code className="cadastro-page__chip" key={s}>
                {s}
              </code>
            ))}
          </div>
        </div>

        <div className="cadastro-page__ticket" ref={ticketRef}>
          <div className="cadastro-page__ticket-head">
            <img
              src={logoIcone}
              alt="Yummy"
              className="cadastro-page__ticket-logo"
            />
            <h2>Criar conta</h2>
          </div>

          <div className="cadastro-page__ticket-punch cadastro-page__ticket-punch--left" />
          <div className="cadastro-page__ticket-punch cadastro-page__ticket-punch--right" />

          {erro && (
            <div className="cadastro-page__error" role="alert">
              <code className="cadastro-page__error-code">{erro.codigo}</code>
              <p className="cadastro-page__error-msg">{erro.mensagem}</p>
            </div>
          )}

          <form className="cadastro-page__form" onSubmit={handleCadastro}>
            <div className="cadastro-page__field">
              <label htmlFor="cad-nome">Nome completo</label>
              <input
                id="cad-nome"
                type="text"
                name="nome_completo"
                placeholder="Seu nome"
                value={formData.nome_completo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cadastro-page__field">
              <label htmlFor="cad-email">E-mail</label>
              <input
                id="cad-email"
                type="email"
                name="usuario"
                placeholder="seu@email.com"
                value={formData.usuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cadastro-page__row">
              <div className="cadastro-page__field">
                <label htmlFor="cad-telefone">Telefone</label>
                <input
                  id="cad-telefone"
                  type="tel"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cadastro-page__field">
                <label htmlFor="cad-cpf">CPF</label>
                <input
                  id="cad-cpf"
                  type="text"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="cadastro-page__field">
              <label htmlFor="cad-endereco">Endereço</label>
              <input
                id="cad-endereco"
                type="text"
                name="endereco"
                placeholder="Rua, número, bairro"
                value={formData.endereco}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cadastro-page__row">
              <div className="cadastro-page__field">
                <label htmlFor="cad-senha">Senha</label>
                <div className="cadastro-page__password">
                  <input
                    id="cad-senha"
                    type={showSenha ? "text" : "password"}
                    name="senha"
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="cadastro-page__toggle-password"
                    onClick={() => setShowSenha((v) => !v)}
                    aria-label={showSenha ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="cadastro-page__field">
                <label htmlFor="cad-confirmar">Confirmar senha</label>
                <div className="cadastro-page__password">
                  <input
                    id="cad-confirmar"
                    type={showConfirmarSenha ? "text" : "password"}
                    name="confirmarSenha"
                    placeholder="••••••••"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="cadastro-page__toggle-password"
                    onClick={() => setShowConfirmarSenha((v) => !v)}
                    aria-label={
                      showConfirmarSenha ? "Esconder senha" : "Mostrar senha"
                    }
                  >
                    {showConfirmarSenha ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <label className="cadastro-page__consent">
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={(e) => setAceitouTermos(e.target.checked)}
                required
              />
              <span>
                Li e aceito os Termos de Uso e a{" "}
                <Link to="/privacidade" target="_blank" rel="noopener noreferrer">
                  Política de Privacidade (LGPD)
                </Link>
              </span>
            </label>

            <button
              type="submit"
              className="cadastro-page__submit"
              disabled={carregando}
            >
              {carregando ? "Cadastrando..." : "Criar conta"}
            </button>

            <p className="cadastro-page__footer">
              Já tem conta? <Link to="/login">Entrar</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}