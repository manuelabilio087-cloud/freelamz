"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const Send = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const Msg = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const Dollar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const Contract = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const Shield = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Star = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const User = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Dash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const Brief = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const Sun = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const Moon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const Out = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const Check = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>;
const Trend = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const Sett = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const Arr = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const Code = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const Pal = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
const Chart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [myPlan, setMyPlan] = useState<any>(null);
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

  const loadData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [pR, sR, plR] = await Promise.all([
        fetch(`${API_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/subscriptions/my-plan`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const pD = await pR.json(); const sD = await sR.json(); const plD = await plR.json();
      setProjects(Array.isArray(pD) ? pD : []);
      setStats(sD); setMyPlan(plD);
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

  const isPro = myPlan?.plan === "pro";
  const pUsed = myPlan?.proposals_used || 0;
  const pLimit = myPlan?.proposals_limit || 3;
  const compRate = stats?.proposals > 0 ? Math.round((stats.completed / stats.proposals) * 100) : 0;

  const navGo = (id: string) => {
    const routes: any = { messages:"/messages", contracts:"/contracts", payments:"/payments", disputes:"/disputes", profile:"/profile", pricing:"/pricing" };
    if (routes[id]) { router.push(routes[id]); return; }
    setTab(id);
  };

  const navSections = [
    { label: "Principal", items: [
      { id:"overview", label:"Visão geral", icon:<Dash/> },
      { id:"projects", label:"Projectos", icon:<Brief/> },
      { id:"proposals", label:"Propostas", icon:<Send/>, badge: stats?.pending },
      { id:"messages", label:"Mensagens", icon:<Msg/>, badge: stats?.unreadMessages },
    ]},
    { label: "Finanças", items: [
      { id:"contracts", label:"Contratos", icon:<Contract/> },
      { id:"payments", label:"Pagamentos", icon:<Dollar/> },
      { id:"disputes", label:"Disputas", icon:<Shield/> },
    ]},
    { label: "Conta", items: [
      { id:"profile", label:"Perfil", icon:<User/> },
      { id:"pricing", label:"Plano Pro", icon:<Star/> },
    ]},
  ];

  const catStyle: any = {
    "Desenvolvimento Web": { icon:<Code/>, bg:accB, col:accT },
    "Design Grafico": { icon:<Pal/>, bg:proB, col:proT },
    "Marketing Digital": { icon:<Chart/>, bg:ambB, col:ambT },
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
        .logo-mark{width:32px;height:32px;background:${acc};border-radius:8px;display:flex;align-items:center;justify-content:center}
        .logo-txt{font-size:17px;font-weight:700;color:${txt}}
        .logo-txt span{color:${acc}}
        .sb-nav{flex:1;overflow-y:auto;padding:12px 10px}
        .sec-lbl{font-size:10px;font-weight:600;color:${sub};text-transform:uppercase;letter-spacing:.8px;padding:8px 10px 4px}
        .nav-it{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;cursor:pointer;color:${sub};font-size:13.5px;font-weight:500;transition:all .15s;margin-bottom:1px}
        .nav-it:hover{background:${surf2};color:${txt}}
        .nav-it.active{background:${accB};color:${accT}}
        .nav-it.active svg{stroke:${accT}}
        .nav-bdg{margin-left:auto;background:${rd};color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;min-width:18px;text-align:center}
        .sb-bot{padding:12px 10px;border-top:1px solid ${bord}}
        .user-row{display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;cursor:pointer;transition:background .15s}
        .user-row:hover{background:${surf2}}
        .av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,${acc},${pro});display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;flex-shrink:0;overflow:hidden}
        .av img{width:100%;height:100%;object-fit:cover}
        .u-name{font-size:13px;font-weight:600;color:${txt}}
        .u-role{font-size:11px;color:${sub}}
        .main{margin-left:248px;flex:1;min-height:100vh;background:${bg}}
        .topbar{background:${surf};border-bottom:1px solid ${bord};padding:0 28px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:40}
        .pg-title{font-size:16px;font-weight:600;color:${txt}}
        .tb-right{display:flex;align-items:center;gap:8px}
        .ic-btn{width:34px;height:34px;border-radius:8px;border:1px solid ${bord};background:${surf2};display:flex;align-items:center;justify-content:center;cursor:pointer;color:${sub};transition:all .15s}
        .ic-btn:hover{color:${txt};border-color:${acc}}
        .pro-pill{display:flex;align-items:center;gap:5px;background:${proB};color:${proT};padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600}
        .cont{padding:24px 28px}
        .s-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .s-card{background:${surf};border:1px solid ${bord};border-radius:12px;padding:20px;transition:all .2s;cursor:default}
        .s-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,${dark?.15:.08})}
        .s-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .s-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center}
        .s-lbl{font-size:12px;color:${sub};font-weight:500}
        .s-val{font-size:26px;font-weight:700;color:${txt};margin-bottom:4px;line-height:1}
        .s-sub{font-size:12px;color:${sub};display:flex;align-items:center;gap:4px}
        .s-up{color:${grn}}
        .prog{height:4px;background:${bord};border-radius:2px;overflow:hidden;margin-top:10px}
        .prog-f{height:100%;border-radius:2px;transition:width .6s}
        .sec-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
        .sec-tit{font-size:15px;font-weight:600;color:${txt}}
        .lnk-btn{font-size:13px;color:${accT};background:none;border:none;cursor:pointer;font-weight:500;display:flex;align-items:center;gap:4px}
        .q-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
        .q-card{background:${surf};border:1px solid ${bord};border-radius:10px;padding:16px;cursor:pointer;text-align:center;transition:all .15s}
        .q-card:hover{border-color:${acc};transform:translateY(-1px)}
        .q-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px}
        .q-lbl{font-size:13px;font-weight:500;color:${txt}}
        .p-list{display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
        .p-row{background:${surf};border:1px solid ${bord};border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .15s}
        .p-row:hover{border-color:${acc}}
        .p-cat{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .p-inf{flex:1;min-width:0}
        .p-name{font-size:14px;font-weight:600;color:${txt};margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .p-meta{font-size:12px;color:${sub}}
        .p-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
        .badge{padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600}
        .b-open{background:${grnB};color:${grnT}}
        .b-pend{background:${ambB};color:${ambT}}
        .p-bud{font-size:14px;font-weight:700;color:${txt}}
        .plan-box{background:${surf};border:1px solid ${isPro ? pro : bord};border-radius:12px;padding:18px 20px;display:flex;align-items:center;gap:16px;margin-bottom:24px}
        .plan-ic{width:44px;height:44px;border-radius:10px;background:${proB};display:flex;align-items:center;justify-content:center;color:${proT};flex-shrink:0}
        .plan-inf{flex:1}
        .plan-tit{font-size:14px;font-weight:600;color:${txt};margin-bottom:3px}
        .plan-sub{font-size:12px;color:${sub};margin-bottom:8px}
        .plan-bar{height:4px;background:${bord};border-radius:2px;overflow:hidden}
        .plan-fill{height:100%;border-radius:2px;background:${pro}}
        .plan-meta{display:flex;justify-content:space-between;font-size:11px;color:${sub};margin-top:4px}
        .btn-up{background:${pro};color:#fff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;border:none;cursor:pointer;white-space:nowrap}
        .empty{text-align:center;padding:48px;background:${surf};border:1px solid ${bord};border-radius:12px;color:${sub}}
        .prof-card{background:${surf};border:1px solid ${bord};border-radius:12px;padding:32px;max-width:480px;margin:0 auto;text-align:center}
        .prof-av{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,${acc},${pro});display:flex;align-items:center;justify-content:center;color:#fff;font-size:30px;font-weight:700;margin:0 auto 16px;overflow:hidden}
        .prof-nm{font-size:22px;font-weight:700;color:${txt};margin-bottom:4px}
        .prof-em{font-size:13px;color:${sub};margin-bottom:20px}
        .prof-sts{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;background:${surf2};border-radius:10px;padding:16px;margin-bottom:20px}
        .ps-val{font-size:22px;font-weight:700;color:${accT}}
        .ps-lbl{font-size:11px;color:${sub};margin-top:2px}
        .btn-pri{background:${acc};color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;border:none;cursor:pointer}
        @media(max-width:900px){.sidebar{display:none}.main{margin-left:0}.s-grid{grid-template-columns:1fr 1fr}.q-grid{grid-template-columns:1fr 1fr}}
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
                    {it.badge && it.badge > 0 ? <span className="nav-bdg">{it.badge}</span> : null}
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
              <div><div className="u-name">{user?.name}</div><div className="u-role">{isPro ? "Freelancer Pro" : "Freelancer"}</div></div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="pg-title">{tab === "overview" ? `Olá, ${user?.name?.split(" ")[0] || "Freelancer"} 👋` : tab === "projects" ? "Projectos" : "Propostas"}</div>
            <div className="tb-right">
              {isPro && <div className="pro-pill"><Star/> Pro</div>}
              <div className="ic-btn" onClick={() => router.push("/messages")} title="Mensagens"><Msg/></div>
              <div className="ic-btn" onClick={() => router.push("/profile")} title="Definicoes"><Sett/></div>
            </div>
          </div>

          <div className="cont fade">
            {tab === "overview" && <>
              <div className="plan-box">
                <div className="plan-ic"><Star/></div>
                <div className="plan-inf">
                  <div className="plan-tit">{isPro ? "Plano Pro activo — propostas ilimitadas" : `Plano Gratuito — ${pUsed}/${pLimit} propostas usadas`}</div>
                  <div className="plan-sub">{isPro ? `Expira em ${myPlan?.subscription ? new Date(myPlan.subscription.expires_at).toLocaleDateString("pt-PT") : "—"}` : "200 MT/mes para propostas ilimitadas"}</div>
                  {!isPro && <><div className="plan-bar"><div className="plan-fill" style={{width:`${(pUsed/pLimit)*100}%`}}/></div><div className="plan-meta"><span>{pUsed} usadas</span><span>{pLimit-pUsed} restantes</span></div></>}
                </div>
                {!isPro && <button className="btn-up" onClick={() => router.push("/pricing")}>Upgrade Pro</button>}
              </div>

              <div className="s-grid">
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Propostas enviadas</div><div className="s-icon" style={{background:accB,color:accT}}><Send/></div></div>
                  <div className="s-val">{stats?.proposals || 0}</div>
                  <div className="s-sub s-up"><Trend/> Taxa aceitacao: {stats?.proposals > 0 ? Math.round((stats?.accepted/stats?.proposals)*100) : 0}%</div>
                  <div className="prog"><div className="prog-f" style={{width:`${stats?.proposals > 0 ? (stats?.accepted/stats?.proposals)*100 : 0}%`,background:acc}}/></div>
                </div>
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Projectos concluidos</div><div className="s-icon" style={{background:grnB,color:grnT}}><Check/></div></div>
                  <div className="s-val">{stats?.completed || 0}</div>
                  <div className="s-sub s-up"><Trend/> {compRate}% taxa de sucesso</div>
                </div>
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Ganhos totais</div><div className="s-icon" style={{background:ambB,color:ambT}}><Dollar/></div></div>
                  <div className="s-val">{stats?.earnings ? Number(stats.earnings).toLocaleString() : "0"}</div>
                  <div className="s-sub" style={{color:sub}}>MT acumulados</div>
                  <div className="prog"><div className="prog-f" style={{width:`${Math.min((stats?.earnings||0)/50000*100,100)}%`,background:amb}}/></div>
                </div>
                <div className="s-card">
                  <div className="s-top"><div className="s-lbl">Avaliacao media</div><div className="s-icon" style={{background:ambB,color:amb}}><Star/></div></div>
                  <div className="s-val">{stats?.rating || "—"}</div>
                  <div className="s-sub" style={{color:sub,display:"flex",gap:"2px"}}>
                    {[1,2,3,4,5].map(i => <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i<=Math.round(stats?.rating||0)?amb:"none"} stroke={amb} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                  </div>
                </div>
              </div>

              <div className="sec-row"><span className="sec-tit">Acesso rapido</span></div>
              <div className="q-grid">
                {[{l:"Mensagens",i:<Msg/>,p:"/messages",bg:accB,c:accT},{l:"Contratos",i:<Contract/>,p:"/contracts",bg:grnB,c:grnT},{l:"Pagamentos",i:<Dollar/>,p:"/payments",bg:ambB,c:ambT},{l:"Disputas",i:<Shield/>,p:"/disputes",bg:rdB,c:rdT}].map((q,i) => (
                  <div key={i} className="q-card" onClick={() => router.push(q.p)}>
                    <div className="q-icon" style={{background:q.bg,color:q.c}}>{q.i}</div>
                    <div className="q-lbl">{q.l}</div>
                  </div>
                ))}
              </div>

              <div className="sec-row">
                <span className="sec-tit">Projectos disponiveis</span>
                <button className="lnk-btn" onClick={() => router.push("/projects")}>Ver todos <Arr/></button>
              </div>
              <div className="p-list">
                {loading ? <div className="empty">A carregar...</div> : projects.slice(0,4).length === 0 ? (
                  <div className="empty"><p style={{marginBottom:"16px"}}>Nenhum projecto disponivel ainda.</p><button className="btn-pri" onClick={() => router.push("/projects")}>Ver projectos</button></div>
                ) : projects.slice(0,4).map((p,i) => {
                  const cs = catStyle[p.category] || {icon:<Brief/>,bg:surf2,col:sub};
                  return (
                    <div key={i} className="p-row" onClick={() => router.push(`/projects/${p.id}`)}>
                      <div className="p-cat" style={{background:cs.bg,color:cs.col}}>{cs.icon}</div>
                      <div className="p-inf"><div className="p-name">{p.title}</div><div className="p-meta">{p.category||"Geral"} · {p.client_name||"Cliente"}</div></div>
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
              <div className="sec-row"><span className="sec-tit">Projectos em andamento</span><button className="lnk-btn" onClick={() => router.push("/projects")}>Ver todos <Arr/></button></div>
              <div className="empty"><p style={{marginBottom:"16px"}}>Os teus projectos em andamento aparecem aqui.</p><button className="btn-pri" onClick={() => router.push("/projects")}>Encontrar projectos</button></div>
            </div>}

            {tab === "proposals" && <div className="fade">
              <div className="sec-row"><span className="sec-tit">As minhas propostas</span></div>
              <div className="empty"><p style={{marginBottom:"16px"}}>As tuas propostas enviadas aparecem aqui.</p><button className="btn-pri" onClick={() => router.push("/projects")}>Encontrar projectos</button></div>
            </div>}

            {tab === "profile" && <div className="fade">
              <div className="prof-card">
                <div className="prof-av">{user?.avatar ? <img src={user.avatar} alt={user?.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : user?.name?.[0]}</div>
                <div className="prof-nm">{user?.name}</div>
                <div className="prof-em">{user?.email}</div>
                <div className="prof-sts">
                  <div><div className="ps-val">{stats?.completed||0}</div><div className="ps-lbl">Concluidos</div></div>
                  <div><div className="ps-val">{stats?.rating||"—"}</div><div className="ps-lbl">Avaliacao</div></div>
                  <div><div className="ps-val">{stats?.earnings ? `${Math.round(Number(stats.earnings)/1000)}k` : "0"}</div><div className="ps-lbl">MT ganhos</div></div>
                </div>
                <button className="btn-pri" onClick={() => router.push("/profile")}>Editar perfil</button>
              </div>
            </div>}
          </div>
        </main>
      </div>
    </>
  );
}