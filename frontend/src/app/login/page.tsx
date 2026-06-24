"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Email ou senha incorrectos"); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "client") {
        router.push("/client-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Erro de conexao com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #fff !important; }
        body { font-family: Inter, sans-serif; color: #404145; }
        a { text-decoration: none; color: inherit; }
        .page { min-height: 100vh; display: flex; flex-direction: column; }
        .topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 1px solid #e4e5e7; background: #fff; }
        .logo { font-size: 24px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .back-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #404145; }
        .container { flex: 1; display: flex; }
        .left {
          flex: 1;
          position: relative;
          background-image: url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800');
          background-size: cover;
          background-position: center;
        }
        .left-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 40px;
        }
        .left-text { color: #fff; text-align: center; }
        .left-text h2 { font-size: 28px; font-weight: 700; margin-bottom: 8px; text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
        .left-text p { font-size: 15px; opacity: 0.9; text-shadow: 0 1px 4px rgba(0,0,0,0.5); }
        .right { width: 480px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; }
        .box { width: 100%; max-width: 380px; }
        .box h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .box .subtitle { font-size: 14px; color: #74767e; margin-bottom: 32px; }
        .box .subtitle a { color: #1dbf73; font-weight: 600; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #404145; margin-bottom: 6px; }
        .form-group input { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 14px; outline: none; color: #404145; transition: border-color 0.2s; }
        .form-group input:focus { border-color: #1dbf73; }
        .forgot { text-align: right; margin-top: -8px; margin-bottom: 20px; }
        .forgot a { font-size: 13px; color: #1dbf73; }
        .btn-primary { width: 100%; padding: 14px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #0fa85c; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .error { color: #e53e3e; font-size: 13px; margin-bottom: 12px; padding: 10px; background: #fff5f5; border-radius: 4px; border: 1px solid #fed7d7; }
        .register-link { text-align: center; margin-top: 24px; font-size: 14px; color: #74767e; }
        .register-link a { color: #1dbf73; font-weight: 600; }
        @media (max-width: 768px) {
          .left { display: none; }
          .right { width: 100%; padding: 32px 24px; }
          .topbar { padding: 16px; }
        }
      `}</style>

      <div className="page">
        <div className="topbar">
          <button className="back-btn" onClick={() => router.back()}>← Voltar</button>
          <Link href="/" className="logo">Freelamz<span>.</span></Link>
          <Link href="/register" style={{fontSize:"14px", color:"#404145"}}>Criar conta</Link>
        </div>

        <div className="container">
          <div className="left">
            <div className="left-overlay">
              <div className="left-text">
                <h2>A plataforma freelance de Moçambique</h2>
                <p>Encontra talento ou trabalho em minutos 🇲🇿</p>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="box">
              <h1>Entrar</h1>
              <p className="subtitle">Nao tens conta? <Link href="/register">Registar gratis</Link></p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Senha</label>
                  <input type="password" placeholder="A tua senha" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="forgot">
                  <Link href="/forgot-password">Esqueceste a senha?</Link>
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "A entrar..." : "Entrar"}
                </button>
              </form>

              <p className="register-link">
                Nao tens conta? <Link href="/register">Cria uma conta gratis</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}