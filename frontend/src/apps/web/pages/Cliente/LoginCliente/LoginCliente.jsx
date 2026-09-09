import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  UtensilsCrossed,
  MapPin,
  Heart,
  ShieldCheck,
} from "lucide-react";
import "./LoginCliente.css";

import logoIcone from "../../../../../imgs/LogoYummy.png";

// Progressão de status de um pedido — reforça a proposta de "tempo real"
// usando o mesmo vocabulário de eventos já usado na Landing.
const STATUS_PEDIDO = ["PEDIDO_CRIADO", "EM_PREPARO", "A_CAMINHO", "ENTREGUE"];

const BENEFICIOS = [
  {
    icon: <UtensilsCrossed size={18} />,
    titulo: "Pedido em tempo real",
    texto: "Acompanhe cada etapa, do preparo à entrega.",
  },
  {
    icon: <MapPin size={18} />,
    titulo: "Endereços salvos",
    texto: "Delivery mais rápido, sem redigitar nada.",
  },
  {
    icon: <Heart size={18} />,
    titulo: "Favoritos e histórico",
    texto: "Peça de novo o que você já amou.",
  },
];

export default function LoginCliente() {
  const rootRef = useRef(null);
  const ticketRef = useRef(null);
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "https://yummy-ms7e.onrender.com";

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      if (!response.ok) {
        setErro({
          codigo: "ERR_LOGIN_FAILED",
          mensagem: "Usuário ou senha incorretos.",
        });
        return;
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      navigate("/home");
    } catch (error) {
      setErro({
        codigo: "ERR_NETWORK",
        mensagem: "Não foi possível conectar ao servidor. Tente novamente.",
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
        .from(".login-page__back", { opacity: 0, y: -10, duration: 0.5 })
        .from(
          ".login-page__eyebrow",
          { opacity: 0, y: 16, duration: 0.6 },
          "-=0.2",
        )
        .from(
          ".login-page__title-line",
          { opacity: 0, y: 32, stagger: 0.1, duration: 0.8 },
          "-=0.3",
        )
        .from(".login-page__sub", { opacity: 0, y: 16, duration: 0.6 }, "-=0.4")
        .from(
          ".login-page__benefit",
          { opacity: 0, x: -16, stagger: 0.08, duration: 0.5 },
          "-=0.3",
        )
        .from(
          ".login-page__chip",
          { opacity: 0, y: 8, stagger: 0.05, duration: 0.4 },
          "-=0.3",
        )
        .from(
          ticketRef.current,
          { opacity: 0, x: 60, rotate: 12, duration: 0.9 },
          "-=0.6",
        );

      gsap.to(ticketRef.current, {
        y: -10,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="login-page" ref={rootRef}>
      <Link to="/" className="login-page__back">
        <ArrowLeft size={16} /> Início
      </Link>

      <div className="login-page__layout">
        <div className="login-page__info">
          <span className="login-page__logo">
            Yummy<span className="login-page__logo-dot">.</span>
          </span>

          <p className="login-page__eyebrow">Acesso do cliente</p>

          <h1 className="login-page__title">
            <span className="login-page__title-line">Seu pedido</span>
            <span className="login-page__title-line login-page__title-line--em">
              não erra o caminho.
            </span>
          </h1>

          <p className="login-page__sub">
            Entre com sua conta Yummy para acompanhar cada pedido em tempo
            real, do primeiro toque no cardápio até a sua mesa — ou a sua
            porta.
          </p>

          <div className="login-page__benefits">
            {BENEFICIOS.map((b) => (
              <div className="login-page__benefit" key={b.titulo}>
                <span className="login-page__benefit-icon">{b.icon}</span>
                <div>
                  <h3>{b.titulo}</h3>
                  <p>{b.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="login-page__chips">
            {STATUS_PEDIDO.map((s) => (
              <code className="login-page__chip" key={s}>
                {s}
              </code>
            ))}
          </div>
        </div>

        <div className="login-page__ticket" ref={ticketRef}>
          <div className="login-page__ticket-head">
            <img
              src={logoIcone}
              alt="Yummy"
              className="login-page__ticket-logo"
            />
            <h2>Entrar</h2>
          </div>

          <div className="login-page__ticket-punch login-page__ticket-punch--left" />
          <div className="login-page__ticket-punch login-page__ticket-punch--right" />

          {erro && (
            <div className="login-page__error" role="alert">
              <code className="login-page__error-code">{erro.codigo}</code>
              <p className="login-page__error-msg">{erro.mensagem}</p>
            </div>
          )}

          <form className="login-page__form" onSubmit={handleLogin}>
            <div className="login-page__field">
              <label htmlFor="login-usuario">Usuário</label>
              <input
                id="login-usuario"
                type="text"
                placeholder="Seu nome de usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="login-page__field">
              <label htmlFor="login-senha">Senha</label>
              <div className="login-page__password">
                <input
                  id="login-senha"
                  type={showSenha ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-page__toggle-password"
                  onClick={() => setShowSenha((v) => !v)}
                  aria-label={showSenha ? "Esconder senha" : "Mostrar senha"}
                >
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-page__row">
              <label className="login-page__remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Lembrar-me
              </label>
              <Link to="/redefinir-senha" className="login-page__forgot">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              className="login-page__submit"
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <p className="login-page__privacy">
              <ShieldCheck size={14} />
              Seus dados são protegidos pela LGPD ·{" "}
              <Link to="/privacidade">Política de Privacidade</Link>
            </p>

            <p className="login-page__footer">
              Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}