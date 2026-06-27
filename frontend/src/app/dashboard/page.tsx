"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const IconBriefcase = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const IconMessage = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconStar = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconDollar = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IconCheck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
const IconClock = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconTrending = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [projectsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const pData = await projectsRes.json();
      const sData = await statsRes.json();
      setProjects(Array.isArray(pData) ? pData : []);
      setStats(sData);
    } catch {}
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  // Sugestões baseadas nas skills do freelancer
  const suggestedProjects = projects.filter(p => {
    if (!user?.skills || !p.category) return false;
    const userSkills = user.skills.map((s: string) => s.toLowerCase());
    return userSkills.some((s: string) => p.category.toLowerCase().includes(s) || p.title.toLowerCase().includes(s));
  }).slice(0, 3);

  const completionRate = stats?.proposals > 0 ? Math.round((stats.completed / stats.proposals) * 100) : 0;

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #f5f6fa !important; }
        body { font-family: Inter, sans-serif; color: #1a1d27; }
        a { text-decoration: none; color: inherit; }
        
        .logo { font-size: 22px; font-weight: 700; color: #000; }
        .logo span { color: #6366f1; }
        .nav-right { display: flex; align-items: center; gap: 20px; font-size: 14px; }
        .avatar-btn { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-weight: 700; border: none; cursor: pointer; font-size: 14px; }
        .btn-logout { background: none; border: 1px solid #e8eaf0; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; color: #6b7280; transition: all 0.2s; }
        .btn-logout:hover { background: #f5f6fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
        
        /* Welcome Banner */
        .welcome { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border-radius: 20px; padding: 32px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; position: relative; overflow: hidden; }
        .welcome::before { content: ""; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; }
        .welcome h1 { font-size: 26px; font-weight: 700; margin-bottom: 6px; }
        .welcome p { font-size: 14px; opacity: 0.85; }
        .welcome-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 20px; font-size: 13px; margin-top: 12px; backdrop-filter: blur(10px); }
        
        /* Stats Grid */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 28px; }
        .stat-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e8eaf0; transition: all 0.2s; position: relative; overflow: hidden; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .stat-icon-wrap { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .stat-value { font-size: 32px; font-weight: 700; color: #1a1d27; margin-bottom: 4px; }
        .stat-label { font-size: 13px; color: #6b7280; }
        .stat-change { font-size: 12px; font-weight: 600; margin-top: 8px; display: flex; align-items: center; gap: 4px; }
        .stat-change.up { color: #10b981; }
        .stat-change.down { color: #ef4444; }
        
        /* Progress Bar */
        .progress-wrap { margin-top: 12px; }
        .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 6px; }
        .progress-track { height: 6px; background: #e8eaf0; border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
        
        /* Tabs */
        .tabs { display: flex; gap: 0; border-bottom: 2px solid #e8eaf0; margin-bottom: 24px; }
        .tab { padding: 12px 20px; font-size: 14px; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; color: #6b7280; background: none; border-top: none; border-left: none; border-right: none; transition: all 0.2s; }
        .tab.active { color: #6366f1; border-bottom-color: #6366f1; }
        .tab:hover:not(.active) { color: #1a1d27; }
        
        /* Section */
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .section-title { font-size: 18px; font-weight: 700; color: #1a1d27; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 10px 20px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; transition: opacity 0.2s; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-outline { background: #fff; color: #6366f1; padding: 10px 20px; border-radius: 10px; font-weight: 600; border: 1.5px solid #6366f1; cursor: pointer; font-size: 14px; transition: all 0.2s; }
        .btn-outline:hover { background: #eef2ff; }
        
        /* Projects */
        .projects-list { display: flex; flex-direction: column; gap: 12px; }
        .project-item { background: #fff; border: 1px solid #e8eaf0; border-radius: 14px; padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; transition: all 0.2s; cursor: pointer; }
        .project-item:hover { border-color: #6366f1; box-shadow: 0 4px 12px rgba(99,102,241,0.1); }
        .project-info { flex: 1; min-width: 0; }
        .project-title { font-weight: 600; font-size: 15px; margin-bottom: 6px; color: #1a1d27; }
        .project-meta { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 8px; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-open { background: #ecfdf5; color: #10b981; }
        .badge-urgent { background: #fef2f2; color: #ef4444; }
        .badge-category { background: #f5f6fa; color: #6b7280; }
        .project-budget { font-size: 18px; font-weight: 700; color: #1a1d27; white-space: nowrap; }
        
        /* Suggestions */
        .suggestions { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e8eaf0; margin-bottom: 24px; }
        .suggestion-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .suggestion-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: #fff; }
        .suggestion-list { display: flex; flex-direction: column; gap: 10px; }
        .suggestion-item { padding: 14px; background: #f5f6fa; border-radius: 10px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; }
        .suggestion-item:hover { background: #eef2ff; }
        
        /* Empty */
        .empty { text-align: center; padding: 48px; color: #6b7280; background: #fff; border-radius: 16px; border: 1px solid #e8eaf0; }
        
        /* Profile */
        .profile-card { background: #fff; border-radius: 16px; border: 1px solid #e8eaf0; padding: 40px; text-align: center; max-width: 500px; margin: 0 auto; }
        .profile-avatar { width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 36px; font-weight: 700; margin: 0 auto 20px; }
        .profile-name { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
        .profile-role { font-size: 14px; color: #6b7280; margin-bottom: 24px; }
        .profile-stats { display: flex; gap: 40px; justify-content: center; margin-bottom: 28px; padding: 20px; background: #f5f6fa; border-radius: 12px; }
        .profile-stat { text-align: center; }
        .profile-stat-value { font-size: 24px; font-weight: 700; color: #6366f1; }
        .profile-stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
        
        /* Responsive */
        @media (max-width: 768px) {
          
          .container { padding: 20px 16px; }
          .welcome { flex-direction: column; gap: 16px; text-align: center; }
          .welcome::before { display: none; }
          .project-item { flex-direction: column; align-items: flex-start; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      

      <div className="container">
        {/* Welcome Banner */}
        <div className="welcome">
          <div>
            <h1>Ola, {user?.name?.split(" ")[0] || "Freelancer"}! 👋</h1>
            <p>Aqui esta o resumo da tua actividade e progresso.</p>
            {stats?.unreadMessages > 0 && (
              <div className="welcome-badge">
                <IconMessage />
                {stats.unreadMessages} mensagens novas
              </div>
            )}
          </div>
          <IconTrending />
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background:"#eef2ff",color:"#6366f1"}}><IconBriefcase /></div>
            <div className="stat-value">{stats?.proposals || 0}</div>
            <div className="stat-label">Propostas enviadas</div>
            <div className="progress-wrap">
              <div className="progress-label"><span>Taxa de aceitacao</span><span>{stats?.proposals > 0 ? Math.round((stats?.accepted / stats?.proposals) * 100) : 0}%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{width:`${stats?.proposals > 0 ? (stats?.accepted / stats?.proposals) * 100 : 0}%`,background:"linear-gradient(90deg, #6366f1, #8b5cf6)"}}></div></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background:"#ecfdf5",color:"#10b981"}}><IconCheck /></div>
            <div className="stat-value">{stats?.completed || 0}</div>
            <div className="stat-label">Projectos concluidos</div>
            <div className="stat-change up"><IconTrending /> {completionRate}% taxa de sucesso</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background:"#fef2f2",color:"#ef4444"}}><IconDollar /></div>
            <div className="stat-value">{stats?.earnings ? `${Number(stats.earnings).toLocaleString()} MT` : "0 MT"}</div>
            <div className="stat-label">Ganhos totais</div>
            <div className="progress-wrap">
              <div className="progress-label"><span>Meta mensal</span><span>{stats?.earnings > 0 ? Math.min(Math.round((stats.earnings / 50000) * 100), 100) : 0}%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{width:`${stats?.earnings > 0 ? Math.min((stats.earnings / 50000) * 100, 100) : 0}%`,background:"linear-gradient(90deg, #ef4444, #f59e0b)"}}></div></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap" style={{background:"#fffbeb",color:"#f59e0b"}}><IconStar /></div>
            <div className="stat-value">{stats?.rating || "—"}</div>
            <div className="stat-label">Avaliacao media</div>
            <div style={{display:"flex",gap:"2px",marginTop:"8px"}}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= Math.round(stats?.rating || 0) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {["overview","projects","profile"].map(t => (
            <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "overview" ? "Visao Geral" : t === "projects" ? "Projectos" : "Perfil"}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <>
            {/* Suggestions */}
            {suggestedProjects.length > 0 && (
              <div className="suggestions">
                <div className="suggestion-header">
                  <div className="suggestion-icon"><IconBriefcase /></div>
                  <div>
                    <div style={{fontWeight:"700",fontSize:"15px"}}>Projectos recomendados para ti</div>
                    <div style={{fontSize:"13px",color:"#6b7280"}}>Baseados nas tuas skills</div>
                  </div>
                </div>
                <div className="suggestion-list">
                  {suggestedProjects.map((p, i) => (
                    <div key={i} className="suggestion-item" onClick={() => router.push(`/projects/${p.id}`)}>
                      <div>
                        <div style={{fontWeight:"600",fontSize:"14px"}}>{p.title}</div>
                        <div style={{fontSize:"12px",color:"#6b7280"}}>{p.category} · {p.client_name}</div>
                      </div>
                      <div style={{fontWeight:"700",fontSize:"14px",color:"#6366f1"}}>{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Projects */}
            <div className="section-header">
              <span className="section-title">Projectos recentes</span>
              <Link href="/projects"><button className="btn-primary">Ver todos</button></Link>
            </div>
            <div className="projects-list">
              {loading ? (
                <div className="empty">A carregar...</div>
              ) : projects.slice(0, 3).length === 0 ? (
                <div className="empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e8eaf0" strokeWidth="1.5" style={{margin:"0 auto 12px",display:"block"}}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  <p>Nenhum projecto disponível ainda.</p>
                </div>
              ) : (
                projects.slice(0, 3).map((p, i) => (
                  <div key={i} className="project-item" onClick={() => router.push(`/projects/${p.id}`)}>
                    <div className="project-info">
                      <div className="project-title">{p.title}</div>
                      <div className="project-meta">
                        <span className="badge badge-category">{p.category || "Geral"}</span>
                        <span>{p.client_name}</span>
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

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <>
            <div className="section-header">
              <span className="section-title">Projectos em andamento ({stats?.ongoing || 0})</span>
            </div>
            <div className="projects-list">
              {loading ? (
                <div className="empty">A carregar...</div>
              ) : (
                <div className="empty">
                  <IconClock />
                  <p style={{marginTop:"12px"}}>Os teus projectos em andamento aparecerao aqui.</p>
                  <button className="btn-outline" style={{marginTop:"16px"}} onClick={() => router.push("/projects")}>Encontrar projectos</button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="profile-card">
            <div className="profile-avatar">{user?.name?.[0] || "U"}</div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-role">Freelancer · {user?.email}</div>
            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">{stats?.completed || 0}</div>
                <div className="profile-stat-label">Concluidos</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{stats?.rating || "—"}</div>
                <div className="profile-stat-label">Avaliacao</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{stats?.earnings ? `${Number(stats.earnings).toLocaleString()} MT` : "0"}</div>
                <div className="profile-stat-label">Ganhos</div>
              </div>
            </div>
            <Link href="/profile"><button className="btn-primary">Editar Perfil</button></Link>
          </div>
        )}
      </div>
    </>
  );
}
