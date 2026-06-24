"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmail() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!code) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/welcome");
    }, 1500);
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
        .back-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #404145; }
        .container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .box { width: 100%; max-width: 420px; text-align: center; }
        .icon { font-size: 64px; margin-bottom: 24px; }
        .box h1 { font-size: 28px; font-weight: 700; color: #404145; margin-bottom: 8px; }
        .box p { color: #74767e; font-size: 14px; margin-bottom: 32px; line-height: 1.6; }
        .code-input { width: 100%; padding: 16px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 24px; text-align: center; letter-spacing: 8px; outline: none; margin-bottom: 16px; color: #404145; }
        .code-input:focus { border-color: #1dbf73; }
        .btn-primary { width: 100%; padding: 14px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .resend { display: block; margin-top: 16px; font-size: 14px; color: #74767e; cursor: pointer; }
        .resend a { color: #1dbf73; font-weight: 600; }
      `}</style>
      <div className="page">
        <div className="topbar">
          <button className="back-btn" onClick={() => router.back()}>← Voltar</button>
          <Link href="/" className="logo">Freelamz<span>.</span></Link>
          <div></div>
        </div>
        <div className="container">
          <div className="box">
            <div className="icon">📧</div>
            <h1>Verifica o teu email</h1>
            <p>Enviamos um codigo de verificacao para o teu email. Introduz o codigo abaixo para continuar.</p>
            <input type="text" className="code-input" placeholder="000000" maxLength={6} value={code} onChange={e => setCode(e.target.value)} />
            <button className="btn-primary" disabled={code.length < 4 || loading} onClick={handleVerify}>
              {loading ? "A verificar..." : "Verificar email →"}
            </button>
            <span className="resend">Nao recebeste o email? <a href="#">Reenviar</a></span>
          </div>
        </div>
      </div>
    </>
  );
}