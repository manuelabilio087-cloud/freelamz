"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";
const ADMIN_EMAIL = "manuelabilio087@gmail.com";

const translations = {
  pt: {
    overview: "Visão Geral", users: "Utilizadores", projects: "Projectos", newsletter: "Newsletter", notifications: "Notificações",
    system: "Sistema", viewSite: "Ver Site", logout: "Sair", darkMode: "Modo Escuro", lightMode: "Modo Claro",
    adminPanel: "Painel de Administração · Freelamz", admin: "Administrador",
    totalUsers: "Total Utilizadores", freelancers: "Freelancers", clients: "Clientes", projectsLabel: "Projectos",
    distribution: "Distribuição de Utilizadores", verification: "Verificação de Freelancers", verified: "Verificado", pending: "Pendente",
    lastUsers: "Últimos Utilizadores", lastProjects: "Últimos Projectos", viewAll: "Ver todos",
    allUsers: "Todos os Utilizadores", searchUser: "Pesquisar utilizador...", user: "Utilizador", email: "Email", type: "Tipo", status: "Estado", actions: "Acções",
    allProjects: "Todos os Projectos", searchProject: "Pesquisar projecto...", project: "Projecto", client: "Cliente", category: "Categoria", budget: "Orçamento",
    remove: "Remover", verify: "Verificar", removeVerify: "Remover",
    sendNewsletter: "Enviar Newsletter", subject: "Assunto", message: "Mensagem", send: "Enviar", sending: "A enviar...",
    newsletterDesc: "Envia um email para todos os utilizadores registados na plataforma.",
    newsletterSuccess: "Newsletter enviada com sucesso!",
    notificationsTitle: "Notificações do Sistema", noNotifications: "Nenhuma notificação nova.",
    language: "Idioma", portuguese: "Português", english: "Inglês",
    loading: "A carregar painel...", noUsers: "Nenhum utilizador encontrado.", noProjects: "Nenhum projecto encontrado."
  },
  en: {
    overview: "Overview", users: "Users", projects: "Projects", newsletter: "Newsletter", notifications: "Notifications",
    system: "System", viewSite: "View Site", logout: "Logout", darkMode: "Dark Mode", lightMode: "Light Mode",
    adminPanel: "Admin Panel · Freelamz", admin: "Administrator",
    totalUsers: "Total Users", freelancers: "Freelancers", clients: "Clients", projectsLabel: "Projects",
    distribution: "User Distribution", verification: "Freelancer Verification", verified: "Verified", pending: "Pending",
    lastUsers: "Latest Users", lastProjects: "Latest Projects", viewAll: "View all",
    allUsers: "All Users", searchUser: "Search user...", user: "User", email: "Email", type: "Type", status: "Status", actions: "Actions",
    allProjects: "All Projects", searchProject: "Search project...", project: "Project", client: "Client", category: "Category", budget: "Budget",
    remove: "Remove", verify: "Verify", removeVerify: "Unverify",
    sendNewsletter: "Send Newsletter", subject: "Subject", message: "Message", send: "Send", sending: "Sending...",
    newsletterDesc: "Send an email to all registered users on the platform.",
    newsletterSuccess: "Newsletter sent successfully!",
    notificationsTitle: "System Notifications", noNotifications: "No new notifications.",
    language: "Language", portuguese: "Portuguese", english: "English",
    loading: "Loading panel...", noUsers: "No users found.", noProjects: "No projects found."
  }
};

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [searchProject, setSearchProject] = useState("");
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    const parsed = JSON.parse(u);
    if (parsed.email !== ADMIN_EMAIL) { router.push("/"); return; }
    setUser(parsed);
    loadData();
    const saved = localStorage.getItem("adminDark");
    if (saved === "true") setDarkMode(true);
    const savedLang = localStorage.getItem("adminLang") as "pt" | "en";
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLang = () => {
    setLang(l => {
      const newLang = l === "pt" ? "en" : "pt";
      localStorage.setItem("adminLang", newLang);
      return newLang;
    });
  };

  const toggleDark = () => {
    setDarkMode(d => {
      localStorage.setItem("adminDark", String(!d));
      return !d;
    });
  };

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [uRes, pRes] = await Promise.all([
        fetch(`${API_URL}/users/all`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const uData = await uRes.json();
      const pData = await pRes.json();
      setUsers(Array.isArray(uData) ? uData : []);
      setProjects(Array.isArray(pData) ? pData : []);
    } catch {}
    setLoading(false);
  };

  const deleteUser = async (id: number) => {
    if (!confirm(t.remove + "?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setUsers(u => u.filter(x => x.id !== id));
    } catch {}
  };

  const toggleVerify = async (id: number, current: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/verify/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ verified: !current }),
      });
      if (res.ok) {
        setUsers(u => u.map(x => x.id === id ? { ...x, verified: !current } : x));
      }
    } catch {}
  };

  const deleteProject = async (id: number) => {
    if (!confirm(t.remove + "?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/projects/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setProjects(p => p.filter(x => x.id !== id));
    } catch {}
  };

  const sendNewsletter = async () => {
    if (!newsletterSubject.trim() || !newsletterMessage.trim()) return;
    setSendingNewsletter(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subject: newsletterSubject, message: newsletterMessage }),
      });
      if (res.ok) {
        setNewsletterSent(true);
        setNewsletterSubject("");
        setNewsletterMessage("");
        setTimeout(() => setNewsletterSent(false), 4000);
      }
    } catch {}
    setSendingNewsletter(false);
  };

  const d = darkMode;
  const bg = d ? "#0f1117" : "#f5f6fa";
  const surface = d ? "#1a1d27" : "#ffffff";
  const surface2 = d ? "#242736" : "#f8f9fc";
  const border = d ? "#2e3245" : "#e8eaf0";
  const text = d ? "#e8eaf0" : "#1a1d27";
  const textSub = d ? "#8b90a7" : "#6b7280";
  const accent = "#6366f1";
  const accentLight = d ? "#1e1f3a" : "#eef2ff";
  const green = "#10b981";
  const greenLight = d ? "#0d2818" : "#ecfdf5";
  const red = "#ef4444";
  const redLight = d ? "#2d1515" : "#fef2f2";
  const yellow = "#f59e0b";
  const yellowLight = d ? "#2d1f00" : "#fffbeb";

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );
  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes(searchProject.toLowerCase())
  );

  const freelancers = users.filter(u => u.role === "freelancer");
  const clients = users.filter(u => u.role === "client");
  const verifiedCount = freelancers.filter(u => u.verified).length;
  const pendingCount = freelancers.length - verifiedCount;

  const totalUsers = users.length || 1;
  const freelancerPct = Math.round((freelancers.length / totalUsers) * 100);
  const clientPct = Math.round((clients.length / totalUsers) * 100);

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:bg,color:text,fontFamily:"Inter,sans-serif",flexDirection:"column",gap:"16px"}}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <p style={{color:textSub}}>{t.loading}</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 3px; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade { animation: fadeIn 0.3s ease; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:14px; font-weight:500; transition:all 0.2s; color:${textSub}; }
        .nav-item:hover { background:${surface2}; color:${text}; }
        .nav-item.active { background:${accentLight}; color:${accent}; }
        .stat-card { background:${surface}; border:1px solid ${border}; border-radius:16px; padding:24px; transition:all 0.2s; cursor:default; }
        .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.1); }
        .table-row { display:grid; padding:14px 20px; border-bottom:1px solid ${border}; align-items:center; transition:background 0.15s; }
        .table-row:hover { background:${surface2}; }
        .badge { padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
        .btn { padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:none; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
        .btn-primary { background:${accent}; color:#fff; }
        .btn-primary:hover { opacity:0.9; }
        .btn-success { background:${greenLight}; color:${green}; }
        .btn-success:hover { background:${green}; color:#fff; }
        .btn-danger { background:${redLight}; color:${red}; }
        .btn-danger:hover { background:${red}; color:#fff; }
        .search-input { width:100%; padding:10px 16px 10px 40px; border:1px solid ${border}; border-radius:10px; font-size:14px; outline:none; background:${surface2}; color:${text}; font-family:inherit; }
        .search-input:focus { border-color:${accent}; }
        .search-input::placeholder { color:${textSub}; }
        .textarea { width:100%; padding:12px 16px; border:1px solid ${border}; border-radius:10px; font-size:14px; outline:none; background:${surface2}; color:${text}; font-family:inherit; resize:vertical; min-height:120px; }
        .textarea:focus { border-color:${accent}; }
        .textarea::placeholder { color:${textSub}; }
        .toggle { width:48px; height:26px; border-radius:13px; cursor:pointer; border:none; position:relative; transition:background 0.3s; background:${darkMode ? accent : border}; }
        .toggle-thumb { position:absolute; top:3px; width:20px; height:20px; border-radius:50%; background:#fff; transition:left 0.3s; left:${darkMode ? "25px" : "3px"}; box-shadow:0 2px 4px rgba(0,0,0,0.2); }
        @media(max-width:768px) { .sidebar { display:none!important; } .main-content { margin-left:0!important; } }
      `}</style>

      <div style={{display:"flex",minHeight:"100vh",background:bg,color:text}}>

        {/* SIDEBAR */}
        {sidebarOpen && (
          <div style={{width:"260px",background:surface,borderRight:`1px solid ${border}`,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,height:"100vh",zIndex:100,padding:"24px 16px"}} className="sidebar">
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"32px",padding:"0 8px"}}>
              <div style={{width:"36px",height:"36px",background:`linear-gradient(135deg, ${accent}, #8b5cf6)`,borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <div style={{fontWeight:"700",fontSize:"15px",color:text}}>Freelamz</div>
                <div style={{fontSize:"11px",color:textSub}}>Admin Panel</div>
              </div>
            </div>

            <div style={{flex:1}}>
              <div style={{fontSize:"11px",fontWeight:"600",color:textSub,textTransform:"uppercase",letterSpacing:"0.8px",padding:"0 16px",marginBottom:"8px"}}>{t.system === "Sistema" ? "Principal" : "Main"}</div>
              {[
                {id:"overview", label:t.overview, icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>},
                {id:"users", label:t.users, icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>},
                {id:"projects", label:t.projects, icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>},
                {id:"newsletter", label:t.newsletter, icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>},
                {id:"notifications", label:t.notifications, icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>},
              ].map(item => (
                <div key={item.id} className={`nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
                  {item.icon} {item.label}
                  {item.id === "users" && <span style={{marginLeft:"auto",background:accentLight,color:accent,fontSize:"11px",fontWeight:"700",padding:"2px 8px",borderRadius:"10px"}}>{users.length}</span>}
                  {item.id === "projects" && <span style={{marginLeft:"auto",background:greenLight,color:green,fontSize:"11px",fontWeight:"700",padding:"2px 8px",borderRadius:"10px"}}>{projects.length}</span>}
                </div>
              ))}

              <div style={{fontSize:"11px",fontWeight:"600",color:textSub,textTransform:"uppercase",letterSpacing:"0.8px",padding:"0 16px",marginBottom:"8px",marginTop:"24px"}}>{t.system}</div>
              <div className="nav-item" onClick={() => router.push("/")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                {t.viewSite}
              </div>
              <div className="nav-item" onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/login"); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                {t.logout}
              </div>
            </div>

            <div style={{borderTop:`1px solid ${border}`,paddingTop:"16px",display:"flex",flexDirection:"column",gap:"12px"}}>
              {/* IDIOMA */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:textSub}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  {t.language}
                </div>
                <button onClick={toggleLang} style={{background:surface2,border:`1px solid ${border}`,borderRadius:"8px",padding:"4px 12px",fontSize:"12px",fontWeight:"600",color:text,cursor:"pointer"}}>
                  {lang === "pt" ? "PT" : "EN"}
                </button>
              </div>
              {/* DARK MODE */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:textSub}}>
                  {darkMode ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  )}
                  {darkMode ? t.darkMode : t.lightMode}
                </div>
                <button className="toggle" onClick={toggleDark}>
                  <div className="toggle-thumb"></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div style={{marginLeft: sidebarOpen ? "260px" : "0", flex:1, display:"flex", flexDirection:"column"}} className="main-content">

          {/* TOPBAR */}
          <div style={{background:surface,borderBottom:`1px solid ${border}`,padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
            <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
              <button onClick={() => setSidebarOpen(s => !s)} style={{background:"none",border:"none",cursor:"pointer",color:textSub,padding:"8px",borderRadius:"8px"}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div>
                <div style={{fontWeight:"700",fontSize:"16px",color:text}}>
                  {activeTab === "overview" ? t.overview : activeTab === "users" ? t.users : activeTab === "projects" ? t.projects : activeTab === "newsletter" ? t.newsletter : t.notifications}
                </div>
                <div style={{fontSize:"12px",color:textSub}}>{t.adminPanel}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              <div style={{width:"36px",height:"36px",borderRadius:"50%",background:`linear-gradient(135deg, ${accent}, #8b5cf6)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"700",fontSize:"14px"}}>
                {user?.name?.[0] || "A"}
              </div>
              <div>
                <div style={{fontSize:"13px",fontWeight:"600",color:text}}>{user?.name}</div>
                <div style={{fontSize:"11px",color:accent}}>{t.admin}</div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div style={{padding:"32px",flex:1}}>

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="fade">
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"20px",marginBottom:"32px"}}>
                  {[
                    {label:t.totalUsers, value:users.length, icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color:accent, bg:accentLight},
                    {label:t.freelancers, value:freelancers.length, icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={green} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>, color:green, bg:greenLight},
                    {label:t.clients, value:clients.length, icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={yellow} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, color:yellow, bg:yellowLight},
                    {label:t.projectsLabel, value:projects.length, icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={red} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, color:red, bg:redLight},
                  ].map((s,i) => (
                    <div key={i} className="stat-card">
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
                        <div style={{background:s.bg,padding:"10px",borderRadius:"12px"}}>{s.icon}</div>
                      </div>
                      <div style={{fontSize:"36px",fontWeight:"700",color:text,marginBottom:"4px"}}>{s.value}</div>
                      <div style={{fontSize:"13px",color:textSub}}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"32px"}}>
                  <div style={{background:surface,border:`1px solid ${border}`,borderRadius:"16px",padding:"24px"}}>
                    <div style={{fontWeight:"700",fontSize:"15px",color:text,marginBottom:"20px"}}>{t.distribution}</div>
                    <div style={{display:"flex",alignItems:"flex-end",gap:"24px",height:"160px",padding:"0 16px"}}>
                      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}>
                        <div style={{fontSize:"13px",fontWeight:"700",color:green}}>{freelancers.length}</div>
                        <div style={{width:"60px",background:green,borderRadius:"8px 8px 0 0",transition:"height 0.5s ease",height:`${Math.max(freelancerPct * 1.2, 20)}px`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:"8px"}}>
                          <span style={{color:"#fff",fontSize:"11px",fontWeight:"700"}}>{freelancerPct}%</span>
                        </div>
                        <div style={{fontSize:"12px",color:textSub,fontWeight:"600"}}>{t.freelancers}</div>
                      </div>
                      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}>
                        <div style={{fontSize:"13px",fontWeight:"700",color:accent}}>{clients.length}</div>
                        <div style={{width:"60px",background:accent,borderRadius:"8px 8px 0 0",transition:"height 0.5s ease",height:`${Math.max(clientPct * 1.2, 20)}px`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:"8px"}}>
                          <span style={{color:"#fff",fontSize:"11px",fontWeight:"700"}}>{clientPct}%</span>
                        </div>
                        <div style={{fontSize:"12px",color:textSub,fontWeight:"600"}}>{t.clients}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{background:surface,border:`1px solid ${border}`,borderRadius:"16px",padding:"24px"}}>
                    <div style={{fontWeight:"700",fontSize:"15px",color:text,marginBottom:"20px"}}>{t.verification}</div>
                    <div style={{display:"flex",alignItems:"center",gap:"32px"}}>
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        <circle cx="70" cy="70" r="60" fill="none" stroke={surface2} strokeWidth="20"/>
                        {freelancers.length > 0 && (
                          <>
                            <circle cx="70" cy="70" r="60" fill="none" stroke={green} strokeWidth="20"
                              strokeDasharray={`${(verifiedCount / freelancers.length) * 377} ${377}`}
                              strokeDashoffset="0" transform="rotate(-90 70 70)" strokeLinecap="round"/>
                            <circle cx="70" cy="70" r="60" fill="none" stroke={yellow} strokeWidth="20"
                              strokeDasharray={`${(pendingCount / freelancers.length) * 377} ${377}`}
                              strokeDashoffset={`${-(verifiedCount / freelancers.length) * 377}`}
                              transform="rotate(-90 70 70)" strokeLinecap="round"/>
                          </>
                        )}
                        <text x="70" y="70" textAnchor="middle" dominantBaseline="middle" fill={text} fontSize="24" fontWeight="700">{freelancers.length}</text>
                        <text x="70" y="88" textAnchor="middle" dominantBaseline="middle" fill={textSub} fontSize="11">Total</text>
                      </svg>
                      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                          <div style={{width:"12px",height:"12px",borderRadius:"3px",background:green}}></div>
                          <span style={{fontSize:"13px",color:text}}>{t.verified} ({verifiedCount})</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                          <div style={{width:"12px",height:"12px",borderRadius:"3px",background:yellow}}></div>
                          <span style={{fontSize:"13px",color:text}}>{t.pending} ({pendingCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
                  <div style={{background:surface,border:`1px solid ${border}`,borderRadius:"16px",overflow:"hidden"}}>
                    <div style={{padding:"20px 24px",borderBottom:`1px solid ${border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontWeight:"700",fontSize:"15px",color:text}}>{t.lastUsers}</div>
                      <button className="btn btn-primary" onClick={() => setActiveTab("users")} style={{fontSize:"12px",padding:"6px 12px"}}>{t.viewAll}</button>
                    </div>
                    {users.slice(0,5).map((u,i) => (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"14px 24px",borderBottom:`1px solid ${border}`}}>
                        <div style={{width:"36px",height:"36px",borderRadius:"50%",background:`linear-gradient(135deg, ${accent}, #8b5cf6)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"700",fontSize:"14px",flexShrink:0}}>{u.name?.[0]}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:"600",fontSize:"13px",color:text}}>{u.name}</div>
                          <div style={{fontSize:"12px",color:textSub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
                        </div>
                        <span className="badge" style={{background:u.role==="freelancer"?greenLight:accentLight,color:u.role==="freelancer"?green:accent}}>{u.role}</span>
                        {u.role === "freelancer" && u.verified && (
                          <span className="badge" style={{background:greenLight,color:green,display:"flex",alignItems:"center",gap:"4px"}}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            {t.verified}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{background:surface,border:`1px solid ${border}`,borderRadius:"16px",overflow:"hidden"}}>
                    <div style={{padding:"20px 24px",borderBottom:`1px solid ${border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontWeight:"700",fontSize:"15px",color:text}}>{t.lastProjects}</div>
                      <button className="btn btn-primary" onClick={() => setActiveTab("projects")} style={{fontSize:"12px",padding:"6px 12px"}}>{t.viewAll}</button>
                    </div>
                    {projects.slice(0,5).map((p,i) => (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"14px 24px",borderBottom:`1px solid ${border}`}}>
                        <div style={{width:"36px",height:"36px",borderRadius:"10px",background:greenLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={green} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:"600",fontSize:"13px",color:text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div>
                          <div style={{fontSize:"12px",color:textSub}}>{p.category || "Geral"}</div>
                        </div>
                        <div style={{fontSize:"13px",fontWeight:"700",color:text,whiteSpace:"nowrap"}}>{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}
            {activeTab === "users" && (
              <div className="fade">
                <div style={{background:surface,border:`1px solid ${border}`,borderRadius:"16px",overflow:"hidden"}}>
                  <div style={{padding:"20px 24px",borderBottom:`1px solid ${border}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:"16px",flexWrap:"wrap"}}>
                    <div style={{fontWeight:"700",fontSize:"15px",color:text}}>{t.allUsers} ({users.length})</div>
                    <div style={{position:"relative",minWidth:"280px"}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textSub} strokeWidth="2" style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)"}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input className="search-input" placeholder={t.searchUser} value={searchUser} onChange={e => setSearchUser(e.target.value)} />
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr",padding:"12px 20px",background:surface2,fontSize:"12px",fontWeight:"600",color:textSub,textTransform:"uppercase",letterSpacing:"0.5px"}}>
                    <span>{t.user}</span><span>{t.email}</span><span>{t.type}</span><span>{t.status}</span><span>{t.actions}</span>
                  </div>
                  {filteredUsers.map((u,i) => (
                    <div key={i} className="table-row" style={{gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <div style={{width:"32px",height:"32px",borderRadius:"50%",background:`linear-gradient(135deg, ${accent}, #8b5cf6)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"700",fontSize:"13px",flexShrink:0}}>{u.name?.[0]}</div>
                        <span style={{fontWeight:"600",fontSize:"14px",color:text}}>{u.name}</span>
                      </div>
                      <span style={{fontSize:"13px",color:textSub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</span>
                      <span className="badge" style={{background:u.role==="freelancer"?greenLight:accentLight,color:u.role==="freelancer"?green:accent,width:"fit-content"}}>{u.role || "—"}</span>
                      <div>
                        {u.role === "freelancer" ? (
                          u.verified ? (
                            <span className="badge" style={{background:greenLight,color:green,display:"flex",alignItems:"center",gap:"4px",width:"fit-content"}}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                              {t.verified}
                            </span>
                          ) : (
                            <span className="badge" style={{background:yellowLight,color:yellow,width:"fit-content"}}>{t.pending}</span>
                          )
                        ) : (
                          <span style={{fontSize:"12px",color:textSub}}>—</span>
                        )}
                      </div>
                      <div style={{display:"flex",gap:"8px"}}>
                        {u.role === "freelancer" && (
                          <button className={`btn ${u.verified ? "btn-danger" : "btn-success"}`} style={{padding:"6px 10px",fontSize:"12px"}} onClick={() => toggleVerify(u.id, u.verified)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              {u.verified ? (
                                <><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>
                              ) : (
                                <><polyline points="20 6 9 17 4 12"/></>
                              )}
                            </svg>
                            {u.verified ? t.removeVerify : t.verify}
                          </button>
                        )}
                        <button className="btn btn-danger" style={{padding:"6px 10px",fontSize:"12px"}} onClick={() => deleteUser(u.id)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          {t.remove}
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div style={{padding:"48px",textAlign:"center",color:textSub}}>{t.noUsers}</div>
                  )}
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === "projects" && (
              <div className="fade">
                <div style={{background:surface,border:`1px solid ${border}`,borderRadius:"16px",overflow:"hidden"}}>
                  <div style={{padding:"20px 24px",borderBottom:`1px solid ${border}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:"16px",flexWrap:"wrap"}}>
                    <div style={{fontWeight:"700",fontSize:"15px",color:text}}>{t.allProjects} ({projects.length})</div>
                    <div style={{position:"relative",minWidth:"280px"}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textSub} strokeWidth="2" style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)"}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input className="search-input" placeholder={t.searchProject} value={searchProject} onChange={e => setSearchProject(e.target.value)} />
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"3fr 1fr 1fr 1fr 1fr",padding:"12px 20px",background:surface2,fontSize:"12px",fontWeight:"600",color:textSub,textTransform:"uppercase",letterSpacing:"0.5px"}}>
                    <span>{t.project}</span><span>{t.client}</span><span>{t.category}</span><span>{t.budget}</span><span>{t.actions}</span>
                  </div>
                  {filteredProjects.map((p,i) => (
                    <div key={i} className="table-row" style={{gridTemplateColumns:"3fr 1fr 1fr 1fr 1fr"}}>
                      <div style={{fontWeight:"600",fontSize:"14px",color:text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div>
                      <span style={{fontSize:"13px",color:textSub}}>{p.client_name || "—"}</span>
                      <span className="badge" style={{background:greenLight,color:green,width:"fit-content"}}>{p.category || "Geral"}</span>
                      <span style={{fontSize:"13px",fontWeight:"700",color:text}}>{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "—"}</span>
                      <div style={{display:"flex",gap:"8px"}}>
                        <button className="btn btn-danger" style={{padding:"6px 10px",fontSize:"12px"}} onClick={() => deleteProject(p.id)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          {t.remove}
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredProjects.length === 0 && (
                    <div style={{padding:"48px",textAlign:"center",color:textSub}}>{t.noProjects}</div>
                  )}
                </div>
              </div>
            )}

            {/* NEWSLETTER */}
            {activeTab === "newsletter" && (
              <div className="fade">
                <div style={{background:surface,border:`1px solid ${border}`,borderRadius:"16px",padding:"32px",maxWidth:"700px"}}>
                  <div style={{fontWeight:"700",fontSize:"20px",color:text,marginBottom:"8px"}}>{t.sendNewsletter}</div>
                  <div style={{fontSize:"14px",color:textSub,marginBottom:"24px"}}>{t.newsletterDesc}</div>
                  
                  {newsletterSent && (
                    <div style={{background:greenLight,color:green,padding:"12px 16px",borderRadius:"10px",marginBottom:"20px",fontSize:"14px",fontWeight:"600",display:"flex",alignItems:"center",gap:"8px"}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      {t.newsletterSuccess}
                    </div>
                  )}

                  <div style={{marginBottom:"16px"}}>
                    <label style={{display:"block",fontSize:"13px",fontWeight:"600",color:text,marginBottom:"6px"}}>{t.subject}</label>
                    <input 
                      className="search-input" 
                      style={{paddingLeft:"16px"}} 
                      placeholder="Nova funcionalidade no Freelamz!" 
                      value={newsletterSubject}
                      onChange={e => setNewsletterSubject(e.target.value)}
                    />
                  </div>

                  <div style={{marginBottom:"20px"}}>
                    <label style={{display:"block",fontSize:"13px",fontWeight:"600",color:text,marginBottom:"6px"}}>{t.message}</label>
                    <textarea 
                      className="textarea" 
                      placeholder="Escreve a mensagem aqui..." 
                      value={newsletterMessage}
                      onChange={e => setNewsletterMessage(e.target.value)}
                    />
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{padding:"12px 24px",fontSize:"14px"}} 
                    onClick={sendNewsletter}
                    disabled={sendingNewsletter || !newsletterSubject.trim() || !newsletterMessage.trim()}
                  >
                    {sendingNewsletter ? (
                      <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>{t.sending}</>
                    ) : (
                      <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>{t.send}</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="fade">
                <div style={{background:surface,border:`1px solid ${border}`,borderRadius:"16px",padding:"32px"}}>
                  <div style={{fontWeight:"700",fontSize:"20px",color:text,marginBottom:"24px"}}>{t.notificationsTitle}</div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px",gap:"16px"}}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={textSub} strokeWidth="1.5" opacity="0.5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <div style={{color:textSub,fontSize:"15px"}}>{t.noNotifications}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}