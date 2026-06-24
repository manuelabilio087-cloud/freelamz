"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function ProjectDetail() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProposal, setShowProposal] = useState(false);
  const [proposal, setProposal] = useState({ cover_letter: "", price: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/projects/${params.id}`)
      .then(r => r.json())
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleProposal = async () => {
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const res = await fetch(`${API_URL}/projects/${params.id}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cover_letter: proposal.cover_letter, price: proposal.price }),
      });
      if (!res.ok) throw new Error("Erro ao enviar proposta");
      setSuccess(true);
      setShowProposal(false);
    } catch {
      setError("Erro ao enviar proposta. Tenta novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{fontFamily:"Inter,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",color:"#74767e"}}>
      ⏳ A carregar projecto...
    </div>
  );

  if (!project) return (
    <div style={{fontFamily:"Inter,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",color:"#74767e"}}>
      ❌ Projecto não encontrado
    </div>
  );

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #f9f9f9 !important; }
        body { font-family: Inter, sans-serif; color: #404145; }
        a { text-decoration: none; color: inherit; }
        .navbar { background: #fff; border-bottom: 1px solid #e4e5e7; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; }
        .logo { font-size: 22px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .back-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #404145; display: flex; align-items: center; gap: 6px; }
        .container { max-width: 1100px; margin: 0 auto; padding: 32px 24px; display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        .main { background: #fff; border-radius: 12px; padding: 32px; border: 1px solid #e4e5e7; }
        .sidebar { display: flex; flex-direction: column; gap: 16px; }
        .sidebar-card { background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e4e5e7; }
        .category-badge { display: inline-block; background: #e8faf0; color: #1dbf73; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; }
        .project-title { font-size: 26px; font-weight: 700; color: #404145; margin-bottom: 16px; line-height: 1.3; }
        .meta { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 24px; }
        .meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #74767e; }
        .divider { height: 1px; background: #e4e5e7; margin: 24px 0; }
        .section-title { font-size: 16px; font-weight: 700; color: #404145; margin-bottom: 12px; }
        .description { font-size: 14px; color: #404145; line-height: 1.7; white-space: pre-wrap; }
        .budget-amount { font-size: 32px; font-weight: 700; color: #404145; margin-bottom: 4px; }
        .budget-label { font-size: 13px; color: #74767e; margin-bottom: 20px; }
        .btn-proposal { width: 100%; padding: 14px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; margin-bottom: 12px; }
        .btn-message { width: 100%; padding: 14px; background: #fff; color: #404145; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; }
        .btn-message:hover { background: #f5f5f5; }
        .client-card { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 44px; height: 44px; border-radius: 50%; background: #1dbf73; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 18px; }
        .client-name { font-weight: 600; font-size: 15px; }
        .client-label { font-size: 12px; color: #74767e; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal { background: #fff; border-radius: 12px; padding: 32px; width: 100%; max-width: 520px; }
        .modal h2 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
        .modal p { font-size: 14px; color: #74767e; margin-bottom: 24px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #404145; margin-bottom: 6px; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 14px; outline: none; font-family: inherit; color: #404145; }
        .form-group input:focus, .form-group textarea:focus { border-color: #1dbf73; }
        .form-group textarea { resize: vertical; min-height: 120px; }
        .modal-btns { display: flex; gap: 12px; margin-top: 8px; }
        .btn-cancel { flex: 1; padding: 12px; background: #fff; color: #404145; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-submit { flex: 1; padding: 12px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .error { color: #e53e3e; font-size: 13px; margin-bottom: 12px; }
        .success-banner { background: #e8faf0; border: 1px solid #1dbf73; border-radius: 8px; padding: 16px; text-align: center; color: #1dbf73; font-weight: 600; margin-bottom: 16px; }
        @media (max-width: 768px) {
          .container { grid-template-columns: 1fr; }
          .navbar { padding: 12px 16px; }
          .main { padding: 20px; }
          .project-title { font-size: 20px; }
        }
      `}</style>

      <nav className="navbar">
        <button className="back-btn" onClick={() => router.back()}>← Voltar</button>
        <Link href="/" className="logo">Freelamz<span>.</span></Link>
        <Link href="/projects" style={{fontSize:"14px",color:"#74767e"}}>Ver todos</Link>
      </nav>

      <div className="container">
        <div className="main">
          <span className="category-badge">{project.category || "Geral"}</span>
          <h1 className="project-title">{project.title}</h1>
          <div className="meta">
            <span className="meta-item">📅 Publicado recentemente</span>
            <span className="meta-item">👤 {project.client_name || "Cliente"}</span>
            <span className="meta-item">💰 {project.budget ? `${Number(project.budget).toLocaleString()} MT` : "A negociar"}</span>
          </div>
          <div className="divider"></div>
          <p className="section-title">Descricao do projecto</p>
          <p className="description">{project.description}</p>

          {success && (
            <div style={{marginTop:"24px"}}>
              <div className="success-banner">✅ Proposta enviada com sucesso! O cliente vai contactar-te em breve.</div>
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="sidebar-card">
            <div className="budget-amount">{project.budget ? `${Number(project.budget).toLocaleString()} MT` : "A negociar"}</div>
            <div className="budget-label">Orcamento do projecto</div>

            {success ? (
              <div className="success-banner">✅ Proposta enviada!</div>
            ) : (
              <>
                <button className="btn-proposal" onClick={() => setShowProposal(true)}>
                  Enviar Proposta →
                </button>
                <button className="btn-message" onClick={() => router.push("/messages")}>
                  💬 Enviar Mensagem
                </button>
              </>
            )}
          </div>

          <div className="sidebar-card">
            <p className="section-title">Sobre o Cliente</p>
            <div className="client-card">
              <div className="avatar">{project.client_name?.[0] || "C"}</div>
              <div>
                <div className="client-name">{project.client_name || "Cliente"}</div>
                <div className="client-label">Cliente verificado ✅</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProposal && (
        <div className="modal-overlay" onClick={() => setShowProposal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Enviar Proposta</h2>
            <p>Explica porque es o candidato ideal para este projecto.</p>
            <div className="form-group">
              <label>Carta de apresentacao</label>
              <textarea placeholder="Ola! Tenho experiencia em... Posso entregar em... O meu preco e..." value={proposal.cover_letter} onChange={e => setProposal({...proposal, cover_letter: e.target.value})} />
            </div>
            <div className="form-group">
              <label>O teu preco (MZN)</label>
              <input type="number" placeholder="Ex: 3500" value={proposal.price} onChange={e => setProposal({...proposal, price: e.target.value})} />
            </div>
            {error && <p className="error">{error}</p>}
            <div className="modal-btns">
              <button className="btn-cancel" onClick={() => setShowProposal(false)}>Cancelar</button>
              <button className="btn-submit" disabled={!proposal.cover_letter || !proposal.price || submitting} onClick={handleProposal}>
                {submitting ? "A enviar..." : "Enviar Proposta →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}