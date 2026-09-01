import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Store,
  ShoppingCart,
  Bike,
  LayoutDashboard,
  ShieldCheck,
  User,
} from "lucide-react";
import "./Sobre.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Conteúdo                                                           */
/* ------------------------------------------------------------------ */

const NUMEROS = [
  { valor: "500+", label: "Restaurantes" },
  { valor: "50k+", label: "Pedidos" },
  { valor: "30min", label: "Entrega média" },
];

const COMO_FUNCIONA = [
  {
    icon: <Store size={24} />,
    titulo: "Restaurante cadastra o cardápio",
    desc: "Pratos, preços e disponibilidade ficam sempre atualizados.",
  },
  {
    icon: <ShoppingCart size={24} />,
    titulo: "Cliente faz o pedido",
    desc: "Pelo app ou pelo QR Code da mesa, em poucos toques.",
  },
  {
    icon: <Bike size={24} />,
    titulo: "Pedido é gerenciado e entregue",
    desc: "Cozinha, salão e entregador acompanham tudo em tempo real.",
  },
];

const DIFERENCIAIS = [
  {
    icon: <LayoutDashboard size={28} />,
    titulo: "Gestão centralizada",
    texto: "Todos os pedidos, de todos os canais, num único painel.",
  },
  {
    icon: <ShieldCheck size={28} />,
    titulo: "Taxas justas",
    texto: "Transparência total no valor repassado ao restaurante.",
  },
];

const EQUIPE = [
  { nome: "Equipe de Produto" },
  { nome: "Equipe de Operações" },
  { nome: "Equipe de Tecnologia" },
];

/* ------------------------------------------------------------------ */
/* Componente                                                         */
/* ------------------------------------------------------------------ */

export default function SobrePage() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-hero__eyebrow, .about-hero h1, .about-hero p", {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.utils.toArray(".stat-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          delay: i * 0.08,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray(".step-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 28,
          duration: 0.6,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.from(".diff-card", {
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.7,
        scrollTrigger: {
          trigger: ".diffs__grid",
          start: "top 85%",
        },
      });

      gsap.from(".team-card", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
          trigger: ".team__grid",
          start: "top 88%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="yummy-lp sobre-page" ref={root}>
      {/* ---------------- NAV ---------------- */}
      <header className="nav">
        <div className="nav__inner">
          <Link to="/" className="nav__logo">
            Yummy<span className="dot">.</span>
          </Link>
          <nav className="nav__links">
            <Link to="/">Início</Link>
            <Link to="/sobre" className="nav__links--active">Sobre nós</Link>
          </nav>
          <a href="mailto:contato@yummy.app" className="btn btn--ghost">
            Falar com o time
          </a>
        </div>
      </header>

      {/* ---------------- HERO / MISSÃO ---------------- */}
      <section className="about-hero">
        <div className="section__head">
          <p className="eyebrow about-hero__eyebrow">Sobre nós</p>
          <h1>Conectando restaurantes e clientes com simplicidade.</h1>
          <p className="section__lede">
            Nosso propósito é aproximar clientes e estabelecimentos, tornando
            o atendimento mais simples e ágil, esteja o cliente onde estiver.
            Acreditamos que fazer um pedido — seja no restaurante ou por
            delivery — deve ser rápido, claro e sem complicações, e que os
            funcionários devem ter total visibilidade e controle sobre cada
            solicitação que recebem.
          </p>
        </div>
      </section>

      {/* ---------------- NÚMEROS ---------------- */}
      <section className="stats">
        <div className="section__head">
          <p className="eyebrow">Em números</p>
          <h2>O Yummy em movimento.</h2>
        </div>

        <div className="stats__grid">
          {NUMEROS.map((n) => (
            <div className="stat-card" key={n.label}>
              <span className="stat-card__valor">{n.valor}</span>
              <span className="stat-card__label">{n.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- COMO FUNCIONA ---------------- */}
      <section className="how">
        <div className="section__head">
          <p className="eyebrow">Como funciona</p>
          <h2>Do cardápio à entrega, num fluxo só.</h2>
        </div>

        <div className="how__grid">
          {COMO_FUNCIONA.map((s, i) => (
            <div className="step-card" key={s.titulo}>
              <span className="step-card__index">{String(i + 1).padStart(2, "0")}</span>
              <span className="step-card__icon">{s.icon}</span>
              <h3>{s.titulo}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- DIFERENCIAIS ---------------- */}
      <section className="diffs">
        <div className="section__head">
          <p className="eyebrow">Diferenciais</p>
          <h2>Por que restaurantes escolhem o Yummy.</h2>
        </div>

        <div className="diffs__grid">
          {DIFERENCIAIS.map((d) => (
            <div className="diff-card" key={d.titulo}>
              <span className="diff-card__icon">{d.icon}</span>
              <h3>{d.titulo}</h3>
              <p>{d.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- NOSSA EQUIPE ---------------- */}
      <section className="team">
        <div className="section__head">
          <p className="eyebrow">Nossa equipe</p>
          <h2>Gente que constrói o Yummy todos os dias.</h2>
        </div>

        <div className="team__panel">
          <div className="team__grid">
            {EQUIPE.map((p) => (
              <div className="team-card" key={p.nome}>
                <span className="team-card__avatar">
                  <User size={32} />
                </span>
                <span className="team-card__nome">{p.nome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="footer">
        <span>Yummy © 2026</span>
        <span>
          <Link to="/">Voltar para o início</Link>
        </span>
      </footer>
    </div>
  );
}
