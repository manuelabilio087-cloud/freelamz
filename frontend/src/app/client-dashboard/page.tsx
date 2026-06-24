"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #f5f5f5 !important; }
        body { font-family: Inter, sans-serif; color: #404145; }
        a { text-decoration: none; color: inherit; }
        .navbar { background: #fff; border-bottom: 1px solid #e4e5e7; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 22px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .nav-right { display: flex; align-items: center; gap: 20px; font-size: 14px; }
        .btn-logout { background: none; border: 1px solid #e4e5e7; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; color: #74767e; }
        .btn-primary { background: #1dbf73; color: #fff; padding: 10px 20px; border-radius: 4px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; }
        .container { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
        .welcome { background: linear-gradient(135deg, #404145, #222325); color: #fff; border-radius: 16px; padding: 32px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; }
        .welcome h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
        .welcome p { font-size: 14px; opacity: 0.8; margin-bottom: 20px; }
        .welcome-emoji { font-size: 64px; }
        .btn-white { background: #fff; color: #404145; padding: 12px 24px; border-radius: 4px; font-weight: 700; border: none; cursor: pointer; font-size: 14px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
        .stat-card { background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e4e5e7; }
        .stat-value { font-size: 32px; font-weight: 700; color: #404145; margin-bottom: 4px; }
        .stat-label { font-size: 13px; color: #74767e; }
        .stat-icon { font-size: 28px; margin-bottom: 12px; }
        .tabs { display: flex; gap: 0; border-bottom: 2px solid #e4e5e7; margin-bottom: 24px; }
        .tab { padding: 12px 20px; font-size: 14px; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; color: #74767e; background: none; border-top: none; border-left: none; border-right: none; }
        .tab.active { color: #1dbf73; border-bottom-color: #1dbf73; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .section-title { font-size: 18px; font-weight: 700; color: #404145; }
        .projects-list { display: flex; flex-direction: column; gap: 12px; }
        .project-item { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; cursor: pointer; transition: box-shadow 0.2s; }
        .project-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .project-info { flex: 1; min-width: 0; }
        .project-title { font-weight: 600; font-size: 15px; margin-bottom: 6px; color: #404145; }
        .project-meta { font-size: 13px; color: #74767e; display: flex; gap: 12px; flex-wrap: wrap; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-open { background: #e8faf0; color: #1dbf73; }
        .badge-category { background: #f0f0f0; color: #74767e; }
        .project-budget { font-size: 18px; font-weight: 700; color: #404145; white-space: nowrap; }
        .quick-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
        .action-card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; text-align: center; }
        .action-card:hover { border-color: #1dbf73; box-shadow: 0 4px 12px rgba(29,191,115,0.15); }
        .action-icon { font-size: 32px; margin-bottom: 10px; }
        .action-title { font-weight: 600; font-size: 14px; color: #404145; }
        .action-desc { font-size: 12px; color: #74767e; margin-top: 4px; }
        .empty { text-align: center; padding: 48px; color: #74767e; background: #fff; border-radius: 12px; border: 1px solid #e4e5e7; }
        .empty-icon { font-size: 48px; margin-bottom: 12px; }
        .freelancers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .freelancer-card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .freelancer-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: #1dbf73; }
        .fl-avatar { width: 60px; height: 60px; border-radius: 50%; background: #1dbf73; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; font-weight: 700; margin: 0 auto 12px; }
        .fl-name { font-weight: 700; font-size: 15px; margin-bottom: 4px; }
        .fl-bio { font-size: 13px; color: #74767e; margin-bottom: 12px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .fl-skills { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 16px; }
        .skill-tag { background: #f0f0f0; color: #74767e; font-size: 11px; padding: 3px 8px; border-radius: 12px; }
        .btn-contact { width: 100%; padding: 10px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 13px; }
        @media (max-width: 768px) {
          .navbar { padding: 0 16px; }
          .container { padding: 20px 16px; }
          .welcome { flex-direction: column; gap: 16px; }
          .welcome-emoji { display: none; }
          .project-item { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="logo">Freelamz<span>.</span></Link>
        <div className="nav-right">
          <Link href="/projects" style={{color:"#74767e"}}>Projectos</Link>
          <Link href="/messages" style={{color:"#74767e"}}>Mensagens</Link>
          <button className="btn-primary" onClick={() => router.push("/projects/new")}>+ Publicar Projecto</button>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </nav>

      <div className="container">
        <div className="welcome">
          <div>
            <h1>Ola, {user?.name?.split(" ")[0] || "Cliente"}! 👋</h1>
            <p>Gere os teus projectos e encontra o talento certo para o teu negocio.</p>
            <button className="btn-white" onClick={() => router.push("/projects/new")}>
              + Publicar novo projecto
            </button>
          </div>
          <div className="welcome-emoji">🏢</div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">Projectos publicados</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">0</div>
            <div className="stat-label">Propostas recebidas</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">0</div>
            <div className="stat-label">Projectos concluidos</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">0 MT</div>
            <div className="stat-label">Total investido</div>
          </div>
        </div>

        <div className="tabs">
          {["overview","projects","freelancers"].map(t => (
            <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "overview" ? "Visao Geral" : t === "projects" ? "Meus Projectos" : "Encontrar Freelancers"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            <div className="quick-actions">
              {[
                {icon:"➕", title:"Publicar Projecto", desc:"Cria um novo projecto", path:"/projects/new"},
                {icon:"🔍", title:"Ver Projectos", desc:"Vê todos os projectos", path:"/projects"},
                {icon:"💬", title:"Mensagens", desc:"Fala com freelancers", path:"/messages"},
                {icon:"👥", title:"Freelancers", desc:"Encontra talento", path:"/client-dashboard"},
              ].map((a, i) => (
                <div key={i} className="action-card" onClick={() => { if(a.path === "/client-dashboard") setActiveTab("freelancers"); else router.push(a.path); }}>
                  <div className="action-icon">{a.icon}</div>
                  <div className="action-title">{a.title}</div>
                  <div className="action-desc">{a.desc}</div>
                </div>
              ))}
            </div>

            <div className="section-header">
              <span className="section-title">Os teus projectos</span>
              <button className="btn-primary" onClick={() => router.push("/projects/new")}>+ Novo</button>
            </div>
            <div className="projects-list">
              {loading ? (
                <div className="empty"><div className="empty-icon">⏳</div>A carregar...</div>
              ) : projects.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📋</div>
                  <p style={{marginBottom:"16px"}}>Ainda nao publicaste nenhum projecto.</p>
                  <button className="btn-primary" onClick={() => router.push("/projects/new")}>Publicar primeiro projecto</button>
                </div>
              ) : (
                projects.slice(0, 5).map((p, i) => (
                  <div key={i} className="project-item" onClick={() => router.push(`/projects/${p.id}`)}>
                    <div className="project-info">
                      <div className="project-title">{p.title}</div>
                      <div className="project-meta">
                        <span className="badge badge-category">{p.category || "Geral"}</span>
                        <span>Publicado recentemente</span>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                      <span className="badge badge-open">Aberto</span>
                      <span className="project-budget">{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === "projects" && (
          <>
            <div className="section-header">
              <span className="section-title">Todos os meus projectos ({projects.length})</span>
              <button className="btn-primary" onClick={() => router.push("/projects/new")}>+ Novo Projecto</button>
            </div>
            <div className="projects-list">
              {loading ? (
                <div className="empty"><div className="empty-icon">⏳</div>A carregar...</div>
              ) : projects.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📋</div>
                  <p>Ainda nao publicaste nenhum projecto.</p>
                </div>
              ) : (
                projects.map((p, i) => (
                  <div key={i} className="project-item" onClick={() => router.push(`/projects/${p.id}`)}>
                    <div className="project-info">
                      <div className="project-title">{p.title}</div>
                      <div className="project-meta">
                        <span>{p.category || "Geral"}</span>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                      <span className="badge badge-open">Aberto</span>
                      <span className="project-budget">{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === "freelancers" && (
          <>
            <div className="section-header">
              <span className="section-title">Freelancers disponíveis</span>
            </div>
            <FreelancersList router={router} />
          </>
        )}
      </div>
    </>
  );
}

function FreelancersList({ router }: { router: any }) {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/users/freelancers`)
      .then(r => r.json())
      .then(data => { setFreelancers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{textAlign:"center",padding:"48px",color:"#74767e"}}>⏳ A carregar freelancers...</div>;

  if (freelancers.length === 0) return (
    <div style={{textAlign:"center",padding:"48px",color:"#74767e",background:"#fff",borderRadius:"12px",border:"1px solid #e4e5e7"}}>
      <div style={{fontSize:"48px",marginBottom:"12px"}}>👥</div>
      <p>Nenhum freelancer registado ainda.</p>
    </div>
  );

  return (
    <div className="freelancers-grid">
      {freelancers.map((f, i) => (
        <div key={i} className="freelancer-card">
          <div className="fl-avatar">{f.name?.[0] || "F"}</div>
          <div className="fl-name">{f.name}</div>
          <div className="fl-bio">{f.bio || "Freelancer profissional em Mocambique"}</div>
          {f.skills && (
            <div className="fl-skills">
              {(Array.isArray(f.skills) ? f.skills : []).slice(0, 3).map((s: string, j: number) => (
                <span key={j} className="skill-tag">{s}</span>
              ))}
            </div>
          )}
          <button className="btn-contact" onClick={() => router.push("/messages")}>
            Contactar →
          </button>
        </div>
      ))}
    </div>
  );
}