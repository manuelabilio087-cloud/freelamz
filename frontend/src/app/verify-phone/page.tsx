"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function VerifyEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setEmail(parsed.email || "");
    }
  }, []);

  const sendCode = async () => {
    if (!email || !email.includes("@")) {
      setError("Insere um email valido");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/send-email-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao enviar");
      setStep("code");
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) clearInterval(timer);
          return c - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Nao foi possivel enviar o codigo. Tenta novamente.");
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    if (code.length !== 6) {
      setError("Insere o codigo de 6 digitos");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Codigo invalido");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Codigo invalido ou expirado");
    }
    setLoading(false);
  };

  const skip = () => router.push("/dashboard");

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #fff !important; }
        body { font-family: Inter, sans-serif; color: #404145; }
        .page { min-height: 100vh; display: flex; flex-direction: column; }
        .topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 1px solid #e4e5e7; background: #fff; }
        .logo { font-size: 24px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .back-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #404145; }
        .container { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; max-width: 420px; margin: 0 auto; width: 100%; }
        .icon-wrap { margin-bottom: 24px; width: 64px; height: 64px; border-radius: 50%; background: #f0fdf8; display: flex; align-items: center; justify-content: center; }
        h1 { font-size: 28px; font-weight: 700; margin-bottom: 12px; text-align: center; }
        p.desc { font-size: 15px; color: #74767e; margin-bottom: 32px; text-align: center; line-height: 1.5; }
        .email-input { width: 100%; padding: 14px 16px; border: 1px solid #e4e5e7; border-radius: 8px; font-size: 14px; outline: none; color: #404145; margin-bottom: 16px; font-family: inherit; }
        .email-input:focus { border-color: #1dbf73; }
        .code-input { width: 100%; padding: 14px 16px; border: 1px solid #e4e5e7; border-radius: 8px; font-size: 24px; outline: none; text-align: center; letter-spacing: 8px; margin-bottom: 16px; color: #404145; }
        .code-input:focus { border-color: #1dbf73; }
        .btn-primary { width: 100%; padding: 14px; background: #1dbf73; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #0fa85c; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-skip { background: none; border: none; color: #74767e; font-size: 14px; cursor: pointer; margin-top: 20px; text-decoration: underline; }
        .btn-skip:hover { color: #404145; }
        .error { color: #e53e3e; font-size: 13px; margin-bottom: 12px; padding: 10px; background: #fff5f5; border-radius: 4px; border: 1px solid #fed7d7; text-align: center; }
        .resend { font-size: 13px; color: #74767e; text-align: center; margin-top: 16px; }
        .resend button { background: none; border: none; color: #1dbf73; font-weight: 600; cursor: pointer; font-size: 13px; }
        .resend button:disabled { color: #74767e; cursor: not-allowed; }
        .email-display { text-align: center; font-size: 14px; color: #404145; margin-bottom: 20px; font-weight: 600; background: #f5f5f5; padding: 8px 16px; border-radius: 20px; }
        @media (max-width: 768px) {
          .topbar { padding: 16px; }
        }
      `}</style>

      <div className="page">
        <div className="topbar">
          <button className="back-btn" onClick={() => router.back()}>← Voltar</button>
          <Link href="/" className="logo">Freelamz<span>.</span></Link>
          <div style={{ width: 60 }} />
        </div>

        <div className="container">
          <div className="icon-wrap">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>

          {step === "email" ? (
            <>
              <h1>Verifica o teu email</h1>
              <p className="desc">
                Enviaremos um codigo de 6 digitos para confirmares a tua conta.
              </p>

              <input
                className="email-input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && <p className="error">{error}</p>}

              <button className="btn-primary" onClick={sendCode} disabled={loading}>
                {loading ? "A enviar..." : "Enviar codigo →"}
              </button>

              <button className="btn-skip" onClick={skip}>Saltar por agora</button>
            </>
          ) : (
            <>
              <h1>Confirma o codigo</h1>
              <p className="desc">
                Enviámos um codigo de 6 digitos para o teu email.
              </p>
              <p className="email-display">{email}</p>

              <input
                className="code-input"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
              />

              {error && <p className="error">{error}</p>}

              <button className="btn-primary" onClick={verifyCode} disabled={loading}>
                {loading ? "A verificar..." : "Verificar conta"}
              </button>

              <div className="resend">
                {countdown > 0 ? (
                  <>Reenviar codigo em {countdown}s</>
                ) : (
                  <>
                    Nao recebeste? <button onClick={sendCode}>Reenviar</button>
                  </>
                )}
              </div>

              <button className="btn-skip" onClick={skip}>Saltar por agora</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}