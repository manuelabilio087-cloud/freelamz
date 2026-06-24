"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const IconBriefcase = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const IconMessage = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconStar = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconDollar = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IconSearch = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconUser = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconPlus = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconRocket = () => <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;

export default function Dashboard() {
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
      const res = await fetch(`${API_URL}/projects`);
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
        .avatar-btn { width: 36px; height: 36px; border-radius: 50%; background: #1dbf73; color: #fff; font-weight: 700; border: none; cursor: pointer; font-size: 14px; }
        .btn-logout { background: none; border: 1px solid #e4e5e7; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; color: #74767e; }
        .btn-logout:hover { background: #f5f5f5; }
        .container { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
        .welcome { background: linear-gradient(135deg, #1dbf73, #0fa85c); color: #fff; border-radius: 16px; padding: 32px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; }
        .welcome h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
        .welcome p { font-size: 14px; opacity: 0.9; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
        .stat-card { background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e4e5e7; }
        .stat-value { font-size: 32px; font-weight: 700; color: #404145; margin-bottom: 4px; }
        .stat-label { font-size: 13px; color: #74767e; }
        .stat-icon { margin-bottom: 12px; }
        .tabs { display: flex; gap: 0; border-bottom: 2px solid #e4e5e7; margin-bottom: 24px; }
        .tab { padding: 12px 20px; font-size: 14px; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; color: #74767e; background: none; border-top: none; border-left: none; border-right: none; }
        .tab.active { color: #1dbf73; border-bottom-color: #1dbf73; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .section-title { font-size: 18px; font-weight: 700; color: #404145; }
        .btn-primary { background: #1dbf73; color: #fff; padding: 10px 20px; border-radius: 4px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; }
        .projects-list { display: flex; flex-direction: column; gap: 12px; }
        .project-item { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; transition: box-shadow 0.2s; cursor: pointer; }
        .project-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .project-info { flex: 1; min-width: 0; }
        .project-title { font-weight: 600; font-size: 15px; margin-bottom: 4px; color: #404145; }
        .project-meta { font-size: 13px; color: #74767e; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-open { background: #e8faf0; color: #1dbf73; }
        .badge-category { background: #f0f0f0; color: #74767e; }
        .project-budget { font-size: 18px; font-weight: 700; color: #404145; white-space: nowrap; }
        .quick-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
        .action-card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; text-align: center; }
        .action-card:hover { border-color: #1dbf73; box-shadow: 0 4px 12px rgba(29,191,115,0.15); }
        .action-icon { margin-bottom: 10px; display: flex; justify-content: center; }
        .action-title { font-weight: 600; font-size: 14px; color: #404145; }
        .action-desc { font-size: 12px; color: #74767e; margin-top: 4px; }
        .empty { text-align: center; padding: 48px; color: #74767e; background: #fff; border-radius: 12px; border: 1px solid #e4e5e7; }
        .profile-card { background: #fff; border-radius: 12px; border: 1px solid #e4e5e7; padding: 32px; text-align: center; }
        .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: #1dbf73; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 32px; font-weight: 700; margin: 0 auto 16px; }
        .profile-name { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
        .profile-role { font-size: 14px; color: #74767e; margin-bottom: 20px; }
        .profile-stats { display: flex; gap: 32px; justify-content: center; margin-bottom: 24px; }
        .profile-stat { text-align: center; }
        .profile-stat-value { font-size: 20px; font-weight: 700; }
        .profile-stat-label { font-size: 12px; color: #74767e; }
        @media (max-width: 768px) {
          .navbar { padding: 0 16px; }
          .container { padding: 20px 16px; }
          .welcome { flex-direction: column; gap: 16px; text-align: center; }
          .project-item { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="logo">Freelamz<span>.</span></Link>
        <div className="nav-right">
          <Link href="/projects" style={{color:"#74767e"}}>Projectos</Link>
          <Link href="/messages" style={{color:"#74767e"}}>Mensagens</Link>
          <button className="avatar-btn" onClick={() => router.push("/profile")}>{user?.name?.[0] || "U"}</button>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </nav>

      <div className="container">
        <div className="welcome">
          <div>
            <h1>Ola, {user?.name?.split(" ")[0] || "Freelancer"}! 👋</h1>
            <p>Bem-vindo ao teu painel. Encontra projectos e gere o teu trabalho.</p>
          </div>
          <IconRocket />
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-icon"><IconBriefcase /></div>
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">Projectos disponíveis</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><IconMessage /></div>
            <div className="stat-value">0</div>
            <div className="stat-label">Mensagens novas</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><IconStar /></div>
            <div className="stat-value">—</div>
            <div className="stat-label">Avaliacao media</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><IconDollar /></div>
            <div className="stat-value">0 MT</div>
            <div className="stat-label">Ganhos totais</div>
          </div>
        </div>

        <div className="tabs">
          {["overview","projects","profile"].map(t => (
            <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "overview" ? "Visao Geral" : t === "projects" ? "Projectos" : "Perfil"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            <div className="quick-actions">
              {[
                {icon:<IconSearch />, title:"Encontrar Projectos", desc:"Ver todos os projectos disponíveis", path:"/projects"},
                {icon:<IconMessage />, title:"Mensagens", desc:"Ver as tuas conversas", path:"/messages"},
                {icon:<IconUser />, title:"Editar Perfil", desc:"Actualiza as tuas informacoes", path:"/profile"},
                {icon:<IconPlus />, title:"Criar Servico", desc:"Publica o teu primeiro servico", path:"/create-gig"},
              ].map((a, i) => (
                <div key={i} className="action-card" onClick={() => router.push(a.path)}>
                  <div className="action-icon">{a.icon}</div>
                  <div className="action-title">{a.title}</div>
                  <div className="action-desc">{a.desc}</div>
                </div>
              ))}
            </div>

            <div className="section-header">
              <span className="section-title">Projectos recentes</span>
              <Link href="/projects"><button className="btn-primary">Ver todos</button></Link>
            </div>
            <div className="projects-list">
              {loading ? (
                <div className="empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#74767e" strokeWidth="2" style={{margin:"0 auto 12px",display:"block"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  A carregar...
                </div>
              ) : projects.slice(0, 3).length === 0 ? (
                <div className="empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e4e5e7" strokeWidth="1.5" style={{margin:"0 auto 12px",display:"block"}}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  <p>Nenhum projecto disponível ainda.</p>
                </div>
              ) : (
                projects.slice(0, 3).map((p, i) => (
                  <div key={i} className="project-item" onClick={() => router.push(`/projects/${p.id}`)}>
                    <div className="project-info">
                      <div className="project-title">{p.title}</div>
                      <div className="project-meta">{p.client_name} · <span className="badge badge-category">{p.category || "Geral"}</span></div>
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
              <span className="section-title">Todos os projectos ({projects.length})</span>
            </div>
            <div className="projects-list">
              {loading ? (
                <div className="empty">A carregar...</div>
              ) : projects.length === 0 ? (
                <div className="empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e4e5e7" strokeWidth="1.5" style={{margin:"0 auto 12px",display:"block"}}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  <p>Nenhum projecto disponível.</p>
                </div>
              ) : (
                projects.map((p, i) => (
                  <div key={i} className="project-item" onClick={() => router.push(`/projects/${p.id}`)}>
                    <div className="project-info">
                      <div className="project-title">{p.title}</div>
                      <div className="project-meta">{p.client_name} · {p.category || "Geral"}</div>
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

        {activeTab === "profile" && (
          <div className="profile-card">
            <div className="profile-avatar">{user?.name?.[0] || "U"}</div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-role">Freelancer · {user?.email}</div>
            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">0</div>
                <div className="profile-stat-label">Projectos</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">—</div>
                <div className="profile-stat-label">Avaliacao</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">0</div>
                <div className="profile-stat-label">Clientes</div>
              </div>
            </div>
            <Link href="/profile"><button className="btn-primary">Editar Perfil</button></Link>
          </div>
        )}
      </div>
    </>
  );
}