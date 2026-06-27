"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const Plus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Brief = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const Msg = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const Dollar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const Contract = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const Shield = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Star = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const User = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Users = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Dash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const Sun = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const Moon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const Out = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const Sett = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const Arr = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const Bell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const Check = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const Eye = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const Clock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    const parsed = JSON.parse(u);
    if (parsed.role !== "client") { router.push("/dashboard"); return; }
    setUser(parsed);
    const d = localStorage.getItem("fl_dark") === "true";
    setDark(d);
    loadData();
  }, []);

  const toggleDark = () => { const n = !dark; setDark(n); localStorage.setItem("fl_dark", String(n)); };

  const loadData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [pR, prR, sR] = await Promise.all([
        fetch(`${API_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/proposals/received`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const pD = await pR.json();
      const prD = await prR.json();
      const sD = await sR.json();
      setProjects(Array.isArray(pD) ? pD.filter((p: any) => p.client_id === JSON.parse(localStorage.getItem("user")||"{}").id) : []);
      setProposals(Array.isArray(prD) ? prD : []);
      setStats(sD);
    } catch {}
    setLoading(false);
  };

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/"); };

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

  const myProjects = projects;
  const openP = myProjects.filter(p => p.status === "open" || !p.status).length;
  const inProgressP = myProjects.filter(p => p.status === "in_progress").length;
  const pendingProposals = proposals.filter(p => p.status === "pending").length;
  const totalSpent = stats?.spent || 0;

  const navGo = (id: string) => {
    const routes: any = { messages:"/messages", contracts:"/contracts", payments:"/payments", disputes:"/disputes", profile:"/profile", freelancers:"/freelancers" };
    if (routes[id]) { router.push(routes[id]); return; }
    setTab(id);
  };

  const navSections = [
    { label: "Principal", items: [
      { id:"overview", label:"Visão geral", icon:<Dash/> },
      { id:"myprojects", label:"Meus projectos", icon:<Brief/>, badge: myProjects.length },
      { id:"proposals", label:"Propostas recebidas", icon:<Bell/>, badge: pendingProposals },
      { id:"freelancers", label:"Freelancers", icon:<Users/> },
    ]},
    { label: "Finanças", items: [
      { id:"contracts", label:"Contratos", icon:<Contract/> },
      { id:"payments", label:"Pagamentos", icon:<Dollar/> },
      { id:"disputes", label:"Disputas", icon:<Shield/> },
    ]},
    { label: "Conta", items: [
      { id:"messages", label:"Mensagens", icon:<Msg/> },
      { id:"profile", label:"Perfil", icon:<User/> },
    ]},
  ];

  const statusCfg: any = {
    open:       { label:"Aberto",       bg:grnB, col:grnT, icon:<Check/> },
    in_progress:{ label:"Em andamento", bg:accB, col:accT, icon:<Clock/> },
    closed:     { label:"Fechado",      bg:surf2,col:sub,  icon:<Check/> },
    pending:    { label:"Pendente",     bg:ambB, col:ambT, icon:<Clock/> },
  };

  const propStatusCfg: any = {
    pending:  { label:"Pendente",  bg:ambB, col:ambT },
    accepted: { label:"Aceite",    bg:grnB, col:grnT },
    rejected: { label:"Rejeitado", bg:rdB,  col:rdT  },
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
        .client-tag{font-size:10px;font-weight:600;background:${grnB};color:${grnT};padding:2px 8px;border-radius:10px;margin-left:4px}
        .sb-nav{flex:1;overflow-y:auto;padding:12px 10px}
        .sec-lbl{font-size:10px;font-weight:600;color:${sub};text-transform:uppercase;letter-spacing:.8px;padding:8px 10px 4px}
        .nav-it{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;cursor:pointer;color:${sub};font-size:13.5px;font-weight:500;transition:all .15s;margin-bottom:1px}
        .nav-it:hover{background:${surf2};color:${txt}}
        .nav-it.active{background:${grnB};color:${grnT}}
        .nav-it.active svg{stroke:${grnT}}
        .nav-bdg{margin-left:auto;background:${acc};color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;min-width:18px;text-align:center}
        .nav-bdg.warn{background:${amb}}
        .sb-bot{padding:12px 10px;border-top:1px solid ${bord}}
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
        .btn-new:hover{opacity:.88}
        .cont{padding:24px 28px}
        .hero{background:linear-gradient(135deg,${grn} 0%,${acc} 100%);border-radius:14px;padding:24px 28px;margin-bottom:24px;color:#fff;display:flex;align-items:center;justify-content:space-between}
        .hero-left h2{font-size:22px;font-weight:700;margin-bottom:6px}
        .hero-left p{font-size:14px;opacity:.85}
        .hero-btn{background:#fff;color:${grn};padding:10px 20px;border-radius:8px;font-size:14px;font-weight:700;border:none;cursor:pointer;white-space:nowrap}
        .s-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .s-card{background:${surf};border:1px solid ${bord};border-radius:12px;padding:20px;transition:all .2s}
        .s-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,${dark?.15:.08})}
        .s-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .s-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center}
        .s-lbl{font-size:12px;color:${sub};font-weight:500}
        .s-val{font-size:26px;font-weight:700;color:${txt};margin-bottom:4px;line-height:1}
        .s-sub{font-size:12px;color:${sub}}
        .sec-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
        .sec-tit{font-size:15px;font-weight:600;color:${txt}}
        .lnk-btn{font-size:13px;color:${grnT};background:none;border:none;cursor:pointer;font-weight:500;display:flex;align-items:center;gap:4px}
        .q-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
        .q-card{background:${surf};border:1px solid ${bord};border-radius:10px;padding:16px;cursor:pointer;text-align:center;transition:all .15s}
        .q-card:hover{border-color:${grn};transform:translateY(-1px)}
        .q-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px}
        .q-lbl{font-size:13px;font-weight:500;color:${txt}}
        .proj-list{display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
        .proj-row{background:${surf};border:1px solid ${bord};border-radius:10px;padding:16px 18px;cursor:pointer;transition:all .15s}
        .proj-row:hover{border-color:${grn}}
        .proj-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}
        .proj-title{font-size:14px;font-weight:600;color:${txt};flex:1}
        .badge{padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;gap:4px}
        .proj-meta{display:flex;gap:16px}
        .proj-m{font-size:12px;color:${sub};display:flex;align-items:center;gap:4px}
        .proj-bud{font-size:14px;font-weight:700;color:${grnT}}
        .prop-list{display:flex;flex-direction:column;gap:8px}
        .prop-row{background:${surf};border:1px solid ${bord};border-radius:10px;padding:16px 18px;display:flex;align-items:center;gap:14px;transition:all .15s}
        .prop-row:hover{border-color:${acc}}
        .prop-av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,${acc},${pro});display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;font-weight:700;flex-shrink:0}
        .prop-inf{flex:1;min-width:0}
        .prop-name{font-size:14px;font-weight:600;color:${txt};margin-bottom:3px}
        .prop-proj{font-size:12px;color:${sub};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .prop-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
        .prop-price{font-size:15px;font-weight:700;color:${txt}}
        .btn-view{padding:6px 14px;border-radius:7px;font-size:12px;font-weight:600;border:1px solid ${bord};background:${surf2};color:${sub};cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px}
        .btn-view:hover{border-color:${acc};color:${accT}}
        .empty{text-align:center;padding:48px;background:${surf};border:1px solid ${bord};border-radius:12px;color:${sub}}
        .user-row{display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;cursor:pointer;transition:background .15s}
        .user-row:hover{background:${surf2}}
        @media(max-width:900px){.sidebar{display:none}.main{margin-left:0}.s-grid{grid-template-columns:1fr 1fr}.q-grid{grid-template-columns:1fr 1fr}.hero{flex-direction:column;gap:16px;text-align:center}}
      `}</style>

      <div className="shell">
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="logo-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="logo-txt">Freelamz<span>.</span></span>
            <span className="client-tag">Cliente</span>
          </div>

          <nav className="sb-nav">
            {navSections.map(sec => (
              <div key={sec.label}>
                <div className="sec-lbl">{sec.label}</div>
                {sec.items.map(it => (
                  <div key={it.id} className={`nav-it ${tab === it.id ? "active" : ""}`} onClick={() => navGo(it.id)}>
                    {it.icon} {it.label}
                    {it.badge && it.badge > 0 ? <span className={`nav-bdg ${it.id === "proposals" ? "warn" : ""}`}>{it.badge}</span> : null}
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
            <div className="pg-title">
              {tab === "overview" ? `Bem-vindo, ${user?.name?.split(" ")[0] || "Cliente"} 👋` :
               tab === "myprojects" ? "Meus Projectos" :
               tab === "proposals" ? "Propostas Recebidas" : "Dashboard"}
            </div>
            <div className="tb-right">
              <div className="ic-btn" onClick={() => router.push("/messages")} title="Mensagens"><Msg/></div>
              <div className="ic-btn" onClick={toggleDark} title="Tema">{dark ? <Sun/> : <Moon/>}</div>
              <div className="ic-btn" onClick={() => router.push("/profile")} title="Definicoes"><Sett/></div>
              <button className="btn-new" onClick={() => router.push("/projects/new")}><Plus/> Novo projecto</button>
            </div>
          </div>

          <div className="cont fade">
            {tab === "overview" && <>
              <div className="hero">
                <div className="hero-left">
                  <h2>Encontra o freelancer certo para o teu projecto</h2>
                  <p>Moçambique tem talento. Publica o teu projecto e recebe propostas em minutos.</p>
                </div>
                <button className="hero-btn" onClick={() => router.push("/projects/new")}>+ Publicar projecto</button>
              </div>

              <div className="s-grid">
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Projectos publicados</div><div className="s-icon" style={{background:accB,color:accT}}><Brief/></div></div>
                  <div className="s-val">{myProjects.length}</div>
                  <div className="s-sub">{openP} abertos · {inProgressP} em andamento</div>
                </div>
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Propostas recebidas</div><div className="s-icon" style={{background:ambB,color:ambT}}><Bell/></div></div>
                  <div className="s-val">{proposals.length}</div>
                  <div className="s-sub">{pendingProposals} a aguardar resposta</div>
                </div>
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Total investido</div><div className="s-icon" style={{background:grnB,color:grnT}}><Dollar/></div></div>
                  <div className="s-val">{Number(totalSpent).toLocaleString()}</div>
                  <div className="s-sub" style={{color:sub}}>MT em projectos</div>
                </div>
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Contratos activos</div><div className="s-icon" style={{background:proB,color:proT}}><Contract/></div></div>
                  <div className="s-val">{inProgressP}</div>
                  <div className="s-sub" style={{color:sub}}>em execução agora</div>
                </div>
              </div>

              <div className="sec-row"><span className="sec-tit">Acesso rápido</span></div>
              <div className="q-grid">
                {[
                  {l:"Freelancers",  i:<Users/>,    p:"/freelancers", bg:accB, c:accT},
                  {l:"Mensagens",    i:<Msg/>,       p:"/messages",   bg:proB, c:proT},
                  {l:"Contratos",    i:<Contract/>,  p:"/contracts",  bg:grnB, c:grnT},
                  {l:"Disputas",     i:<Shield/>,    p:"/disputes",   bg:rdB,  c:rdT},
                ].map((q,i) => (
                  <div key={i} className="q-card" onClick={() => router.push(q.p)}>
                    <div className="q-icon" style={{background:q.bg,color:q.c}}>{q.i}</div>
                    <div className="q-lbl">{q.l}</div>
                  </div>
                ))}
              </div>

              {pendingProposals > 0 && <>
                <div className="sec-row">
                  <span className="sec-tit">Propostas a aguardar resposta <span style={{background:ambB,color:ambT,padding:"2px 8px",borderRadius:"10px",fontSize:"11px",fontWeight:"700",marginLeft:"8px"}}>{pendingProposals}</span></span>
                  <button className="lnk-btn" onClick={() => setTab("proposals")}>Ver todas <Arr/></button>
                </div>
                <div className="prop-list" style={{marginBottom:"24px"}}>
                  {proposals.filter(p => p.status === "pending").slice(0,3).map((p,i) => {
                    const ps = propStatusCfg[p.status] || propStatusCfg.pending;
                    return (
                      <div key={i} className="prop-row">
                        <div className="prop-av">{p.freelancer_name?.[0] || "F"}</div>
                        <div className="prop-inf">
                          <div className="prop-name">{p.freelancer_name || "Freelancer"}</div>
                          <div className="prop-proj">{p.project_title || `Proposta #${p.id}`}</div>
                        </div>
                        <div className="prop-right">
                          <span className="badge" style={{background:ps.bg,color:ps.col}}>{ps.label}</span>
                          <span className="prop-price">{p.price ? `${Number(p.price).toLocaleString()} MT` : "—"}</span>
                          <button className="btn-view" onClick={() => router.push(`/projects/${p.project_id}`)}><Eye/> Ver</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>}

              <div className="sec-row">
                <span className="sec-tit">Os meus projectos</span>
                <button className="lnk-btn" onClick={() => setTab("myprojects")}>Ver todos <Arr/></button>
              </div>
              <div className="proj-list">
                {loading ? <div className="empty">A carregar...</div> : myProjects.slice(0,4).length === 0 ? (
                  <div className="empty">
                    <p style={{marginBottom:"16px",fontSize:"14px"}}>Ainda não publicaste nenhum projecto.</p>
                    <button style={{background:grn,color:"#fff",padding:"10px 20px",borderRadius:"8px",fontSize:"14px",fontWeight:"600",border:"none",cursor:"pointer"}} onClick={() => router.push("/projects/new")}>Publicar primeiro projecto</button>
                  </div>
                ) : myProjects.slice(0,4).map((p,i) => {
                  const sc = statusCfg[p.status||"open"];
                  return (
                    <div key={i} className="proj-row" onClick={() => router.push(`/projects/${p.id}`)}>
                      <div className="proj-top">
                        <div className="proj-title">{p.title}</div>
                        <span className="badge" style={{background:sc.bg,color:sc.col,flexShrink:0}}>{sc.icon} {sc.label}</span>
                      </div>
                      <div className="proj-meta">
                        <span className="proj-m"><Brief/> {p.category || "Geral"}</span>
                        <span className="proj-m"><Clock/> {new Date(p.created_at).toLocaleDateString("pt-PT")}</span>
                        <span className="proj-bud">{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>}

            {tab === "myprojects" && <div className="fade">
              <div className="sec-row">
                <span className="sec-tit">Todos os meus projectos ({myProjects.length})</span>
                <button className="btn-new" onClick={() => router.push("/projects/new")}><Plus/> Novo projecto</button>
              </div>
              <div className="proj-list">
                {myProjects.length === 0 ? (
                  <div className="empty"><p style={{marginBottom:"16px",fontSize:"14px"}}>Ainda sem projectos publicados.</p><button style={{background:grn,color:"#fff",padding:"10px 20px",borderRadius:"8px",fontSize:"14px",fontWeight:"600",border:"none",cursor:"pointer"}} onClick={() => router.push("/projects/new")}>Publicar projecto</button></div>
                ) : myProjects.map((p,i) => {
                  const sc = statusCfg[p.status||"open"];
                  return (
                    <div key={i} className="proj-row" onClick={() => router.push(`/projects/${p.id}`)}>
                      <div className="proj-top">
                        <div className="proj-title">{p.title}</div>
                        <span className="badge" style={{background:sc.bg,color:sc.col,flexShrink:0}}>{sc.icon} {sc.label}</span>
                      </div>
                      <div className="proj-meta">
                        <span className="proj-m"><Brief/> {p.category || "Geral"}</span>
                        <span className="proj-m"><Clock/> {new Date(p.created_at).toLocaleDateString("pt-PT")}</span>
                        <span className="proj-bud">{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>}

            {tab === "proposals" && <div className="fade">
              <div className="sec-row"><span className="sec-tit">Propostas recebidas ({proposals.length})</span></div>
              <div className="prop-list">
                {proposals.length === 0 ? (
                  <div className="empty"><p style={{fontSize:"14px"}}>Ainda sem propostas. Publica um projecto para começar a receber!</p></div>
                ) : proposals.map((p,i) => {
                  const ps = propStatusCfg[p.status] || propStatusCfg.pending;
                  return (
                    <div key={i} className="prop-row">
                      <div className="prop-av">{p.freelancer_name?.[0] || "F"}</div>
                      <div className="prop-inf">
                        <div className="prop-name">{p.freelancer_name || "Freelancer"}</div>
                        <div className="prop-proj">{p.project_title || `Proposta #${p.id}`}</div>
                      </div>
                      <div className="prop-right">
                        <span className="badge" style={{background:ps.bg,color:ps.col}}>{ps.label}</span>
                        <span className="prop-price">{p.price ? `${Number(p.price).toLocaleString()} MT` : "—"}</span>
                        <button className="btn-view" onClick={e => { e.stopPropagation(); router.push(`/projects/${p.project_id}`); }}><Eye/> Ver projecto</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>}
          </div>
        </main>
      </div>
    </>
  );
}