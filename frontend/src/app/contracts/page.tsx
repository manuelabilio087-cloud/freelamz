"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReviewModal from "../../components/ReviewModal";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function ContractsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [reviewTarget, setReviewTarget] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) { const parsed = JSON.parse(u); setUser(parsed); loadContracts(parsed); }
    else { router.push("/login"); }
  }, []);

  const loadContracts = async (u?: any) => {
    const current = u || JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/contracts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setContracts(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  const isClient = user?.role === "client";

  const filtered = contracts.filter(c => {
    if (filter === "all") return true;
    if (filter === "active") return c.status === "in_progress";
    if (filter === "completed") return c.status === "closed";
    return true;
  });

  const statusCfg: any = {
    in_progress: { label: "Em andamento", bg: "#eef2ff", col: "#4f46e5", icon: "ti-loader" },
    closed:      { label: "Concluido",   bg: "#ecfdf5", col: "#059669", icon: "ti-circle-check" },
    open:        { label: "Aberto",      bg: "#fffbeb", col: "#d97706", icon: "ti-clock" },
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: "center" }}>
        <i className="ti ti-loader" style={{ fontSize: "32px", color: "#6366f1", animation: "spin 1s linear infinite" }} aria-hidden="true"></i>
        <p style={{ marginTop: "12px", color: "#6b7280", fontSize: "14px" }}>A carregar contratos...</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Inter,-apple-system,sans-serif;background:#f4f5f7;color:#111827}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade{animation:fadeIn .25s ease}
        .wrap{max-width:1000px;margin:0 auto;padding:28px 24px}
        .page-title{font-size:24px;font-weight:800;color:#111827;letter-spacing:-.5px;margin-bottom:6px}
        .page-sub{font-size:14px;color:#9ca3af;margin-bottom:24px}
        .filters{display:flex;gap:8px;margin-bottom:24px}
        .filter-btn{padding:7px 14px;border-radius:20px;font-size:13px;font-weight:600;border:1.5px solid #e8eaed;background:#fff;color:#6b7280;cursor:pointer;font-family:inherit;transition:all .15s}
        .filter-btn:hover{border-color:#6366f1;color:#6366f1}
        .filter-btn.active{background:#6366f1;color:#fff;border-color:#6366f1}
        .contract-card{background:#fff;border:1.5px solid #e8eaed;border-radius:14px;padding:20px;margin-bottom:14px;transition:border-color .15s,box-shadow .15s}
        .contract-card:hover{border-color:#c7d2fe;box-shadow:0 4px 12px rgba(99,102,241,.06)}
        .contract-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:14px}
        .contract-title{font-size:16px;font-weight:700;color:#111827;cursor:pointer;transition:color .15s}
        .contract-title:hover{color:#6366f1}
        .contract-meta{display:flex;flex-wrap:wrap;gap:14px;margin-top:6px}
        .meta-it{display:flex;align-items:center;gap:5px;font-size:12px;color:#6b7280}
        .meta-it i{font-size:14px;color:#9ca3af}
        .meta-it strong{color:#374151}
        .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600}
        .badge i{font-size:12px}
        .party{display:flex;align-items:center;gap:10px;padding:12px;background:#f8f9fc;border-radius:10px;margin-top:14px}
        .party-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:700}
        .party-name{font-size:13px;font-weight:700;color:#111827}
        .party-role{font-size:11px;color:#9ca3af}
        .actions{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}
        .btn-sm{padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px;transition:all .15s;border:none}
        .btn-sm i{font-size:14px}
        .btn-primary-sm{background:#6366f1;color:#fff}
        .btn-primary-sm:hover{opacity:.88}
        .btn-success-sm{background:#10b981;color:#fff}
        .btn-success-sm:hover{background:#059669}
        .btn-outline-sm{background:#fff;color:#6b7280;border:1.5px solid #e8eaed}
        .btn-outline-sm:hover{border-color:#6366f1;color:#6366f1}
        .reviewed-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:#ecfdf5;color:#059669;border-radius:20px;font-size:11px;font-weight:600;border:1px solid #6ee7b7}
        .reviewed-badge i{font-size:13px}
        .empty{text-align:center;padding:60px 20px;color:#9ca3af}
        .empty i{font-size:48px;display:block;margin-bottom:16px}
        @media(max-width:600px){.wrap{padding:16px}.contract-top{flex-direction:column;gap:8px}}
      `}</style>

      {reviewTarget && (
        <ReviewModal
          isOpen={!!reviewTarget}
          onClose={() => setReviewTarget(null)}
          freelancerId={reviewTarget.freelancer_id}
          freelancerName={reviewTarget.freelancer_name}
          projectId={reviewTarget.project_id}
          projectTitle={reviewTarget.project_title}
          onSuccess={() => loadContracts()}
        />
      )}

      <div className="wrap fade">
        <h1 className="page-title">Meus contratos</h1>
        <p className="page-sub">Gerencia os teus projetos em andamento e concluidos</p>

        <div className="filters">
          {[
            {id:"all",       label:"Todos"},
            {id:"active",    label:"Em andamento"},
            {id:"completed", label:"Concluidos"},
          ].map(f => (
            <button key={f.id} className={`filter-btn ${filter===f.id?"active":""}`} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <i className="ti ti-inbox-off" aria-hidden="true"></i>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Nenhum contrato encontrado</p>
            <p style={{ fontSize: "13px" }}>{isClient ? "Publica um projecto para comecar." : "Envia propostas para encontrar trabalho."}</p>
          </div>
        ) : (
          filtered.map((c, i) => {
            const st = statusCfg[c.status] || statusCfg.open;
            const otherParty = isClient ? {
              name: c.freelancer_name, role: "Freelancer", id: c.freelancer_id,
            } : {
              name: c.client_name, role: "Cliente", id: c.client_id,
            };

            return (
              <div key={i} className="contract-card fade">
                <div className="contract-top">
                  <div style={{ minWidth: 0 }}>
                    <div className="contract-title" onClick={() => router.push(`/projects/${c.project_id}`)}>
                      {c.project_title}
                    </div>
                    <div className="contract-meta">
                      <span className="meta-it"><i className="ti ti-currency-dollar" aria-hidden="true"></i> <strong>{c.price ? `${Number(c.price).toLocaleString()} MT` : "A negociar"}</strong></span>
                      <span className="meta-it"><i className="ti ti-calendar" aria-hidden="true"></i> {c.delivery || "Prazo a definir"}</span>
                      <span className="meta-it"><i className="ti ti-clock" aria-hidden="true"></i> {new Date(c.created_at).toLocaleDateString("pt-PT")}</span>
                    </div>
                  </div>
                  <span className="badge" style={{ background: st.bg, color: st.col, flexShrink: 0 }}>
                    <i className={`ti ${st.icon}`} aria-hidden="true"></i> {st.label}
                  </span>
                </div>

                <div className="party">
                  <div className="party-av">{otherParty.name?.[0]}</div>
                  <div>
                    <div className="party-name">{otherParty.name}</div>
                    <div className="party-role">{otherParty.role}</div>
                  </div>
                </div>

                <div className="actions">
                  <button className="btn-sm btn-outline-sm" onClick={() => router.push(`/messages?to=${otherParty.id}`)}>
                    <i className="ti ti-message-circle" aria-hidden="true"></i> Mensagem
                  </button>
                  <button className="btn-sm btn-outline-sm" onClick={() => router.push(`/projects/${c.project_id}`)}>
                    <i className="ti ti-file-text" aria-hidden="true"></i> Ver projecto
                  </button>

                  {isClient && c.status === "closed" && (
                    c.reviewed ? (
                      <span className="reviewed-badge">
                        <i className="ti ti-circle-check" aria-hidden="true"></i> Ja avaliado
                      </span>
                    ) : (
                      <button className="btn-sm btn-success-sm" onClick={() => setReviewTarget({
                        freelancer_id: c.freelancer_id,
                        freelancer_name: c.freelancer_name,
                        project_id: c.project_id,
                        project_title: c.project_title,
                      })}>
                        <i className="ti ti-star" aria-hidden="true"></i> Avaliar
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}