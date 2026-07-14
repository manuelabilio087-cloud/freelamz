"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Payments() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    contract_id: "",
    amount: "",
    mpesa_number: "",
    description: "",
  });

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [contractsRes, paymentsRes, summaryRes] = await Promise.all([
        fetch(`${API_URL}/contracts/my`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/payments/my`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/payments/summary`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const cData = await contractsRes.json();
      const pData = await paymentsRes.json();
      const sData = await summaryRes.json();
      setContracts(Array.isArray(cData) ? cData.filter((c: any) => c.status === 'active') : []);
      setPayments(Array.isArray(pData) ? pData : []);
      setSummary(sData);
    } catch {}
    setLoading(false);
  };

  const handlePay = async () => {
    if (!form.contract_id || !form.amount || !form.mpesa_number) {
      setError("Preenche todos os campos obrigatórios.");
      return;
    }
    setPaying(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/payments/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Erro ao processar pagamento.");
      } else {
        setSuccess(`Pagamento de ${Number(form.amount).toLocaleString()} MZN efectuado! ID: ${data.transaction_id}`);
        setShowForm(false);
        setForm({ contract_id: "", amount: "", mpesa_number: "", description: "" });
        loadData();
        setTimeout(() => setSuccess(""), 6000);
      }
    } catch {
      setError("Erro de conexão. Tenta novamente.");
    }
    setPaying(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#ecfdf5', color: '#10b981', label: 'Concluído' };
      case 'pending': return { bg: '#fffbeb', color: '#f59e0b', label: 'Pendente' };
      case 'failed': return { bg: '#fef2f2', color: '#ef4444', label: 'Falhado' };
      default: return { bg: '#f5f6fa', color: '#6b7280', label: status };
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #f5f6fa; color: #1a1d27; }
        a { text-decoration: none; color: inherit; }
        
        .logo { font-size: 22px; font-weight: 700; }
        .logo span { color: #6366f1; }
        .container { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .page-title { font-size: 24px; font-weight: 700; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 12px 24px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; transition: opacity 0.2s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-outline { background: #fff; color: #6b7280; padding: 12px 24px; border-radius: 10px; font-weight: 600; border: 1.5px solid #e8eaf0; cursor: pointer; font-size: 14px; }
        .btn-outline:hover { border-color: #6366f1; color: #6366f1; }

        /* Summary */
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 28px; }
        .summary-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e8eaf0; }
        .summary-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .summary-value { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
        .summary-label { font-size: 13px; color: #6b7280; }

        /* Form */
        .form-card { background: #fff; border-radius: 16px; border: 1px solid #e8eaf0; padding: 28px; margin-bottom: 28px; }
        .form-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { font-size: 13px; font-weight: 600; color: #1a1d27; }
        .form-input { padding: 12px 16px; border: 1.5px solid #e8eaf0; border-radius: 10px; font-size: 14px; outline: none; font-family: inherit; color: #1a1d27; background: #fff; transition: border-color 0.2s; }
        .form-input:focus { border-color: #6366f1; }
        .form-select { padding: 12px 16px; border: 1.5px solid #e8eaf0; border-radius: 10px; font-size: 14px; outline: none; font-family: inherit; color: #1a1d27; background: #fff; cursor: pointer; }
        .form-select:focus { border-color: #6366f1; }
        .form-hint { font-size: 12px; color: #6b7280; margin-top: 4px; }
        .mpesa-badge { display: inline-flex; align-items: center; gap: 6px; background: #ecfdf5; color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }

        /* Payments List */
        .payments-card { background: #fff; border-radius: 16px; border: 1px solid #e8eaf0; overflow: hidden; }
        .card-header { padding: 20px 24px; border-bottom: 1px solid #e8eaf0; font-weight: 700; font-size: 16px; }
        .payment-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; padding: 16px 24px; border-bottom: 1px solid #f0f0f0; align-items: center; font-size: 14px; }
        .payment-row:last-child { border-bottom: none; }
        .payment-row:hover { background: #f9f9f9; }
        .payment-header { background: #f8f9fc; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .empty { text-align: center; padding: 48px; color: #6b7280; }
        .alert { padding: 14px 18px; border-radius: 10px; font-size: 14px; font-weight: 600; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .alert-success { background: #ecfdf5; color: #10b981; }
        .alert-error { background: #fef2f2; color: #ef4444; }

        @media (max-width: 768px) {
          .summary-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }

          .container { padding: 20px 16px; }
          .page-header { flex-wrap: wrap; gap: 12px; }
          .form-card { padding: 18px; }
          .payment-row { grid-template-columns: 1fr; gap: 6px; padding: 16px; text-align: left; }
          .payment-header { display: none; }
          .payment-row > div, .payment-row > span { width: 100%; }
        }
      `}</style>

      <Navbar />

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">💰 Pagamentos M-Pesa</h1>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Novo Pagamento
            </button>
        </div>

        {/* Alertas */}
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

        {/* Resumo Financeiro */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon" style={{ background: "#ecfdf5" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div className="summary-value" style={{ color: "#10b981" }}>{summary ? `${Number(summary.received).toLocaleString()} MT` : "—"}</div>
            <div className="summary-label">Total Recebido</div>
          </div>
          <div className="summary-card">
            <div className="summary-icon" style={{ background: "#eef2ff" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div className="summary-value" style={{ color: "#6366f1" }}>{summary ? `${Number(summary.sent).toLocaleString()} MT` : "—"}</div>
            <div className="summary-label">Total Enviado</div>
          </div>
          <div className="summary-card">
            <div className="summary-icon" style={{ background: "#fffbeb" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div className="summary-value" style={{ color: "#f59e0b" }}>{summary ? `${Number(summary.pending).toLocaleString()} MT` : "—"}</div>
            <div className="summary-label">Pendente</div>
          </div>
        </div>

        {/* Formulário de Pagamento */}
        {showForm && (
          <div className="form-card">
            <div className="form-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Pagar via M-Pesa
            </div>

            <div className="mpesa-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Pagamento seguro via M-Pesa Moçambique
            </div>

            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Contrato *</label>
                <select className="form-select" value={form.contract_id} onChange={e => setForm({ ...form, contract_id: e.target.value })}>
                  <option value="">Selecciona um contrato activo</option>
                  {contracts.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.project_title} — {c.freelancer_name}</option>
                  ))}
                </select>
                {contracts.length === 0 && <p className="form-hint">Não tens contratos activos. Assina um contrato primeiro.</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Valor (MZN) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Ex: 5000"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Número M-Pesa *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Ex: 841234567"
                  value={form.mpesa_number}
                  onChange={e => setForm({ ...form, mpesa_number: e.target.value })}
                  maxLength={9}
                />
                <p className="form-hint">Começa com 84, 85, 86 ou 87</p>
              </div>

              <div className="form-group full">
                <label className="form-label">Descrição</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Pagamento milestone 1 — Design do logótipo"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-primary" onClick={handlePay} disabled={paying}>
                {paying ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    A processar...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    Pagar agora
                  </>
                )}
              </button>
              <button className="btn-outline" onClick={() => { setShowForm(false); setError(""); }}>Cancelar</button>
            </div>
          </div>
        )}

        {/* Histórico de Pagamentos */}
        <div className="payments-card">
          <div className="card-header">Histórico de Pagamentos ({payments.length})</div>
          <div className="payment-row payment-header">
            <span>Projecto</span>
            <span>De / Para</span>
            <span>Valor</span>
            <span>M-Pesa ID</span>
            <span>Estado</span>
          </div>
          {loading ? (
            <div className="empty">A carregar...</div>
          ) : payments.length === 0 ? (
            <div className="empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e8eaf0" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
                <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <p>Ainda não tens pagamentos.</p>
            </div>
          ) : (
            payments.map((p: any, i: number) => {
              const status = getStatusStyle(p.status);
              const isReceiver = p.receiver_id === user?.id;
              return (
                <div key={i} className="payment-row">
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{p.project_title}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{new Date(p.created_at).toLocaleDateString("pt-PT")}</div>
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>
                    {isReceiver ? `De: ${p.payer_name}` : `Para: ${p.receiver_name}`}
                  </div>
                  <div style={{ fontWeight: "700", color: isReceiver ? "#10b981" : "#1a1d27" }}>
                    {isReceiver ? "+" : "-"}{Number(p.amount).toLocaleString()} MT
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", fontFamily: "monospace" }}>
                    {p.mpesa_transaction_id ? p.mpesa_transaction_id.substring(0, 12) + "..." : "—"}
                  </div>
                  <span className="badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
