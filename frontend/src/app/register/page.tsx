"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref") || "";
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
        body: JSON.stringify({ name, email, password, role: "freelancer", referral_code: referralCode || undefined }),
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
        .box .subtitle { font-size: 14px; color: #74767e; margin-bottom: 32px; }
        .box .subtitle a { color: #1dbf73; font-weight: 600; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #404145; margin-bottom: 6px; }
        .form-group input { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 14px; outline: none; color: #404145; transition: border-color 0.2s; font-family: inherit; }
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
                {referralCode && (
                  <p style={{ fontSize: "13px", color: "#1dbf73", marginBottom: "12px", background: "#ecfdf5", padding: "10px", borderRadius: "4px" }}>
                    Codigo de indicacao aplicado: <strong>{referralCode}</strong>
                  </p>
                )}
                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "A criar conta..." : "Criar conta"}
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

export default function Register() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}