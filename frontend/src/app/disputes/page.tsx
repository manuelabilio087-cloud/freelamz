"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

const REASONS = [
  "Trabalho nao entregue",
  "Qualidade abaixo do acordado",
  "Prazo nao cumprido",
  "Pagamento nao recebido",
  "Comunicacao interrompida",
  "Outro",
];

const STATUS_COLORS: any = {
  open: { bg: "#fef3c7", color: "#92400e", label: "Aberta" },
  resolved: { bg: "#ecfdf5", color: "#10b981", label: "Resolvida" },
  closed: { bg: "#f3f4f6", color: "#6b7280", label: "Fechada" },
};

export default function DisputesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [contractId, setContractId] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [dRes, cRes] = await Promise.all([
        fetch(`${API_URL}/disputes/my`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/contracts`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const dData = await dRes.json();
      const cData = await cRes.json();
      setDisputes(Array.isArray(dData) ? dData : []);
      setContracts(Array.isArray(cData) ? cData.filter((c: any) => c.status === "active") : []);
    } catch {}
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!contractId || !description.trim()) { setError("Preenche todos os campos."); return; }
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/disputes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ contract_id: Number(contractId), reason, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Erro ao abrir disputa.");
      } else {
        setSuccess("Disputa aberta com sucesso! A equipa Freelamz vai analisar em breve.");
        setShowForm(false);
        setContractId("");
        setDescription("");
        fetchData();
        setTimeout(() => setSuccess(""), 6000);
      }
    } catch {
      setError("Erro de conexao. Tenta novamente.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #f5f6fa; color: #1a1d27; }
        .container { max-width: 800px; margin: 0 auto; padding: 32px 24px; }
        .page-title { font-size: 26px; font-weight: 800; margin-bottom: 6px; }
        .page-sub { font-size: 15px; color: #6b7280; margin-bottom: 28px; }
        .card { background: #fff; border-radius: 20px; border: 1px solid #e8eaf0; padding: 28px; margin-bottom: 20px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .card-title { font-size: 17px; font-weight: 700; }
        .btn-new { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; }
        .btn-new:hover { opacity: 0.9; }
        .form-group { margin-bottom: 16px; }
        .form-label { font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px; color: #374151; }
        .form-input { width: 100%; padding: 12px 16px; border: 1.5px solid #e8eaf0; border-radius: 10px; font-size: 14px; outline: none; font-family: inherit; background: #fff; color: #1a1d27; }
        .form-input:focus { border-color: #6366f1; }
        .form-actions { display: flex; gap: 12px; margin-top: 20px; }
        .btn-submit { flex: 1; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 13px; border-radius: 10px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-cancel { padding: 13px 20px; border-radius: 10px; font-weight: 600; font-size: 14px; border: 1.5px solid #e8eaf0; background: #fff; color: #6b7280; cursor: pointer; }
        .alert { padding: 14px 18px; border-radius: 10px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
        .alert-success { background: #ecfdf5; color: #10b981; }
        .alert-error { background: #fef2f2; color: #ef4444; }
        .dispute-item { padding: 20px 0; border-bottom: 1px solid #f0f0f0; }
        .dispute-item:last-child { border-bottom: none; }
        .dispute-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .dispute-title { font-size: 15px; font-weight: 700; }
        .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .dispute-reason { font-size: 13px; color: #6366f1; font-weight: 600; margin-bottom: 6px; }
        .dispute-desc { font-size: 14px; color: #4b5563; line-height: 1.6; margin-bottom: 8px; }
        .dispute-resolution { background: #ecfdf5; border-left: 3px solid #10b981; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #065f46; margin-top: 10px; }
        .dispute-meta { font-size: 12px; color: #9ca3af; }
        .empty { text-align: center; padding: 48px; color: #6b7280; }
        @media (max-width: 640px) {
          .container { padding: 20px 16px !important; }
          .card { padding: 18px !important; border-radius: 14px !important; }
          .card-header { flex-wrap: wrap; gap: 10px; }
          .form-actions { flex-direction: column-reverse; }
          .dispute-top { flex-wrap: wrap; gap: 6px; }
        }
      `}</style>

      <Navbar />
      <div className="container">
        <div className="page-title">Disputas</div>
        <div className="page-sub">Abre uma disputa se tiveres algum problema com um contrato.</div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Formulario */}
        {showForm && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: "20px" }}>Nova Disputa</div>
            <div className="form-group">
              <label className="form-label">Contrato *</label>
              <select className="form-input" value={contractId} onChange={e => setContractId(e.target.value)}>
                <option value="">Seleciona um contrato activo...</option>
                {contracts.map((c: any) => (
                  <option key={c.id} value={c.id}>#{c.id} — {c.project_title || `Contrato ${c.id}`}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Motivo *</label>
              <select className="form-input" value={reason} onChange={e => setReason(e.target.value)}>
                {REASONS.map((r, i) => <option key={i} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Descricao detalhada *</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Descreve o problema com o maximo de detalhe possivel..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
            <div className="form-actions">
              <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "A enviar..." : "Abrir disputa"}
              </button>
              <button className="btn-cancel" onClick={() => { setShowForm(false); setError(""); }}>Cancelar</button>
            </div>
          </div>
        )}

        {/* Lista de disputas */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">As minhas disputas</div>
            {!showForm && (
              <button className="btn-new" onClick={() => setShowForm(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Nova disputa
              </button>
            )}
          </div>

          {loading ? (
            <div className="empty">A carregar...</div>
          ) : disputes.length === 0 ? (
            <div className="empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e8eaf0" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Nenhuma disputa encontrada.
            </div>
          ) : (
            disputes.map((d: any, i: number) => {
              const s = STATUS_COLORS[d.status] || STATUS_COLORS.open;
              return (
                <div key={i} className="dispute-item">
                  <div className="dispute-top">
                    <div className="dispute-title">{d.project_title || `Contrato #${d.contract_id}`}</div>
                    <span className="status-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div className="dispute-reason">{d.reason}</div>
                  <div className="dispute-desc">{d.description}</div>
                  {d.resolution && (
                    <div className="dispute-resolution">
                      <strong>Resolucao:</strong> {d.resolution}
                    </div>
                  )}
                  <div className="dispute-meta">
                    Aberta por {d.opened_by_name} · {new Date(d.created_at).toLocaleDateString("pt-PT")}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}