"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erro ao criar conta"); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/welcome");
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
        .left { flex: 1; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; color: #fff; overflow: hidden; background-image: url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800'); background-size: cover; background-position: center; }
        .left-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.55); }
        .left-content { position: relative; z-index: 10; }
        .left-content h2 { font-size: 36px; font-weight: 700; margin-bottom: 16px; line-height: 1.2; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
        .left-content p { font-size: 16px; opacity: 0.95; margin-bottom: 32px; line-height: 1.6; }
        .features { display: flex; flex-direction: column; gap: 14px; }
        .feature { display: flex; align-items: center; gap: 12px; font-size: 15px; }
        .feature-icon { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .right { width: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; overflow-y: auto; }
        .box { width: 100%; max-width: 400px; }
        .box h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .box .subtitle { font-size: 14px; color: #74767e; margin-bottom: 24px; }
        .box .subtitle a { color: #1dbf73; font-weight: 600; }
        .btn-social { width: 100%; padding: 12px 16px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; background: #fff; color: #404145; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; transition: all 0.2s; text-decoration: none; }
        .btn-social:hover { background: #f5f5f5; border-color: #ccc; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: #74767e; font-size: 13px; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e4e5e7; }
        .role-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
        .role-tab { flex: 1; padding: 10px; border: 2px solid #e4e5e7; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; background: #fff; color: #74767e; text-align: center; transition: all 0.2s; }
        .role-tab.active { border-color: #1dbf73; color: #1dbf73; background: #f0fdf8; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #404145; margin-bottom: 6px; }
        .form-group input { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 14px; outline: none; color: #404145; transition: border-color 0.2s; }
        .form-group input:focus { border-color: #1dbf73; }
        .btn-primary { width: 100%; padding: 14px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-top: 4px; }
        .btn-primary:hover { background: #0fa85c; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .error { color: #e53e3e; font-size: 13px; margin-bottom: 12px; padding: 10px; background: #fff5f5; border-radius: 4px; border: 1px solid #fed7d7; }
        .login-link { text-align: center; margin-top: 20px; font-size: 14px; color: #74767e; }
        .login-link a { color: #1dbf73; font-weight: 600; }
        .terms { font-size: 12px; color: #74767e; text-align: center; margin-top: 16px; line-height: 1.5; }
        .terms a { color: #1dbf73; }
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
          <Link href="/login" style={{fontSize:"14px", color:"#404145"}}>Entrar</Link>
        </div>

        <div className="container">
          <div className="left">
            <div className="left-overlay"></div>
            <div className="left-content">
              <h2>Junta-te ao Freelamz</h2>
              <p>Cria a tua conta e começa a trabalhar ou a contratar hoje mesmo.</p>
              <div className="features">
                {[
                  {icon:"🇲🇿", text:"Plataforma 100% moçambicana"},
                  {icon:"✅", text:"Registo gratuito e rapido"},
                  {icon:"💰", text:"Ganha dinheiro com os teus talentos"},
                  {icon:"🚀", text:"Projectos publicados em minutos"},
                ].map((f, i) => (
                  <div key={i} className="feature">
                    <div className="feature-icon">{f.icon}</div>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right">
            <div className="box">
              <h1>Criar conta</h1>
              <p className="subtitle">Ja tens conta? <Link href="/login">Entrar</Link></p>

              {/* GOOGLE */}
              <Link href="/login?method=google" className="btn-social">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </Link>

              {/* FACEBOOK */}
              <Link href="/login?method=facebook" className="btn-social">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuar com Facebook
              </Link>

              <div className="divider">ou regista com email</div>

              <div className="role-tabs">
                <button className={`role-tab ${role === "freelancer" ? "active" : ""}`} onClick={() => setRole("freelancer")}>
                  💼 Sou Freelancer
                </button>
                <button className={`role-tab ${role === "client" ? "active" : ""}`} onClick={() => setRole("client")}>
                  🏢 Sou Cliente
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nome completo</label>
                  <input type="text" placeholder="O teu nome" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Senha</label>
                  <input type="password" placeholder="Minimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "A criar conta..." : `Criar conta como ${role === "freelancer" ? "Freelancer" : "Cliente"}`}
                </button>
              </form>

              <p className="terms">
                Ao criares conta aceitas os nossos <Link href="/terms">Termos de Uso</Link> e <Link href="/privacy">Politica de Privacidade</Link>
              </p>

              <p className="login-link">
                Ja tens conta? <Link href="/login">Entrar</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}