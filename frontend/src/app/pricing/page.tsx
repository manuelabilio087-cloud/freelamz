"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Pricing() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myPlan, setMyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mpesa, setMpesa] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      setUser(JSON.parse(u));
      fetchMyPlan();
    }
  }, []);

  const fetchMyPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/subscriptions/my-plan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMyPlan(data);
    } catch {}
  };

  const handleSubscribe = async () => {
    if (!user) { router.push("/login"); return; }
    const mpesaRegex = /^(84|85|86|87)\d{7}$/;
    if (!mpesaRegex.test(mpesa)) {
      setError("Número M-Pesa inválido. Deve começar com 84, 85, 86 ou 87.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/subscriptions/pro`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mpesa_number: mpesa }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Erro ao processar pagamento.");
      } else {
        setSuccess("Plano Pro ativado com sucesso! 🎉");
        setShowForm(false);
        setMpesa("");
        fetchMyPlan();
        setTimeout(() => setSuccess(""), 6000);
      }
    } catch {
      setError("Erro de conexão. Tenta novamente.");
    }
    setLoading(false);
  };

  const isPro = myPlan?.plan === "pro";

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #f5f6fa; color: #1a1d27; }
        a { text-decoration: none; color: inherit; }
        
        .logo { font-size: 22px; font-weight: 700; }
        .logo span { color: #6366f1; }
        .hero { text-align: center; padding: 64px 24px 40px; }
        .hero h1 { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
        .hero p { font-size: 17px; color: #6b7280; max-width: 480px; margin: 0 auto; }
        .container { max-width: 900px; margin: 0 auto; padding: 0 24px 60px; }
        .plans { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 48px; }
        .plan-card { background: #fff; border-radius: 20px; border: 2px solid #e8eaf0; padding: 36px; position: relative; }
        .plan-card.pro { border-color: #6366f1; }
        .popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 6px 20px; border-radius: 20px; font-size: 12px; font-weight: 700; white-space: nowrap; }
        .plan-name { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
        .plan-price { font-size: 42px; font-weight: 800; color: #1a1d27; margin-bottom: 4px; }
        .plan-price span { font-size: 16px; font-weight: 500; color: #6b7280; }
        .plan-desc { font-size: 14px; color: #6b7280; margin-bottom: 28px; }
        .features { list-style: none; margin-bottom: 32px; display: flex; flex-direction: column; gap: 12px; }
        .feature { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #4b5563; }
        .check { width: 20px; height: 20px; border-radius: 50%; background: #ecfdf5; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .check.pro { background: #eef2ff; }
        .btn-free { display: block; text-align: center; padding: 13px; border-radius: 10px; font-weight: 700; font-size: 15px; border: 2px solid #e8eaf0; color: #6b7280; cursor: pointer; background: #fff; }
        .btn-pro { display: block; text-align: center; padding: 13px; border-radius: 10px; font-weight: 700; font-size: 15px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; cursor: pointer; border: none; transition: opacity 0.2s; }
        .btn-pro:hover { opacity: 0.9; }
        .btn-pro:disabled { opacity: 0.5; cursor: not-allowed; }
        .active-badge { display: block; text-align: center; padding: 13px; border-radius: 10px; font-weight: 700; font-size: 15px; background: #ecfdf5; color: #10b981; }

        .mpesa-form { background: #fff; border-radius: 16px; border: 1px solid #e8eaf0; padding: 28px; margin-bottom: 24px; }
        .form-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
        .form-group { margin-bottom: 16px; }
        .form-label { font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px; }
        .form-input { width: 100%; padding: 12px 16px; border: 1.5px solid #e8eaf0; border-radius: 10px; font-size: 14px; outline: none; font-family: inherit; }
        .form-input:focus { border-color: #6366f1; }
        .form-hint { font-size: 12px; color: #6b7280; margin-top: 4px; }
        .form-actions { display: flex; gap: 12px; margin-top: 20px; }
        .btn-cancel { padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; border: 1.5px solid #e8eaf0; background: #fff; color: #6b7280; cursor: pointer; }

        .alert { padding: 14px 18px; border-radius: 10px; font-size: 14px; font-weight: 600; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .alert-success { background: #ecfdf5; color: #10b981; }
        .alert-error { background: #fef2f2; color: #ef4444; }

        .my-plan-box { background: #eef2ff; border-radius: 16px; padding: 24px; margin-bottom: 32px; display: flex; align-items: center; gap: 16px; }
        .my-plan-icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .commission-box { background: #fff; border-radius: 16px; border: 1px solid #e8eaf0; padding: 28px; margin-bottom: 24px; }
        .commission-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
        .commission-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        .commission-row:last-child { border-bottom: none; }

        @media (max-width: 640px) {
          .plans { grid-template-columns: 1fr; }
          
          .hero h1 { font-size: 26px; }
        }
      `}</style>

      <Navbar />

      <div className="hero">
        <h1>Planos e Preços</h1>
        <p>Começa grátis e faz upgrade quando precisares de mais.</p>
      </div>

      <div className="container">
        {success && (
          <div className="alert alert-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            {success}
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {/* Plano atual */}
        {myPlan && (
          <div className="my-plan-box">
            <div className="my-plan-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>
                Plano atual: <span style={{ color: "#6366f1" }}>{myPlan.plan_name}</span>
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                {myPlan.plan === "free"
                  ? `${myPlan.proposals_used}/${myPlan.proposals_limit} propostas usadas este mês`
                  : `Propostas ilimitadas · ${myPlan.subscription ? `Expira em ${new Date(myPlan.subscription.expires_at).toLocaleDateString("pt-PT")}` : ""}`
                }
              </div>
            </div>
          </div>
        )}

        {/* Formulário M-Pesa */}
        {showForm && (
          <div className="mpesa-form">
            <div className="form-title">💳 Subscrever Plano Pro — 200 MT/mês</div>
            <div className="form-group">
              <label className="form-label">Número M-Pesa *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="Ex: 841234567"
                value={mpesa}
                onChange={e => setMpesa(e.target.value)}
                maxLength={9}
              />
              <p className="form-hint">Começa com 84, 85, 86 ou 87. Serás cobrado 200 MT.</p>
            </div>
            <div className="form-actions">
              <button className="btn-pro" onClick={handleSubscribe} disabled={loading} style={{ flex: 1 }}>
                {loading ? "A processar..." : "Pagar 200 MT e ativar Pro"}
              </button>
              <button className="btn-cancel" onClick={() => { setShowForm(false); setError(""); }}>Cancelar</button>
            </div>
          </div>
        )}

        {/* Planos */}
        <div className="plans">
          {/* Gratuito */}
          <div className="plan-card">
            <div className="plan-name">Gratuito</div>
            <div className="plan-price">0 <span>MT/mês</span></div>
            <div className="plan-desc">Para começar e explorar a plataforma.</div>
            <ul className="features">
              <li className="feature">
                <div className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                3 propostas por mês
              </li>
              <li className="feature">
                <div className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                Perfil público
              </li>
              <li className="feature">
                <div className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                Mensagens e contratos
              </li>
              <li className="feature">
                <div className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                Pagamentos M-Pesa
              </li>
            </ul>
            {!isPro ? (
              <div className="active-badge">✓ Plano atual</div>
            ) : (
              <div className="btn-free">Plano Gratuito</div>
            )}
          </div>

          {/* Pro */}
          <div className="plan-card pro">
            <div className="popular-badge">⭐ Mais popular</div>
            <div className="plan-name" style={{ color: "#6366f1" }}>Pro</div>
            <div className="plan-price" style={{ color: "#6366f1" }}>200 <span>MT/mês</span></div>
            <div className="plan-desc">Para freelancers sérios que querem mais trabalho.</div>
            <ul className="features">
              <li className="feature">
                <div className="check pro"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                Propostas ilimitadas
              </li>
              <li className="feature">
                <div className="check pro"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                Badge Pro no perfil
              </li>
              <li className="feature">
                <div className="check pro"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                Perfil destacado nas pesquisas
              </li>
              <li className="feature">
                <div className="check pro"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                Tudo do plano gratuito
              </li>
            </ul>
            {isPro ? (
              <div className="active-badge">✓ Plano atual</div>
            ) : (
              <button className="btn-pro" onClick={() => { if (!user) { router.push("/login"); } else { setShowForm(true); } }}>
                Ativar Pro — 200 MT/mês
              </button>
            )}
          </div>
        </div>

        {/* Comissão */}
        <div className="commission-box">
          <div className="commission-title">💰 Comissão por transação</div>
          <div className="commission-row">
            <span style={{ color: "#6b7280" }}>Taxa de comissão</span>
            <span style={{ fontWeight: "700" }}>5%</span>
          </div>
          <div className="commission-row">
            <span style={{ color: "#6b7280" }}>Exemplo: cliente paga 5.000 MT</span>
            <span style={{ fontWeight: "700", color: "#10b981" }}>Freelancer recebe 4.750 MT</span>
          </div>
          <div className="commission-row">
            <span style={{ color: "#6b7280" }}>Plataforma recebe</span>
            <span style={{ fontWeight: "700", color: "#6366f1" }}>250 MT</span>
          </div>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "16px" }}>
            A comissão é aplicada automaticamente em todos os pagamentos via M-Pesa. O freelancer recebe sempre o valor já deduzido.
          </p>
        </div>
      </div>
    </>
  );
}
