import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redirecionar após o cadastro
import axios from "axios";
import { gsap } from "gsap";
import { 
  FaEye, 
  FaEyeSlash,
  FaPizzaSlice,
  FaHamburger,
  FaUtensils,
  FaIceCream
} from "react-icons/fa";
import "./CadastroCliente.css";

import logoNome from "../../../../../imgs/LogoYummy_3.png";
import logoIcone from "../../../../../imgs/LogoYummy_2.png";

export default function CadastroCliente() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const mascotRef = useRef(null);
  const navigate = useNavigate();

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // Estados para capturar os dados do formulário
  const [formData, setFormData] = useState({
    nome_completo: "",
    usuario: "", // email
    telefone: "",
    cpf: "",
    endereco: "",
    senha: "",
    confirmarSenha: ""
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || "https://yummy-ms7e.onrender.com";
      
      // Enviando para a rota do FastAPI que ajustamos
      await axios.post(`${API_URL}/auth/cadastrar`, {
        usuario: formData.usuario,
        senha: formData.senha,
        nome_completo: formData.nome_completo,
        telefone: formData.telefone,
        cpf: formData.cpf,
        endereco: formData.endereco
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/login"); // Redireciona para o login
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.detail || "Erro ao realizar cadastro. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: 60, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        ".stagger-item",
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.06, 
          duration: 0.6, 
          ease: "power2.out", 
          delay: 0.2 
        }
      );

      gsap.to(mascotRef.current, {
        y: -15, 
        duration: 2.5, 
        yoyo: true, 
        repeat: -1, 
        ease: "power1.inOut"
      });

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 30;
        const yPos = (clientY / window.innerHeight - 0.5) * 30;

        gsap.to(".parallax-bg", {
          x: xPos,
          y: yPos,
          duration: 1,
          ease: "power1.out"
        });

        gsap.to(".mascot-container", {
          x: -xPos * 0.8,
          y: -yPos * 0.8,
          duration: 1,
          ease: "power1.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="cadastro-page-bg" ref={containerRef}>
      <div className="bg-pattern"></div>
      <div className="floating-icons-container parallax-bg">
        <FaPizzaSlice className="food-icon icon-1" />
        <FaHamburger className="food-icon icon-2" />
        <FaUtensils className="food-icon icon-3" />
        <FaIceCream className="food-icon icon-4" />
      </div>
      <div className="bg-shape shape-1 parallax-bg"></div>
      <div className="bg-shape shape-2 parallax-bg"></div>
      <div className="bg-shape shape-3 parallax-bg"></div>
      <div className="cadastro-left">
        <img 
          src={logoNome} 
          alt="Yummy" 
          className="logo-text"
        />
        
        <div className="mascot-container">
          <div className="mascot-backdrop"></div>
          <div ref={mascotRef} style={{ position: 'relative', zIndex: 2 }}>
            <img 
              src={logoIcone} 
              alt="Yummy Mascote" 
              className="logo-mascot"
            />
          </div>
        </div>
      </div>

      <div className="cadastro-right-wrapper">
        <div className="cadastro-card" ref={cardRef}>
          <h2 className="form-title stagger-item">Cadastro Cliente</h2>

          {erro && <div style={{ color: "red", marginBottom: "10px", fontSize: "14px" }} className="stagger-item">{erro}</div>}

          <form className="cadastro-form" onSubmit={handleCadastro}>
            <div className="input-group stagger-item">
              <label>*Nome Completo</label>
              <input 
                type="text" 
                name="nome_completo" 
                placeholder="Seu nome" 
                value={formData.nome_completo} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group stagger-item">
              <label>*E-mail</label>
              <input 
                type="email" 
                name="usuario" 
                placeholder="seu@email.com" 
                value={formData.usuario} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-row">
              <div className="input-group stagger-item">
                <label>*Telefone</label>
                <input 
                  type="tel" 
                  name="telefone" 
                  placeholder="(00) 00000-0000" 
                  value={formData.telefone} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="input-group stagger-item">
                <label>*CPF</label>
                <input 
                  type="text" 
                  name="cpf" 
                  placeholder="000.000.000-00" 
                  value={formData.cpf} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="input-group stagger-item">
              <label>*Endereço</label>
              <input 
                type="text" 
                name="endereco" 
                placeholder="Rua, Número, Bairro" 
                value={formData.endereco} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-row">
              <div className="input-group stagger-item relative-input">
                <label>*Senha</label>
                <div className="password-wrapper">
                  <input 
                    type={showSenha ? "text" : "password"} 
                    name="senha"
                    placeholder="••••••••" 
                    value={formData.senha}
                    onChange={handleChange}
                    required 
                  />
                  <button 
                    type="button" 
                    className="toggle-password" 
                    onClick={() => setShowSenha(!showSenha)}
                  >
                    {showSenha ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="input-group stagger-item relative-input">
                <label>*Confirmar Senha</label>
                <div className="password-wrapper">
                  <input 
                    type={showConfirmarSenha ? "text" : "password"} 
                    name="confirmarSenha"
                    placeholder="••••••••" 
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required 
                  />
                  <button 
                    type="button" 
                    className="toggle-password" 
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                  >
                    {showConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="checkbox-group stagger-item">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">Li e aceito os termos de serviço</label>
            </div>

            <button type="submit" className="btn-submit stagger-item" disabled={loading}>
              {loading ? "CADASTRANDO..." : "CADASTRAR"}
            </button>

            <div className="form-footer stagger-item">
              <p>Já tem uma conta? <a href="/login">Clique aqui</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}