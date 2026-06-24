"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyPhone() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSendCode = () => {
    if (!phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerify = () => {
    if (!code) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
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
        .phone-input { display: flex; border: 1px solid #e4e5e7; border-radius: 4px; overflow: hidden; margin-bottom: 16px; }
        .phone-prefix { padding: 12px 14px; background: #f5f5f5; border-right: 1px solid #e4e5e7; font-size: 14px; color: #404145; font-weight: 600; white-space: nowrap; }
        .phone-input input { flex: 1; padding: 12px 14px; border: none; outline: none; font-size: 14px; color: #404145; }
        .code-input { width: 100%; padding: 16px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 24px; text-align: center; letter-spacing: 8px; outline: none; margin-bottom: 16px; color: #404145; }
        .code-input:focus { border-color: #1dbf73; }
        .btn-primary { width: 100%; padding: 14px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .skip-link { display: block; margin-top: 16px; font-size: 14px; color: #74767e; cursor: pointer; text-decoration: underline; }
        .skip-link:hover { color: #404145; }
      `}</style>
      <div className="page">
        <div className="topbar">
          <button className="back-btn" onClick={() => router.back()}>← Voltar</button>
          <Link href="/" className="logo">Freelamz<span>.</span></Link>
          <div></div>
        </div>
        <div className="container">
          <div className="box">

            {step === 1 && (
              <>
                <div className="icon">📱</div>
                <h1>Verifica o teu telefone</h1>
                <p>Adiciona o teu numero de telefone para aumentar a confianca do teu perfil e receber notificacoes.</p>
                <div className="phone-input">
                  <span className="phone-prefix">🇲🇿 +258</span>
                  <input type="tel" placeholder="84 000 0000" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <button className="btn-primary" disabled={!phone || loading} onClick={handleSendCode}>
                  {loading ? "A enviar..." : "Enviar codigo →"}
                </button>
                <span className="skip-link" onClick={() => router.push("/dashboard")}>Saltar por agora</span>
              </>
            )}

            {step === 2 && (
              <>
                <div className="icon">🔐</div>
                <h1>Introduz o codigo</h1>
                <p>Enviamos um codigo de 6 digitos para o numero <strong>+258 {phone}</strong>. Introduz o codigo abaixo.</p>
                <input type="text" className="code-input" placeholder="000000" maxLength={6} value={code} onChange={e => setCode(e.target.value)} />
                <button className="btn-primary" disabled={code.length < 4 || loading} onClick={handleVerify}>
                  {loading ? "A verificar..." : "Verificar →"}
                </button>
                <span className="skip-link" onClick={() => setStep(1)}>Nao recebi o codigo</span>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}