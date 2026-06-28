"use client"; // v2
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const Dash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const Folder = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const Users = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Msg = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const Contract = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const Dollar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const Shield = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const User = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Plus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Sun = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const Moon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const Out = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const Check = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>;
const Send = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const Coin = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>;
const Trend = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const Arr = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const Code = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const Pal = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
const Chart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    const d = localStorage.getItem("fl_dark") === "true";
    setDark(d);
    loadData();
  }, []);

  const toggleDark = () => { const n = !dark; setDark(n); localStorage.setItem("fl_dark", String(n)); };
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/"); };

  const loadData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [pR, fR] = await Promise.all([
        fetch(`${API_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users/freelancers`),
      ]);
      const pD = await pR.json(); const fD = await fR.json();
      setProjects(Array.isArray(pD) ? pD : []);
      setFreelancers(Array.isArray(fD) ? fD : []);
    } catch {}
    setLoading(false);
  };

  const bg = dark ? "#0d0f14" : "#f4f5f7";
  const surf = dark ? "#161920" : "#ffffff";
  const surf2 = dark ? "#1e2028" : "#f8f9fc";
  const bord = dark ? "#2a2d3a" : "#e8eaed";
  const txt = dark ? "#e8eaf0" : "#111827";
  const sub = dark ? "#7c7f9e" : "#6b7280";
  const acc = "#6366f1"; const accB = dark ? "#1a1b3a" : "#eef2ff"; const accT = dark ? "#a5b4fc" : "#4f46e5";
  const grn = "#10b981"; const grnB = dark ? "#0a2018" : "#ecfdf5"; const grnT = dark ? "#6ee7b7" : "#065f46";
  const amb = "#f59e0b"; const ambB = dark ? "#271c00" : "#fffbeb"; const ambT = dark ? "#fcd34d" : "#92400e";
  const rd = "#ef4444"; const rdB = dark ? "#2a0f0f" : "#fef2f2"; const rdT = dark ? "#fca5a5" : "#991b1b";
  const pro = "#8b5cf6"; const proB = dark ? "#1e1030" : "#f5f3ff"; const proT = dark ? "#c4b5fd" : "#5b21b6";

  const myProjects = projects.filter((p: any) => p.client_id === user?.id || p.client_name === user?.name);
  const activeProjects = myProjects.filter((p: any) => p.status === "open" || !p.status);

  const catStyle: any = {
    "Desenvolvimento Web": { icon:<Code/>, bg:accB, col:accT },
    "Design Grafico": { icon:<Pal/>, bg:proB, col:proT },
    "Marketing Digital": { icon:<Chart/>, bg:ambB, col:ambT },
  };

  const navSections = [
    { label: "Principal", items: [
      { id:"overview", label:"Visão geral", icon:<Dash/> },
      { id:"projects", label:"Meus projectos", icon:<Folder/> },
      { id:"freelancers", label:"Freelancers", icon:<Users/> },
      { id:"messages", label:"Mensagens", icon:<Msg/> },
    ]},
    { label: "Gestão", items: [
      { id:"contracts", label:"Contratos", icon:<Contract/> },
      { id:"payments", label:"Pagamentos", icon:<Dollar/> },
      { id:"disputes", label:"Disputas", icon:<Shield/> },
    ]},
    { label: "Conta", items: [
      { id:"profile", label:"Perfil", icon:<User/> },
    ]},
  ];

  const navGo = (id: string) => {
    const routes: any = { messages:"/messages", contracts:"/contracts", payments:"/payments", disputes:"/disputes", profile:"/profile" };
    if (routes[id]) { router.push(routes[id]); return; }
    setTab(id);
  };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{background:${bg}!important;color:${txt}!important}
        body{font-family:Inter,-apple-system,sans-serif}
        a{text-decoration:none;color:inherit}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${bord};border-radius:4px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeIn 0.25s ease}
        .shell{display:flex;min-height:100vh}
        .sidebar{width:248px;background:${surf};border-right:1px solid ${bord};display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:50}
        .sb-logo{padding:20px 20px 16px;border-bottom:1px solid ${bord};display:flex;align-items:center;gap:10px}
        .logo-mark{width:32px;height:32px;background:${grn};border-radius:8px;display:flex;align-items:center;justify-content:center}
        .logo-txt{font-size:17px;font-weight:700;color:${txt}}
        .logo-txt span{color:${grn}}
        .sb-nav{flex:1;overflow-y:auto;padding:12px 10px}
        .sec-lbl{font-size:10px;font-weight:600;color:${sub};text-transform:uppercase;letter-spacing:.8px;padding:8px 10px 4px}
        .nav-it{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;cursor:pointer;color:${sub};font-size:13.5px;font-weight:500;transition:all .15s;margin-bottom:1px}
        .nav-it:hover{background:${surf2};color:${txt}}
        .nav-it.active{background:${grnB};color:${grnT}}
        .nav-it.active svg{stroke:${grnT}}
        .sb-bot{padding:12px 10px;border-top:1px solid ${bord}}
        .user-row{display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;cursor:pointer;transition:background .15s}
        .user-row:hover{background:${surf2}}
        .av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,${grn},${acc});display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;flex-shrink:0;overflow:hidden}
        .av img{width:100%;height:100%;object-fit:cover}
        .u-name{font-size:13px;font-weight:600;color:${txt}}
        .u-role{font-size:11px;color:${sub}}
        .main{margin-left:248px;flex:1;min-height:100vh;background:${bg}}
        .topbar{background:${surf};border-bottom:1px solid ${bord};padding:0 28px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:40}
        .pg-title{font-size:16px;font-weight:600;color:${txt}}
        .tb-right{display:flex;align-items:center;gap:8px}
        .ic-btn{width:34px;height:34px;border-radius:8px;border:1px solid ${bord};background:${surf2};display:flex;align-items:center;justify-content:center;cursor:pointer;color:${sub};transition:all .15s}
        .ic-btn:hover{color:${txt};border-color:${grn}}
        .btn-new{display:flex;align-items:center;gap:6px;background:${grn};color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:opacity .15s}
        .btn-new:hover{opacity:.9}
        .cont{padding:24px 28px}
        .s-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .s-card{background:${surf};border:1px solid ${bord};border-radius:12px;padding:20px;transition:all .2s}
        .s-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,${dark?.15:.08})}
        .s-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .s-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center}
        .s-lbl{font-size:12px;color:${sub};font-weight:500}
        .s-val{font-size:26px;font-weight:700;color:${txt};margin-bottom:4px;line-height:1}
        .s-sub{font-size:12px;color:${sub};display:flex;align-items:center;gap:4px}
        .s-up{color:${grn}}
        .sec-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
        .sec-tit{font-size:15px;font-weight:600;color:${txt}}
        .lnk-btn{font-size:13px;color:${accT};background:none;border:none;cursor:pointer;font-weight:500;display:flex;align-items:center;gap:4px}
        .q-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
        .q-card{background:${surf};border:1px solid ${bord};border-radius:10px;padding:16px;cursor:pointer;text-align:center;transition:all .15s}
        .q-card:hover{border-color:${grn};transform:translateY(-1px)}
        .q-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px}
        .q-lbl{font-size:13px;font-weight:500;color:${txt}}
        .p-list{display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
        .p-row{background:${surf};border:1px solid ${bord};border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .15s}
        .p-row:hover{border-color:${grn}}
        .p-cat{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .p-inf{flex:1;min-width:0}
        .p-name{font-size:14px;font-weight:600;color:${txt};margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .p-meta{font-size:12px;color:${sub}}
        .p-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
        .badge{padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600}
        .b-open{background:${grnB};color:${grnT}}
        .b-act{background:${accB};color:${accT}}
        .b-done{background:${surf2};color:${sub};border:1px solid ${bord}}
        .p-bud{font-size:14px;font-weight:700;color:${txt}}
        .fl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .fl-card{background:${surf};border:1px solid ${bord};border-radius:12px;padding:20px;text-align:center;transition:all .2s;cursor:pointer}
        .fl-card:hover{border-color:${grn};transform:translateY(-2px)}
        .fl-av{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,${grn},${acc});display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:700;margin:0 auto 12px;overflow:hidden}
        .fl-av img{width:100%;height:100%;object-fit:cover}
        .fl-name{font-size:15px;font-weight:600;color:${txt};margin-bottom:4px}
        .fl-bio{font-size:12px;color:${sub};margin-bottom:12px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .fl-skills{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:14px}
        .fl-skill{background:${surf2};color:${sub};font-size:11px;padding:3px 8px;border-radius:10px;border:1px solid ${bord}}
        .btn-contact{width:100%;padding:9px;background:${grn};color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;transition:opacity .15s}
        .btn-contact:hover{opacity:.9}
        .empty{text-align:center;padding:48px;background:${surf};border:1px solid ${bord};border-radius:12px;color:${sub}}
        .btn-pri{background:${grn};color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;border:none;cursor:pointer}
        @media(max-width:900px){.sidebar{display:none}.main{margin-left:0}.s-grid{grid-template-columns:1fr 1fr}.q-grid{grid-template-columns:1fr 1fr}.fl-grid{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="shell">
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="logo-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="logo-txt">Freelamz<span>.</span></span>
          </div>

          <nav className="sb-nav">
            {navSections.map(sec => (
              <div key={sec.label}>
                <div className="sec-lbl">{sec.label}</div>
                {sec.items.map(it => (
                  <div key={it.id} className={`nav-it ${tab === it.id ? "active" : ""}`} onClick={() => navGo(it.id)}>
                    {it.icon} {it.label}
                  </div>
                ))}
              </div>
            ))}
          </nav>

          <div className="sb-bot">
            <div className="nav-it" onClick={toggleDark} style={{marginBottom:"4px"}}>{dark ? <Sun/> : <Moon/>} {dark ? "Tema claro" : "Tema escuro"}</div>
            <div className="nav-it" onClick={logout}><Out/> Sair</div>
            <div className="user-row" style={{marginTop:"8px"}}>
              <div className="av">{user?.avatar ? <img src={user.avatar} alt={user?.name}/> : user?.name?.[0]}</div>
              <div><div className="u-name">{user?.name}</div><div className="u-role">Cliente</div></div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="pg-title">{tab === "overview" ? `Olá, ${user?.name?.split(" ")[0] || "Cliente"} 👋` : tab === "projects" ? "Meus Projectos" : tab === "freelancers" ? "Freelancers" : "Dashboard"}</div>
            <div className="tb-right">
              <div className="ic-btn" onClick={() => router.push("/messages")} title="Mensagens"><Msg/></div>
              <button className="btn-new" onClick={() => router.push("/projects/new")}><Plus/> Novo projecto</button>
            </div>
          </div>

          <div className="cont fade">
            {tab === "overview" && <>
              <div className="s-grid">
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Projectos publicados</div><div className="s-icon" style={{background:accB,color:accT}}><Folder/></div></div>
                  <div className="s-val">{projects.length}</div>
                  <div className="s-sub s-up"><Trend/> {activeProjects.length} activos agora</div>
                </div>
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Propostas recebidas</div><div className="s-icon" style={{background:grnB,color:grnT}}><Send/></div></div>
                  <div className="s-val">0</div>
                  <div className="s-sub" style={{color:sub}}>Para rever</div>
                </div>
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Projectos concluidos</div><div className="s-icon" style={{background:grnB,color:grnT}}><Check/></div></div>
                  <div className="s-val">0</div>
                  <div className="s-sub s-up"><Trend/> 100% satisfacao</div>
                </div>
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Total investido</div><div className="s-icon" style={{background:ambB,color:ambT}}><Coin/></div></div>
                  <div className="s-val">0</div>
                  <div className="s-sub" style={{color:sub}}>MT pagos</div>
                </div>
              </div>

              <div className="sec-row"><span className="sec-tit">Acesso rapido</span></div>
              <div className="q-grid">
                {[
                  {l:"Freelancers",i:<Users/>,p:null,bg:accB,c:accT,tab:"freelancers"},
                  {l:"Mensagens",i:<Msg/>,p:"/messages",bg:grnB,c:grnT},
                  {l:"Pagamentos",i:<Dollar/>,p:"/payments",bg:ambB,c:ambT},
                  {l:"Disputas",i:<Shield/>,p:"/disputes",bg:rdB,c:rdT},
                ].map((q,i) => (
                  <div key={i} className="q-card" onClick={() => q.p ? router.push(q.p) : setTab("freelancers")}>
                    <div className="q-icon" style={{background:q.bg,color:q.c}}>{q.i}</div>
                    <div className="q-lbl">{q.l}</div>
                  </div>
                ))}
              </div>

              <div className="sec-row">
                <span className="sec-tit">Os meus projectos</span>
                <button className="lnk-btn" onClick={() => setTab("projects")}>Ver todos <Arr/></button>
              </div>
              <div className="p-list">
                {loading ? <div className="empty">A carregar...</div> : projects.slice(0,4).length === 0 ? (
                  <div className="empty">
                    <p style={{marginBottom:"16px"}}>Ainda nao publicaste nenhum projecto.</p>
                    <button className="btn-pri" onClick={() => router.push("/projects/new")}>Publicar primeiro projecto</button>
                  </div>
                ) : projects.slice(0,4).map((p,i) => {
                  const cs = catStyle[p.category] || {icon:<Folder/>,bg:surf2,col:sub};
                  return (
                    <div key={i} className="p-row" onClick={() => router.push(`/projects/${p.id}`)}>
                      <div className="p-cat" style={{background:cs.bg,color:cs.col}}>{cs.icon}</div>
                      <div className="p-inf"><div className="p-name">{p.title}</div><div className="p-meta">{p.category||"Geral"} · Publicado recentemente</div></div>
                      <div className="p-right">
                        <span className="badge b-open">Aberto</span>
                        <span className="p-bud">{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>}

            {tab === "projects" && <div className="fade">
              <div className="sec-row">
                <span className="sec-tit">Todos os meus projectos ({projects.length})</span>
                <button className="btn-pri" onClick={() => router.push("/projects/new")}>+ Novo projecto</button>
              </div>
              <div className="p-list">
                {loading ? <div className="empty">A carregar...</div> : projects.length === 0 ? (
                  <div className="empty"><p style={{marginBottom:"16px"}}>Ainda nao publicaste nenhum projecto.</p><button className="btn-pri" onClick={() => router.push("/projects/new")}>Publicar agora</button></div>
                ) : projects.map((p,i) => {
                  const cs = catStyle[p.category] || {icon:<Folder/>,bg:surf2,col:sub};
                  return (
                    <div key={i} className="p-row" onClick={() => router.push(`/projects/${p.id}`)}>
                      <div className="p-cat" style={{background:cs.bg,color:cs.col}}>{cs.icon}</div>
                      <div className="p-inf"><div className="p-name">{p.title}</div><div className="p-meta">{p.category||"Geral"}</div></div>
                      <div className="p-right">
                        <span className="badge b-open">Aberto</span>
                        <span className="p-bud">{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>}

            {tab === "freelancers" && <div className="fade">
              <div className="sec-row"><span className="sec-tit">Freelancers disponiveis ({freelancers.length})</span></div>
              {loading ? <div className="empty">A carregar...</div> : freelancers.length === 0 ? (
                <div className="empty"><p>Nenhum freelancer registado ainda.</p></div>
              ) : (
                <div className="fl-grid">
                  {freelancers.map((f,i) => {
                    const skills = Array.isArray(f.skills) ? f.skills : (() => { try { return JSON.parse(f.skills||"[]"); } catch { return []; } })();
                    return (
                      <div key={i} className="fl-card" onClick={() => router.push(`/freelancer/${f.id}`)}>
                        <div className="fl-av">{f.avatar ? <img src={f.avatar} alt={f.name}/> : f.name?.[0]}</div>
                        <div className="fl-name">{f.name}</div>
                        <div className="fl-bio">{f.bio||"Freelancer profissional em Mocambique"}</div>
                        <div className="fl-skills">{skills.slice(0,3).map((s:string,j:number) => <span key={j} className="fl-skill">{s}</span>)}</div>
                        <button className="btn-contact" onClick={e => { e.stopPropagation(); router.push("/messages"); }}>Contactar</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>}
          </div>
        </main>
      </div>
    </>
  );
}