import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Smartphone, 
  ChefHat, 
  Package, 
  Banknote, 
  BarChart3, 
  QrCode, 
  ShoppingCart, 
  Flame, 
  Bike, 
  Server, 
  Utensils, 
  Heart 
} from "lucide-react";
import "./landing.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Conteúdo                                                           */
/* ------------------------------------------------------------------ */

const CANAIS = [
  <><Smartphone size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Cliente</>, 
  <><ChefHat size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Garçom</>, 
  <><ChefHat size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> KDS</>, 
  <><Package size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Estoque</>, 
  <><Banknote size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Caixa</>, 
  <><BarChart3 size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Administração</>
];

const ERROS = [
  { code: "ERR_CART_EMPTY", msg: "A comanda se perde no meio do salão." },
  { code: "ERR_STOCK_INSUFFICIENT", msg: "O prato foi vendido, o insumo já tinha acabado." },
  { code: "ERR_CANCEL_DENIED", msg: "O cancelamento chega depois do pedido sair pra cozinha." },
  { code: "ERR_UNAUTHORIZED_ROLE", msg: "Ninguém sabe quem autorizou aquele desconto." },
];

const FLUXO = [
  { icon: <QrCode size={24} />, label: "QR Code", desc: "Cliente escaneia e abre o cardápio na mesa" },
  { icon: <ShoppingCart size={24} />, label: "Pedido", desc: "O carrinho vira comanda em um toque" },
  { icon: <ChefHat size={24} />, label: "KDS", desc: "Cozinha e bar recebem o pedido na hora" },
  { icon: <Flame size={24} />, label: "Preparo", desc: "A ficha técnica dá baixa nos insumos" },
  { icon: <ChefHat size={24} />, label: "Garçom", desc: "É avisado assim que o prato fica pronto" },
  { icon: <Banknote size={24} />, label: "Caixa", desc: "Fecha a conta sem reconciliar nada" },
];

const MODULOS = [
  {
    icon: <Smartphone size={32} />,
    titulo: "Cliente",
    texto: "Cardápio digital por QR Code, sem app para instalar.",
    itens: ["Busca e filtros", "Carrinho e adicionais", "Chamada do garçom", "Pedido em tempo real"],
  },
  {
    icon: <ChefHat size={32} />,
    titulo: "Garçom",
    texto: "Controle total do salão, até quando a conexão falha.",
    itens: ["Abertura de mesas", "Transferência e fechamento", "Cache local offline", "Sync automático"],
  },
  {
    icon: <ChefHat size={32} />,
    titulo: "KDS",
    texto: "O centro operacional da cozinha, em uma tela.",
    itens: ["Fila de produção", "Roteamento por praça", "Prioridade e tempo", "Status em um toque"],
  },
  {
    icon: <Bike size={32} />,
    titulo: "Delivery",
    texto: "A operação digital do restaurante, sem intermediário.",
    itens: ["Cardápio online", "Cálculo por CEP/raio", "Rastreamento do pedido", "Integração com o KDS"],
  },
  {
    icon: <Package size={32} />,
    titulo: "Estoque",
    texto: "Baixa automática pela composição real do prato.",
    itens: ["Ficha técnica por produto", "Bloqueio automático", "Alerta de insumo baixo", "Zero planilha"],
  },
  {
    icon: <BarChart3 size={32} />,
    titulo: "Administração",
    texto: "Produtos, permissões e relatórios, num só lugar.",
    itens: ["Cadastro de produtos", "Usuários e permissões", "Relatórios gerenciais", "Configurações gerais"],
  },
];

const EVENTOS = [
  "ORDER_CREATED", "ORDER_UPDATED", "ORDER_READY", "ORDER_DELIVERED",
  "WAITER_CALLED", "TABLE_OPENED", "STOCK_UPDATED", "PRODUCT_UNAVAILABLE",
];

const FICHA_TECNICA = [
  { nome: "Carne", de: 150, para: 0, unidade: "g" },
  { nome: "Queijo", de: 30, para: 0, unidade: "g" },
  { nome: "Molho", de: 25, para: 0, unidade: "ml" },
];

/* ------------------------------------------------------------------ */
/* Componente                                                         */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const root = useRef(null);
  const flowLineRef = useRef(null);
  const flowNodesRef = useRef([]);
  const barsRef = useRef([]);
  const ticketRef = useRef(null);

  flowNodesRef.current = [];
  barsRef.current = [];

  const addFlowNode = (el) => {
    if (el && !flowNodesRef.current.includes(el)) flowNodesRef.current.push(el);
  };
  const addBar = (el) => {
    if (el && !barsRef.current.includes(el)) barsRef.current.push(el);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ---- Entrada do hero ---- */
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero__eyebrow", { opacity: 0, y: 16, duration: 0.6 })
        .from(".hero__title .line", { opacity: 0, y: 40, stagger: 0.12, duration: 0.9 }, "-=0.3")
        .from(".hero__sub", { opacity: 0, y: 20, duration: 0.7 }, "-=0.5")
        .from(".hero__ctas > *", { opacity: 0, y: 16, stagger: 0.1, duration: 0.6 }, "-=0.4")
        .from(ticketRef.current, { opacity: 0, x: 60, rotate: 10, duration: 1 }, "-=0.8");

      /* ---- Ticket flutuando (idle) ---- */
      gsap.to(ticketRef.current, {
        y: -14,
        rotate: -3,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      /* ---- Marquee de canais ---- */
      gsap.to(".marquee__track", {
        xPercent: -50,
        ease: "none",
        duration: 22,
        repeat: -1,
      });

      /* ---- Erros: entram tremendo, um a um ---- */
      gsap.utils.toArray(".error-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.05,
        });
      });

      gsap.from(".problem__resolve", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".problem__resolve",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      /* ---- Fluxo: linha + nós, no ritmo do scroll (scrub) ---- */
      const flowTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".flow__track",
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1,
        },
      });

      flowTl.fromTo(flowLineRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);

      flowNodesRef.current.forEach((node, i) => {
        flowTl.fromTo(
          node,
          { opacity: 0, y: 28, scale: 0.85 },
          { opacity: 1, y: 0, scale: 1, ease: "back.out(2)" },
          i * 0.16
        );
      });

      /* ---- Cards de módulos ---- */
      gsap.from(".module-card", {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".modules__grid",
          start: "top 82%",
        },
      });

      /* ---- Pulso em tempo real ---- */
      gsap.from(".pulse__event", {
        opacity: 0,
        x: -16,
        stagger: 0.08,
        duration: 0.5,
        scrollTrigger: {
          trigger: ".pulse__events",
          start: "top 85%",
        },
      });

      gsap.to(".pulse__ring", {
        scale: 2.6,
        opacity: 0,
        duration: 2.2,
        ease: "power1.out",
        stagger: { each: 0.7, repeat: -1 },
        scrollTrigger: {
          trigger: ".pulse",
          start: "top 70%",
        },
      });

      /* ---- Ficha técnica: barras esvaziando com o scroll ---- */
      const stockTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".stock__panel",
          start: "top 75%",
          end: "bottom 45%",
          scrub: 1,
        },
      });

      barsRef.current.forEach((bar, i) => {
        stockTl.to(bar, { scaleX: 0, ease: "none" }, i * 0.15);
      });

      /* ---- Blob final pulsando ---- */
      gsap.to(".final-cta__blob", {
        scale: 1.15,
        opacity: 0.9,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.from(".final-cta__content > *", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".final-cta",
          start: "top 75%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="yummy-lp" ref={root}>
      {/* ---------------- NAV ---------------- */}
      <header className="nav">
        <div className="nav__inner">
          <span className="nav__logo">
            Yummy<span className="dot">.</span>
          </span>
          <nav className="nav__links">
            <a href="#fluxo">O fluxo</a>
            <a href="#modulos">Módulos</a>
            <a href="#tempo-real">Tempo real</a>
          </nav>
          <a href="#cta" className="btn btn--ghost">Falar com o time</a>
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">Sistema omnichannel para restaurantes</p>
            <h1 className="hero__title">
              <span className="line">O pedido entra</span>
              <span className="line em">uma única vez.</span>
              <span className="line">O resto, o Yummy</span>
              <span className="line em">resolve sozinho.</span>
            </h1>
            <p className="hero__sub">
              Do QR Code da mesa ao KDS da cozinha, do estoque ao caixa — todo o
              restaurante conectado em tempo real, numa única operação.
            </p>
            <div className="hero__ctas">
              <a href="#fluxo" className="btn btn--primary">Ver como funciona</a>
              <a href="#cta" className="btn btn--outline">Falar com o time</a>
            </div>
          </div>

          <div className="hero__visual">
            <div className="ticket" ref={ticketRef}>
              <div className="ticket__head">
                <span>PEDIDO #0842</span>
                <span className="ticket__status">EM PREPARO</span>
              </div>
              <div className="ticket__line"><span>1x</span> X-Burger</div>
              <div className="ticket__line"><span>1x</span> Suco de laranja</div>
              <div className="ticket__line ticket__line--muted"><span>obs.</span> sem cebola</div>
              <div className="ticket__foot">MESA 12 · QR CODE</div>
            </div>
          </div>
        </div>

        <div className="marquee">
          <div className="marquee__track">
            {[...CANAIS, ...CANAIS].map((c, i) => (
              <span className="marquee__item" key={i}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROBLEMA ---------------- */}
      <section className="problem">
        <div className="section__head">
          <p className="eyebrow">Hoje, sem o Yummy</p>
          <h2>Cada setor grita sozinho.</h2>
          <p className="section__lede">
            Comanda de papel, planilha de estoque, grupo de WhatsApp com a cozinha.
            Quando os sistemas não conversam, o erro chega para o cliente.
          </p>
        </div>

        <div className="errors">
          {ERROS.map((e) => (
            <div className="error-card" key={e.code}>
              <code className="error-card__code">{e.code}</code>
              <p className="error-card__msg">{e.msg}</p>
            </div>
          ))}
        </div>

        <p className="problem__resolve">
          O Yummy troca esse ruído por <span className="accent">um único fluxo</span>, do
          primeiro toque no cardápio até o fechamento da conta.
        </p>
      </section>

      {/* ---------------- FLUXO (signature) ---------------- */}
      <section className="flow" id="fluxo">
        <div className="section__head">
          <p className="eyebrow">Um pedido, uma jornada</p>
          <h2>Veja o mesmo pedido atravessar a operação.</h2>
          <p className="section__lede">
            Sem retrabalho, sem telefone, sem "confere aí com a cozinha". Role a
            página e acompanhe o pedido #0842 em tempo real.
          </p>
        </div>

        <div className="flow__track">
          <div className="flow__line" ref={flowLineRef} />
          <div className="flow__nodes">
            {FLUXO.map((f, i) => (
              <div className="flow__node" ref={addFlowNode} key={f.label}>
                <span className="flow__icon">{f.icon}</span>
                <span className="flow__index">{String(i + 1).padStart(2, "0")}</span>
                <h3>{f.label}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- MÓDULOS ---------------- */}
      <section className="modules" id="modulos">
        <div className="section__head">
          <p className="eyebrow">Seis papéis, um só sistema</p>
          <h2>Cada área tem a tela que precisa.</h2>
        </div>

        <div className="modules__grid">
          {MODULOS.map((m) => (
            <div className="module-card" key={m.titulo}>
              <span className="module-card__icon">{m.icon}</span>
              <h3>{m.titulo}</h3>
              <p className="module-card__texto">{m.texto}</p>
              <ul>
                {m.itens.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- TEMPO REAL ---------------- */}
      <section className="pulse" id="tempo-real">
        <div className="pulse__inner">
          <div className="pulse__copy section__head section__head--left">
            <p className="eyebrow">WebSocket, sempre ligado</p>
            <h2>Tudo conectado. Sem recarregar a página.</h2>
            <p className="section__lede">
              Quando o KDS marca um pedido como pronto, garçom, cliente e
              dashboard recebem a atualização no mesmo instante.
            </p>
            <div className="pulse__events">
              {EVENTOS.map((ev) => (
                <code className="pulse__event" key={ev}>{ev}</code>
              ))}
            </div>
          </div>

          <div className="pulse__visual">
            <div className="pulse__ring" />
            <div className="pulse__ring" />
            <div className="pulse__ring" />
            <div className="pulse__core">
              <Server size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> API
            </div>
            <div className="pulse__node pulse__node--1">
              <ChefHat size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Garçom
            </div>
            <div className="pulse__node pulse__node--2">
              <Smartphone size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Cliente
            </div>
            <div className="pulse__node pulse__node--3">
              <BarChart3 size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Dashboard
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- ESTOQUE / FICHA TÉCNICA ---------------- */}
      <section className="stock">
        <div className="section__head">
          <p className="eyebrow">Ficha técnica</p>
          <h2>O estoque sabe o que está no prato.</h2>
          <p className="section__lede">
            Cada venda desconta os insumos reais da receita — sem planilha, sem
            contagem manual no fim do dia.
          </p>
        </div>

        <div className="stock__panel">
          <div className="stock__dish">
            <Utensils size={20} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} /> X-Burger
          </div>
          {FICHA_TECNICA.map((item, i) => (
            <div className="stock__row" key={item.nome}>
              <span className="stock__label">{item.nome}</span>
              <div className="stock__bar-track">
                <div className="stock__bar-fill" ref={addBar} />
              </div>
              <span className="stock__value">
                {item.de}{item.unidade} → {item.para}{item.unidade}
              </span>
            </div>
          ))}
          <p className="stock__note">Insumo insuficiente? O prato some do cardápio na hora.</p>
        </div>
      </section>

      {/* ---------------- CTA FINAL ---------------- */}
      <section className="final-cta" id="cta">
        <div className="final-cta__blob" />
        <div className="final-cta__content">
          <p className="eyebrow eyebrow--light">Uma operação. Todos os canais.</p>
          <h2>Zero caos.</h2>
          <p className="final-cta__sub">
            Leve o Yummy para o seu restaurante e conecte cliente, salão, cozinha
            e caixa numa única fonte de verdade.
          </p>
          <a href="mailto:contato@yummy.app" className="btn btn--primary btn--lg">
            Quero o Yummy no meu restaurante
          </a>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="footer">
        <span>Yummy © 2026</span>
        <span>Feito com <Heart size={14} fill="currentColor" style={{ display: "inline", verticalAlign: "middle", margin: "0 2px" }} /> para a indústria de restaurantes.</span>
      </footer>
    </div>
  );
}