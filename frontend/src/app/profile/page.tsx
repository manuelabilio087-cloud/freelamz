"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const SKILLS_LIST = ["Desenvolvimento Web","Design Grafico","Marketing Digital","Redacao","Video","Musica","Traducao","IA","Negocios","Fotografia","Contabilidade","Programacao Mobile","SEO","Redes Sociais","Suporte IT"];

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    const parsed = JSON.parse(u);
    setUser(parsed);
    setName(parsed.name || "");
    setBio(parsed.bio || "");
    setSkills(Array.isArray(parsed.skills) ? parsed.skills : []);
    setPhone(parsed.phone || "");
    setLocation(parsed.location || "Maputo, Moçambique");
  }, []);

  const toggleSkill = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const save = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, bio, skills, phone, location }),
      });
      const data = await res.json();
      const updated = { ...user, name, bio, skills, phone, location };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

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
        .container { max-width: 900px; margin: 32px auto; padding: 0 24px; display: grid; grid-template-columns: 280px 1fr; gap: 24px; }
        .sidebar-card { background: #fff; border-radius: 16px; border: 1px solid #e4e5e7; padding: 32px 24px; text-align: center; height: fit-content; }
        .avatar-wrap { position: relative; width: 100px; height: 100px; margin: 0 auto 16px; }
        .avatar { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #1dbf73, #0fa85c); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 40px; font-weight: 700; }
        .avatar-badge { position: absolute; bottom: 2px; right: 2px; width: 28px; height: 28px; background: #1dbf73; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .profile-name { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
        .profile-role { font-size: 13px; color: #1dbf73; font-weight: 600; margin-bottom: 4px; }
        .profile-location { font-size: 13px; color: #74767e; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 4px; }
        .profile-stats { display: flex; justify-content: space-around; padding: 16px 0; border-top: 1px solid #e4e5e7; border-bottom: 1px solid #e4e5e7; margin-bottom: 20px; }
        .stat { text-align: center; }
        .stat-val { font-size: 20px; font-weight: 700; color: #404145; }
        .stat-lbl { font-size: 11px; color: #74767e; margin-top: 2px; }
        .skills-preview { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 20px; }
        .skill-badge { background: #f0fdf8; color: #1dbf73; font-size: 11px; padding: 4px 10px; border-radius: 12px; border: 1px solid #c8f0dc; font-weight: 500; }
        .btn-view { width: 100%; padding: 10px; background: #fff; color: #404145; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .btn-view:hover { background: #f5f5f5; }
        .main-card { background: #fff; border-radius: 16px; border: 1px solid #e4e5e7; overflow: hidden; }
        .tabs { display: flex; border-bottom: 1px solid #e4e5e7; }
        .tab { padding: 16px 24px; font-size: 14px; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; color: #74767e; background: none; border-top: none; border-left: none; border-right: none; display: flex; align-items: center; gap: 8px; }
        .tab.active { color: #1dbf73; border-bottom-color: #1dbf73; }
        .tab-body { padding: 28px; }
        .section-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; color: #404145; display: flex; align-items: center; gap: 8px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #404145; margin-bottom: 8px; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 8px; font-size: 14px; outline: none; color: #404145; font-family: inherit; transition: border-color 0.2s; }
        .form-group input:focus, .form-group textarea:focus { border-color: #1dbf73; }
        .form-group textarea { resize: vertical; min-height: 100px; }
        .char-count { font-size: 11px; color: #74767e; text-align: right; margin-top: 4px; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .skill-btn { padding: 8px 14px; border: 1.5px solid #e4e5e7; border-radius: 20px; font-size: 13px; cursor: pointer; background: #fff; color: #74767e; transition: all 0.2s; }
        .skill-btn.selected { background: #f0fdf8; color: #1dbf73; border-color: #1dbf73; font-weight: 600; }
        .btn-save { background: #1dbf73; color: #fff; padding: 12px 32px; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 8px; }
        .btn-save:hover { background: #0fa85c; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .save-row { display: flex; align-items: center; gap: 16px; margin-top: 8px; }
        .saved-msg { color: #1dbf73; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .security-item { padding: 20px; border: 1px solid #e4e5e7; border-radius: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
        .security-info h4 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .security-info p { font-size: 13px; color: #74767e; }
        .btn-change { background: none; border: 1px solid #e4e5e7; padding: 8px 16px; border-radius: 4px; font-size: 13px; cursor: pointer; color: #404145; }
        .btn-change:hover { background: #f5f5f5; }
        @media (max-width: 768px) {
          .container { grid-template-columns: 1fr; }
          .navbar { padding: 0 16px; }
          .info-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="logo">Freelamz<span>.</span></Link>
        <div className="nav-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/messages">Mensagens</Link>
          <Link href="/projects">Projectos</Link>
        </div>
      </nav>

      <div className="container">
        {/* SIDEBAR */}
        <div className="sidebar-card">
          <div className="avatar-wrap">
            <div className="avatar">{name?.[0] || "U"}</div>
            <div className="avatar-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </div>
          <div className="profile-name">{name || "O teu nome"}</div>
          <div className="profile-role">{skills[0] || "Freelancer"}</div>
          <div className="profile-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#74767e" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {location || "Maputo, Moçambique"}
          </div>
          <div className="profile-stats">
            <div className="stat"><div className="stat-val">0</div><div className="stat-lbl">Projectos</div></div>
            <div className="stat"><div className="stat-val">—</div><div className="stat-lbl">Avaliação</div></div>
            <div className="stat"><div className="stat-val">0</div><div className="stat-lbl">Clientes</div></div>
          </div>
          {skills.length > 0 && (
            <div className="skills-preview">
              {skills.slice(0, 4).map((s, i) => <span key={i} className="skill-badge">{s}</span>)}
            </div>
          )}
          <button className="btn-view" onClick={() => router.push("/freelancers")}>
            Ver perfil público →
          </button>
        </div>

        {/* MAIN */}
        <div className="main-card">
          <div className="tabs">
            {[
              {id:"perfil", label:"Perfil", icon:"👤"},
              {id:"skills", label:"Competências", icon:"🛠️"},
              {id:"seguranca", label:"Segurança", icon:"🔒"},
            ].map(t => (
              <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {activeTab === "perfil" && (
            <div className="tab-body">
              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Informações Pessoais
              </div>

              <div className="info-row">
                <div className="form-group">
                  <label>Nome completo</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="O teu nome" />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+258 84 000 0000" />
                </div>
              </div>

              <div className="form-group">
                <label>Localização</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Maputo, Moçambique" />
              </div>

              <div className="form-group">
                <label>Bio — Apresenta-te aos clientes</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Ex: Sou desenvolvedor web com 3 anos de experiência em React e Node.js. Especializado em criar plataformas web modernas para empresas moçambicanas..."
                  maxLength={300}
                />
                <div className="char-count">{bio.length}/300</div>
              </div>

              <div className="save-row">
                <button className="btn-save" onClick={save} disabled={saving}>
                  {saving ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      A guardar...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      Guardar alterações
                    </>
                  )}
                </button>
                {saved && (
                  <div className="saved-msg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Guardado com sucesso!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="tab-body">
              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                As tuas competências ({skills.length} seleccionadas)
              </div>
              <p style={{fontSize:"13px", color:"#74767e", marginBottom:"16px"}}>Selecciona as áreas em que trabalhas. Isto ajuda os clientes a encontrar-te.</p>
              <div className="skills-grid">
                {SKILLS_LIST.map((s, i) => (
                  <button key={i} className={`skill-btn ${skills.includes(s) ? "selected" : ""}`} onClick={() => toggleSkill(s)}>
                    {skills.includes(s) ? "✓ " : ""}{s}
                  </button>
                ))}
              </div>
              <div className="save-row" style={{marginTop:"24px"}}>
                <button className="btn-save" onClick={save} disabled={saving}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  {saving ? "A guardar..." : "Guardar competências"}
                </button>
                {saved && <div className="saved-msg">✓ Guardado!</div>}
              </div>
            </div>
          )}

          {activeTab === "seguranca" && (
            <div className="tab-body">
              <div className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Segurança da conta
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h4>Email</h4>
                  <p>{user?.email || "—"}</p>
                </div>
                <button className="btn-change">Alterar</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h4>Senha</h4>
                  <p>Última alteração: nunca</p>
                </div>
                <button className="btn-change">Alterar senha</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h4>Verificação em dois passos</h4>
                  <p>Protege a tua conta com SMS</p>
                </div>
                <button className="btn-change">Activar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}