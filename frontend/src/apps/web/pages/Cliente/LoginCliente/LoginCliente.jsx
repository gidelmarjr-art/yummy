import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  FaGoogle,
  FaFacebook,
  FaApple,
  FaEye,
  FaEyeSlash,
  FaPizzaSlice,
  FaHamburger,
  FaUtensils,
  FaIceCream,
} from "react-icons/fa";
import "./LoginCliente.css";

import logoIcone from "../../../../../imgs/LogoYummy.png";

export default function LoginCliente() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const navigate = useNavigate();

  const [showSenha, setShowSenha] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar sua lógica de autenticação futuramente.
    // Redireciona para a página inicial (ajuste a rota se necessário, ex: "/" ou "/home")
    navigate("/home");
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: -30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
      );

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.2,
        },
      );

      gsap.fromTo(
        ".stagger-item",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.35,
        },
      );

      gsap.to(logoRef.current, {
        y: -10,
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 25;
        const yPos = (clientY / window.innerHeight - 0.5) * 25;

        gsap.to(".parallax-bg", {
          x: xPos,
          y: yPos,
          duration: 1,
          ease: "power1.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="login-page-bg" ref={containerRef}>
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
      <div className="login-content-wrapper">
        <div className="login-logo-container" ref={logoRef}>
          <img src={logoIcone} alt="Yummy Logo" className="login-logo" />
        </div>

        <div className="login-card" ref={cardRef}>
          <h2 className="form-title stagger-item">Login</h2>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group stagger-item">
              <label>*E-mail</label>
              <input type="email" placeholder="seu@email.com" required />
            </div>

            <div className="input-group stagger-item relative-input">
              <label>*Senha</label>
              <div className="password-wrapper">
                <input
                  type={showSenha ? "text" : "password"}
                  placeholder="••••••••"
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

            <div className="divider stagger-item">
              <span>Entre com uma conta</span>
            </div>

            <div className="social-login stagger-item">
              <button type="button" className="btn-social google">
                <FaGoogle size={20} />
              </button>
              <button type="button" className="btn-social facebook">
                <FaFacebook size={20} />
              </button>
              <button type="button" className="btn-social apple">
                <FaApple size={20} />
              </button>
            </div>

            <div className="forgot-password stagger-item">
              <p>
                Esqueceu a senha? <Link to="/redefinir-senha">Clique aqui</Link>
              </p>
            </div>

            <div className="checkbox-group stagger-item">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Lembrar-me</label>
            </div>

            <button type="submit" className="btn-submit stagger-item">
              LOGIN
            </button>

            <div className="form-footer stagger-item">
              <p>
                Não possui uma conta? <a href="/cadastro">Clique aqui</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
