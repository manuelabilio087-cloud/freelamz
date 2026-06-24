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
        body: JSON.stringify({ name, email, password, role: "freelancer" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erro ao registar"); return; }
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
        body { font-family: Inter, sans-serif; background: #fff; }
        .page { min-height: 100vh; display: flex; flex-direction: column; }
        .topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 1px solid #e4e5e7; }
        .logo { font-size: 24px; font-weight: 700; color: #000; text-decoration: none; }
        .logo span { color: #1dbf73; }
        .back-btn { display: flex; align-items: center; gap: 8px; color: #404145; font-size: 14px; cursor: pointer; background: none; border: none; }
        .container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .box { width: 100%; max-width: 420px; }
        .box h1 { font-size: 28px; font-weight: 700; color: #404145; margin-bottom: 8px; }
        .box p { color: #74767e; font-size: 14px; margin-bottom: 28px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #404145; margin-bottom: 6px; }
        .form-group input { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 14px; outline: none; color: #404145; }
        .form-group input:focus { border-color: #1dbf73; }
        .btn-primary { width: 100%; padding: 14px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 8px; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: #74767e; font-size: 13px; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e4e5e7; }
        .btn-social { width: 100%; padding: 12px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; background: #fff; color: #404145; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
        .btn-social:hover { background: #f5f5f5; }
        .error { color: #e53e3e; font-size: 13px; margin-bottom: 12px; }
        .login-link { text-align: center; margin-top: 20px; font-size: 14px; color: #74767e; }
        .login-link a { color: #1dbf73; font-weight: 600; }
        .terms { text-align: center; font-size: 12px; color: #74767e; margin-top: 16px; line-height: 1.5; }
      `}</style>
      <div className="page">
        <div className="topbar">
          <button className="back-btn" onClick={() => router.back()}>← Voltar</button>
          <Link href="/" className="logo">Freelamz<span>.</span></Link>
          <Link href="/login" style={{fontSize:"14px", color:"#404145"}}>Entrar</Link>
        </div>
        <div className="container">
          <div className="box">
            <h1>Cria a tua conta</h1>
            <p>Junta-te a comunidade Freelamz</p>
            <button className="btn-social">🔵 Continuar com Google</button>
            <button className="btn-social">🔷 Continuar com Facebook</button>
            <div className="divider">ou</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="O teu nome" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 caracteres" required />
              </div>
              {error && <p className="error">{error}</p>}
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "A criar conta..." : "Criar conta"}
              </button>
            </form>
            <p className="login-link">Já tens conta? <Link href="/login">Entrar</Link></p>
            <p className="terms">Ao criar conta concordas com os <a href="#" style={{color:"#1dbf73"}}>Termos de Serviço</a> e <a href="#" style={{color:"#1dbf73"}}>Política de Privacidade</a> do Freelamz.</p>
          </div>
        </div>
      </div>
    </>
  );
}