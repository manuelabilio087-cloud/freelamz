"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function ProjectDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [project, setProject] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [proposalText, setProposalText] = useState("");
  const [proposalBudget, setProposalBudget] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    if (id) {
      loadProject();
      loadProposals();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`);
      const data = await res.json();
      setProject(data);
    } catch {}
    setLoading(false);
  };

  const loadProposals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/projects/${id}/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProposals(Array.isArray(data) ? data : []);
    } catch {}
  };

  const sendProposal = async () => {
    if (!proposalText.trim()) { setError("Escreve a tua proposta"); return; }
    setSending(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/projects/${id}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ description: proposalText, budget: proposalBudget }),
      });
      if (res.ok) {
        setSent(true);
        setProposalText("");
        setProposalBudget("");
        loadProposals();
      } else {
        const data = await res.json();
        setError(data.message || "Erro ao enviar proposta");
      }
    } catch {
      setError("Erro de conexao");
    }
    setSending(false);
  };

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontFamily:"Inter,sans-serif"}}>
      <div style={{textAlign:"center",color:"#74767e"}}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2" style={{animation:"spin 1s linear infinite",marginBottom:"16px"}}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <p>A carregar projecto...</p>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!project) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontFamily:"Inter,sans-serif",flexDirection:"column",gap:"16px"}}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e4e5e7" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      <p style={{color:"#74767e"}}>Projecto não encontrado</p>
      <button onClick={() => router.push("/projects")} style={{background:"#1dbf73",color:"#fff",padding:"10px 24px",border:"none",borderRadius:"4px",cursor:"pointer",fontWeight:"600"}}>Ver projectos</button>
    </div>
  );

  const isClient = user?.role === "client";
  const isOwner = user?.id === project.client_id;
  const isFreelancer = user?.role === "freelancer";

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #f5f5f5 !important; }
        body { font-family: Inter, sans-serif; color: #404145; }
        a { text-decoration: none; color: inherit; }
        .navbar { background: #fff; border-bottom: 1px solid #e4e5e7; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 22px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .nav-links { display: flex; align-items: center; gap: 20px; font-size: 14px; color: #74767e; }
        .container { max-width: 1100px; margin: 32px auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        .main { display: flex; flex-direction: column; gap: 20px; }
        .card { background: #fff; border-radius: 16px; border: 1px solid #e4e5e7; padding: 28px; }
        .breadcrumb { font-size: 13px; color: #74767e; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .breadcrumb a { color: #1dbf73; }
        .project-title { font-size: 24px; font-weight: 700; margin-bottom: 12px; line-height: 1.3; }
        .meta-row { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; }
        .meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #74767e; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-open { background: #e8faf0; color: #1dbf73; }
        .badge-cat { background: #f0f0f0; color: #74767e; }
        .desc-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #404145; }
        .desc-text { font-size: 14px; color: #74767e; line-height: 1.8; white-space: pre-wrap; }
        .section-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .proposal-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #404145; }
        .form-group textarea { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit; resize: vertical; min-height: 120px; color: #404145; }
        .form-group textarea:focus { border-color: #1dbf73; }
        .form-group input { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 8px; font-size: 14px; outline: none; color: #404145; }
        .form-group input:focus { border-color: #1dbf73; }
        .btn-primary { background: #1dbf73; color: #fff; padding: 14px 28px; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; width: 100%; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary:hover { background: #0fa85c; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-msg { color: #e53e3e; font-size: 13px; padding: 10px; background: #fff5f5; border-radius: 6px; border: 1px solid #fed7d7; }
        .success-msg { color: #1dbf73; font-size: 14px; padding: 12px; background: #f0fdf8; border-radius: 6px; border: 1px solid #c8f0dc; display: flex; align-items: center; gap: 8px; font-weight: 600; }
        .proposals-list { display: flex; flex-direction: column; gap: 16px; }
        .proposal-item { padding: 20px; border: 1px solid #e4e5e7; border-radius: 12px; background: #fafafa; }
        .proposal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .proposal-author { display: flex; align-items: center; gap: 10px; }
        .author-avatar { width: 36px; height: 36px; border-radius: 50%; background: #1dbf73; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .author-name { font-weight: 600; font-size: 14px; }
        .author-date { font-size: 12px; color: #74767e; }
        .proposal-budget { font-size: 18px; font-weight: 700; color: #1dbf73; }
        .proposal-text { font-size: 14px; color: #74767e; line-height: 1.6; margin-top: 10px; }
        .btn-contact { background: #fff; color: #1dbf73; border: 1.5px solid #1dbf73; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 12px; }
        .btn-contact:hover { background: #f0fdf8; }
        .sidebar { display: flex; flex-direction: column; gap: 20px; }
        .client-card { text-align: center; }
        .client-avatar { width: 56px; height: 56px; border-radius: 50%; background: #404145; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; font-weight: 700; margin: 0 auto 12px; }
        .client-name { font-weight: 700; font-size: 16px; margin-bottom: 4px; }
        .client-label { font-size: 12px; color: #74767e; margin-bottom: 16px; }
        .budget-card { text-align: center; }
        .budget-amount { font-size: 36px; font-weight: 700; color: #404145; margin-bottom: 4px; }
        .budget-label { font-size: 13px; color: #74767e; margin-bottom: 4px; }
        .deadline { font-size: 13px; color: #74767e; }
        .empty-proposals { text-align: center; padding: 32px; color: #74767e; }
        .login-prompt { text-align: center; padding: 24px; color: #74767e; }
        .login-prompt a { color: #1dbf73; font-weight: 600; }
        @media (max-width: 900px) {
          .container { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .navbar { padding: 0 16px; }
          .container { padding: 0 16px; margin: 20px auto; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="logo">Freelamz<span>.</span></Link>
        <div className="nav-links">
          <Link href="/projects">Projectos</Link>
          {user && <Link href={user.role === "client" ? "/client-dashboard" : "/dashboard"}>Dashboard</Link>}
          {user && <Link href="/messages">Mensagens</Link>}
          {!user && <Link href="/login" style={{color:"#1dbf73",fontWeight:"600"}}>Entrar</Link>}
        </div>
      </nav>

      <div className="container">
        <div className="main">
          {/* DETALHES DO PROJECTO */}
          <div className="card">
            <div className="breadcrumb">
              <Link href="/projects">← Projectos</Link>
              <span>/</span>
              <span>{project.category || "Geral"}</span>
            </div>

            <h1 className="project-title">{project.title}</h1>

            <div className="meta-row">
              <span className="badge badge-open">Aberto</span>
              <span className="badge badge-cat">{project.category || "Geral"}</span>
              <div className="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#74767e" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Publicado recentemente
              </div>
              <div className="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#74767e" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {proposals.length} proposta{proposals.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="desc-title">Descrição do projecto</div>
            <p className="desc-text">{project.description || "Sem descrição disponível."}</p>
          </div>

          {/* ENVIAR PROPOSTA — só freelancers */}
          {isFreelancer && !sent && (
            <div className="card">
              <div className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Enviar Proposta
              </div>
              <div className="proposal-form">
                <div className="form-group">
                  <label>A tua proposta</label>
                  <textarea
                    value={proposalText}
                    onChange={e => setProposalText(e.target.value)}
                    placeholder="Descreve como podes ajudar neste projecto, a tua experiência relevante e o teu plano de trabalho..."
                  />
                </div>
                <div className="form-group">
                  <label>O teu orçamento (MT)</label>
                  <input
                    type="number"
                    value={proposalBudget}
                    onChange={e => setProposalBudget(e.target.value)}
                    placeholder="Ex: 5000"
                  />
                </div>
                {error && <div className="error-msg">{error}</div>}
                <button className="btn-primary" onClick={sendProposal} disabled={sending}>
                  {sending ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      A enviar...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      Enviar Proposta
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {sent && (
            <div className="card">
              <div className="success-msg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Proposta enviada com sucesso! O cliente vai contactar-te em breve.
              </div>
            </div>
          )}

          {!user && (
            <div className="card">
              <div className="login-prompt">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e4e5e7" strokeWidth="1.5" style={{marginBottom:"12px"}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <p style={{marginBottom:"12px"}}>Faz login para enviar uma proposta</p>
                <Link href="/login"><button className="btn-primary" style={{width:"auto",padding:"10px 24px"}}>Entrar</button></Link>
              </div>
            </div>
          )}

          {/* PROPOSTAS — só o dono do projecto vê */}
          {(isOwner || (isClient && project.client_id === user?.id)) && (
            <div className="card">
              <div className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Propostas recebidas ({proposals.length})
              </div>
              <div className="proposals-list">
                {proposals.length === 0 ? (
                  <div className="empty-proposals">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e4e5e7" strokeWidth="1.5" style={{marginBottom:"12px"}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <p>Ainda não há propostas.</p>
                  </div>
                ) : (
                  proposals.map((p, i) => (
                    <div key={i} className="proposal-item">
                      <div className="proposal-header">
                        <div className="proposal-author">
                          <div className="author-avatar">{p.freelancer_name?.[0] || "F"}</div>
                          <div>
                            <div className="author-name">{p.freelancer_name || "Freelancer"}</div>
                            <div className="author-date">{new Date(p.created_at).toLocaleDateString("pt-PT")}</div>
                          </div>
                        </div>
                        {p.budget && <div className="proposal-budget">{Number(p.budget).toLocaleString()} MT</div>}
                      </div>
                      <p className="proposal-text">{p.description}</p>
                      <button className="btn-contact" onClick={() => router.push("/messages")}>
                        💬 Contactar freelancer
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="card budget-card">
            <div className="budget-amount">
              {project.budget ? `${Number(project.budget).toLocaleString()} MT` : "A negociar"}
            </div>
            <div className="budget-label">Orçamento do projecto</div>
            {project.deadline && (
              <div className="deadline">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#74767e" strokeWidth="2" style={{marginRight:"4px"}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Prazo: {new Date(project.deadline).toLocaleDateString("pt-PT")}
              </div>
            )}
          </div>

          <div className="card client-card">
            <div className="client-avatar">{project.client_name?.[0] || "C"}</div>
            <div className="client-name">{project.client_name || "Cliente"}</div>
            <div className="client-label">Cliente</div>
            {user && !isOwner && (
              <button className="btn-primary" onClick={() => router.push("/messages")} style={{fontSize:"14px"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Contactar cliente
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}