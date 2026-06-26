"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [myPlan, setMyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);
      fetchMyPlan();
    }
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`);
      const data = await res.json();
      setProject(data);
    } catch {}
    setLoading(false);
  };

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

  const handleSubmitProposal = async () => {
    if (!user) { router.push("/login"); return; }
    if (!coverLetter.trim() || !price) { setError("Preenche todos os campos."); return; }
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ project_id: id, cover_letter: coverLetter, price: Number(price) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Erro ao enviar proposta.");
      } else {
        setSuccess("Proposta enviada com sucesso!");
        setShowForm(false);
        setCoverLetter("");
        setPrice("");
        fetchMyPlan();
      }
    } catch {
      setError("Erro de conexao. Tenta novamente.");
    }
    setSubmitting(false);
  };

  const canSendProposal = myPlan?.can_send_proposal !== false;
  const isPro = myPlan?.plan === "pro";
  const proposalsUsed = myPlan?.proposals_used || 0;
  const proposalsLimit = myPlan?.proposals_limit || 3;

  if (loading) return <div style={{ textAlign: "center", padding: "80px", fontFamily: "Inter, sans-serif", color: "#6b7280" }}>A carregar...</div>;
  if (!project) return <div style={{ textAlign: "center", padding: "80px", fontFamily: "Inter, sans-serif", color: "#6b7280" }}>Projecto nao encontrado.</div>;

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #f5f6fa; color: #1a1d27; }
        a { text-decoration: none; color: inherit; }
        .container { max-width: 800px; margin: 0 auto; padding: 32px 24px; }
        .back { display: inline-flex; align-items: center; gap: 6px; color: #6b7280; font-size: 14px; margin-bottom: 24px; cursor: pointer; }
        .back:hover { color: #6366f1; }
        .card { background: #fff; border-radius: 20px; border: 1px solid #e8eaf0; padding: 36px; margin-bottom: 24px; }
        .category-badge { display: inline-block; background: #eef2ff; color: #6366f1; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
        .project-title { font-size: 26px; font-weight: 800; margin-bottom: 12px; }
        .budget { font-size: 28px; font-weight: 800; color: #6366f1; margin-bottom: 20px; }
        .meta { display: flex; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
        .meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #6b7280; }
        .desc { font-size: 15px; color: #4b5563; line-height: 1.8; }
        .divider { border: none; border-top: 1px solid #e8eaf0; margin: 24px 0; }
        .proposal-box { background: #fff; border-radius: 20px; border: 1px solid #e8eaf0; padding: 28px; margin-bottom: 24px; }
        .proposal-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
        .plan-info { display: flex; align-items: center; justify-content: space-between; background: #f5f6fa; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; font-size: 14px; }
        .plan-badge { font-weight: 700; color: #6366f1; }
        .limit-box { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
        .limit-title { font-size: 15px; font-weight: 700; color: #92400e; margin-bottom: 6px; }
        .limit-desc { font-size: 13px; color: #92400e; margin-bottom: 14px; }
        .btn-upgrade { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none; }
        .form-group { margin-bottom: 16px; }
        .form-label { font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px; }
        .form-input { width: 100%; padding: 12px 16px; border: 1.5px solid #e8eaf0; border-radius: 10px; font-size: 14px; outline: none; font-family: inherit; resize: vertical; }
        .form-input:focus { border-color: #6366f1; }
        .btn-send { width: 100%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; margin-top: 8px; }
        .btn-send:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-open { width: 100%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; }
        .btn-login { width: 100%; background: #f5f6fa; color: #1a1d27; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; border: 1.5px solid #e8eaf0; cursor: pointer; }
        .alert { padding: 14px 18px; border-radius: 10px; font-size: 14px; font-weight: 600; margin-bottom: 16px; }
        .alert-success { background: #ecfdf5; color: #10b981; }
        .alert-error { background: #fef2f2; color: #ef4444; }
        @media (max-width: 640px) { .container { padding: 20px 16px; } .card { padding: 24px; } .project-title { font-size: 20px; } }
      `}</style>

      <div className="container">
        <div className="back" onClick={() => router.push("/projects")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar aos projectos
        </div>

        <div className="card">
          <span className="category-badge">{project.category || "Geral"}</span>
          <h1 className="project-title">{project.title}</h1>
          <div className="budget">{project.budget ? `${Number(project.budget).toLocaleString()} MT` : "A negociar"}</div>
          <div className="meta">
            <div className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              {project.client_name || "Cliente"}
            </div>
            <div className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {new Date(project.created_at).toLocaleDateString("pt-PT")}
            </div>
          </div>
          <hr className="divider" />
          <p className="desc">{project.description}</p>
        </div>

        <div className="proposal-box">
          <div className="proposal-title">Enviar proposta</div>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {!user ? (
            <button className="btn-login" onClick={() => router.push("/login")}>Entra para enviar proposta</button>
          ) : user.role === "client" ? (
            <p style={{ fontSize: "14px", color: "#6b7280" }}>Apenas freelancers podem enviar propostas.</p>
          ) : (
            <>
              {myPlan && (
                <div className="plan-info">
                  <span>Plano: <span className="plan-badge">{myPlan.plan_name}</span></span>
                  {isPro
                    ? <span style={{ fontSize: "13px", color: "#6366f1", fontWeight: "600" }}>Propostas ilimitadas</span>
                    : <span style={{ fontSize: "13px", color: "#6b7280" }}>{proposalsUsed}/{proposalsLimit} propostas este mes</span>
                  }
                </div>
              )}

              {!canSendProposal ? (
                <div className="limit-box">
                  <div className="limit-title">Limite de propostas atingido</div>
                  <div className="limit-desc">Usaste as 3 propostas gratuitas deste mes. Faz upgrade para Pro e envia propostas ilimitadas por apenas 200 MT/mes.</div>
                  <a href="/pricing" className="btn-upgrade">Ver Plano Pro</a>
                </div>
              ) : !showForm ? (
                <button className="btn-open" onClick={() => setShowForm(true)}>Enviar proposta</button>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Carta de apresentacao *</label>
                    <textarea className="form-input" rows={5} placeholder="Descreve a tua experiencia e porque es o ideal para este projecto..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">O teu preco (MT) *</label>
                    <input type="number" className="form-input" placeholder="Ex: 5000" value={price} onChange={e => setPrice(e.target.value)} />
                  </div>
                  <button className="btn-send" onClick={handleSubmitProposal} disabled={submitting}>
                    {submitting ? "A enviar..." : "Confirmar proposta"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}