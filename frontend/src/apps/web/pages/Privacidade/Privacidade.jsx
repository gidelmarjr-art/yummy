import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Database,
  Target,
  Lock,
  UserCheck,
  Mail,
} from "lucide-react";
import "./Privacidade.css";

const SECOES = [
  {
    icon: <Database size={22} />,
    titulo: "Quais dados coletamos",
    itens: [
      "Nome completo",
      "E-mail (usado como usuário de acesso)",
      "Telefone",
      "CPF",
      "Endereço de entrega",
      "Senha (nunca em texto puro — veja abaixo)",
    ],
  },
  {
    icon: <Target size={22} />,
    titulo: "Para que usamos",
    itens: [
      "Autenticar seu login e manter sua conta segura",
      "Processar, encaminhar e entregar seus pedidos",
      "Avisar sobre o status do pedido em tempo real",
      "Dar suporte quando você precisar de ajuda",
    ],
  },
  {
    icon: <Lock size={22} />,
    titulo: "Como protegemos",
    itens: [
      "Sua senha é armazenada com hash — nem a equipe Yummy consegue lê-la",
      "Toda comunicação entre o app e o servidor é criptografada (HTTPS)",
      "Acesso aos dados é restrito a quem opera o sistema",
    ],
  },
  {
    icon: <UserCheck size={22} />,
    titulo: "Seus direitos",
    itens: [
      "Acessar todos os dados que temos sobre você",
      "Corrigir informações desatualizadas ou incorretas",
      "Pedir a exclusão da sua conta e dos seus dados",
      "Revogar consentimento a qualquer momento",
    ],
  },
];

export default function Privacidade() {
  return (
    <div className="privacy-page">
      <Link to="/" className="privacy-page__back">
        <ArrowLeft size={16} /> Início
      </Link>

      <div className="privacy-page__inner">
        <p className="privacy-page__eyebrow">LGPD · Segurança de dados</p>
        <h1 className="privacy-page__title">
          <span className="privacy-page__title-line">Seus dados,</span>
          <span className="privacy-page__title-line privacy-page__title-line--em">
            do jeito certo.
          </span>
        </h1>
        <p className="privacy-page__sub">
          Esta página explica, em linguagem simples, o que o Yummy coleta,
          por quê, e quais direitos você tem sobre suas informações — conforme
          a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).
        </p>

        <div className="privacy-page__grid">
          {SECOES.map((s) => (
            <div className="privacy-page__card" key={s.titulo}>
              <span className="privacy-page__card-icon">{s.icon}</span>
              <h2>{s.titulo}</h2>
              <ul>
                {s.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="privacy-page__contact">
          <span className="privacy-page__contact-icon">
            <Mail size={20} />
          </span>
          <div>
            <h2>Quer exercer algum desses direitos?</h2>
            <p>
              Escreva para{" "}
              <a href="mailto:privacidade@yummy.app">privacidade@yummy.app</a>{" "}
              e responderemos o quanto antes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}