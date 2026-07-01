"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";
const ADMIN_EMAIL = "manuelabilio087@gmail.com";

/* ───────── icons ───────── */
const Icon = ({ d, d2, d3, circle, rect, poly, line, w = 16 }: any) => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d && <path d={d} />}{d2 && <path d={d2} />}{d3 && <path d={d3} />}
    {circle && <circle cx={circle[0]} cy={circle[1]} r={circle[2]} />}
    {rect && <rect x={rect[0]} y={rect[1]} width={rect[2]} height={rect[3]} rx={rect[4] || 0} />}
    {poly && <polyline points={poly} />}
    {line && <line x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} />}
  </svg>
);

const TAB_LABELS: Record<string, string> = {
  overview: "Visao Geral", users: "Utilizadores", gigs: "Servicos",
  projects: "Projectos", orders: "Encomendas", revenue: "Receita",
  disputes: "Disputas", newsletter: "Newsletter",
};

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState("overview");
  const [dark, setDark] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* data */
  const [users, setUsers] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any>(null);

  /* newsletter */
  const [nlSubject, setNlSubject] = useState("");
  const [nlMessage, setNlMessage] = useState("");
  const [nlSending, setNlSending] = useState(false);
  const [nlSent, setNlSent] = useState(false);

  /* search */
  const [searchUser, setSearchUser] = useState("");
  const [searchGig, setSearchGig] = useState("");
  const [searchProject, setSearchProject] = useState("");

  /* ─── auth check ─── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (!token || !u) { router.push("/admin/login"); return; }
    const parsed = JSON.parse(u);
    if (parsed.email !== ADMIN_EMAIL || !parsed.is_admin) {
      localStorage.removeItem("token"); localStorage.removeItem("user");
      router.push("/admin/login"); return;
    }
    setUser(parsed);
    setDark(localStorage.getItem("adminDark") === "true");
    loadAll();
  }, []);

  const token = () => localStorage.getItem("token") || "";
  const authH = () => ({ Authorization: `Bearer ${token()}` });
  const jsonH = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

  const loadAll = async () => {
    try {
      const [uR, gR, pR, oR, rR, dR] = await Promise.all([
        fetch(`${API_URL}/users/all`, { headers: authH() }),
        fetch(`${API_URL}/gigs`, { headers: authH() }),
        fetch(`${API_URL}/projects`, { headers: authH() }),
        fetch(`${API_URL}/orders`, { headers: authH() }),
        fetch(`${API_URL}/subscriptions/revenue`, { headers: authH() }),
        fetch(`${API_URL}/disputes/all`, { headers: authH() }),
      ]);
      const [uD, gD, pD, oD, rD, dD] = await Promise.all([uR.json(), gR.json(), pR.json(), oR.json(), rR.json(), dR.json()]);
      setUsers(Array.isArray(uD) ? uD : []);
      setGigs(Array.isArray(gD) ? gD : []);
      setProjects(Array.isArray(pD) ? pD : []);
      setOrders(Array.isArray(oD) ? oD : []);
      if (rR.ok) setRevenue(rD);
      setDisputes(Array.isArray(dD) ? dD : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  /* actions */
  const deleteUser = async (id: number) => {
    if (!confirm("Remover utilizador?")) return;
    await fetch(`${API_URL}/users/${id}`, { method: "DELETE", headers: authH() });
    setUsers(u => u.filter(x => x.id !== id));
  };
  const toggleVerify = async (id: number, cur: boolean) => {
    const res = await fetch(`${API_URL}/users/verify/${id}`, { method: "PUT", headers: jsonH(), body: JSON.stringify({ verified: !cur }) });
    if (res.ok) setUsers(u => u.map(x => x.id === id ? { ...x, verified: !cur } : x));
  };
  const deleteGig = async (id: number) => {
    if (!confirm("Remover este servico?")) return;
    await fetch(`${API_URL}/gigs/${id}`, { method: "DELETE", headers: authH() });
    setGigs(g => g.filter(x => x.id !== id));
  };
  const deleteProject = async (id: number) => {
    if (!confirm("Remover projecto?")) return;
    await fetch(`${API_URL}/projects/${id}`, { method: "DELETE", headers: authH() });
    setProjects(p => p.filter(x => x.id !== id));
  };
  const resolveDispute = async (id: number) => {
    const resolution = prompt("Escreve a resolucao:");
    if (!resolution) return;
    const res = await fetch(`${API_URL}/disputes/${id}/resolve`, { method: "PUT", headers: jsonH(), body: JSON.stringify({ resolution, status: "resolved" }) });
    if (res.ok) setDisputes(d => d.map(x => x.id === id ? { ...x, status: "resolved", resolution } : x));
  };
  const sendNewsletter = async () => {
    if (!nlSubject.trim() || !nlMessage.trim()) return;
    setNlSending(true);
    const res = await fetch(`${API_URL}/users/newsletter`, { method: "POST", headers: jsonH(), body: JSON.stringify({ subject: nlSubject, message: nlMessage }) });
    if (res.ok) { setNlSent(true); setNlSubject(""); setNlMessage(""); setTimeout(() => setNlSent(false), 4000); }
    setNlSending(false);
  };

  /* ─── derived ─── */
  const freelancers = users.filter(u => u.role === "freelancer");
  const clients = users.filter(u => u.role === "client");
  const verified = freelancers.filter(u => u.verified).length;
  const openDisputes = disputes.filter(d => d.status === "open").length;
  const filtUsers = users.filter(u => u.name?.toLowerCase().includes(searchUser.toLowerCase()) || u.email?.toLowerCase().includes(searchUser.toLowerCase()));
  const filtGigs = gigs.filter(g => g.title?.toLowerCase().includes(searchGig.toLowerCase()) || g.freelancer_name?.toLowerCase().includes(searchGig.toLowerCase()));
  const filtProjects = projects.filter(p => p.title?.toLowerCase().includes(searchProject.toLowerCase()));

  /* ─── theme ─── */
  const bg        = dark ? "#0f1117" : "#f5f6fa";
  const surf      = dark ? "#1a1d27" : "#ffffff";
  const surf2     = dark ? "#242736" : "#f8f9fc";
  const bord      = dark ? "#2e3245" : "#e8eaf0";
  const txt       = dark ? "#e8eaf0" : "#1a1d27";
  const sub       = dark ? "#8b90a7" : "#6b7280";
  const acc       = "#6366f1";
  const accL      = dark ? "#1e1f3a" : "#eef2ff";
  const grn       = "#10b981";
  const grnL      = dark ? "#0d2818" : "#ecfdf5";
  const red       = "#ef4444";
  const redL      = dark ? "#2d1515" : "#fef2f2";
  const yel       = "#f59e0b";
  const yelL      = dark ? "#2d1f00" : "#fffbeb";

  const badge = (label: string, color: string, bg: string) => (
    <span style={{ background: bg, color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>
  );

  const navItems = [
    { id: "overview",  label: "Visao Geral",    color: acc, icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
    { id: "users",     label: "Utilizadores",   color: grn, icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
    { id: "gigs",      label: "Servicos",       color: yel, icon: "M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" },
    { id: "projects",  label: "Projectos",      color: "#8b5cf6", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
    { id: "orders",    label: "Encomendas",     color: "#0ea5e9", icon: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" },
    { id: "revenue",   label: "Receita",        color: grn, icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
    { id: "disputes",  label: "Disputas",       color: red, icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { id: "newsletter",label: "Newsletter",     color: acc, icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" },
  ];

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: bg, color: txt, fontFamily: "Inter,sans-serif", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${bord}`, borderTopColor: acc, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: sub, fontSize: 14 }}>A carregar painel...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ─── nav item render ─── */
  const NavItem = ({ item }: { item: typeof navItems[0] }) => (
    <div
      onClick={() => { setTab(item.id); setSideOpen(false); }}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
        borderRadius: 10, cursor: "pointer", fontSize: 13.5, fontWeight: 500,
        marginBottom: 2, transition: "all 0.15s",
        background: tab === item.id ? `${item.color}18` : "transparent",
        color: tab === item.id ? item.color : sub,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d={item.icon} />{item.id === "users" && <circle cx="9" cy="7" r="4" />}
      </svg>
      {item.label}
      {item.id === "disputes" && openDisputes > 0 && (
        <span style={{ marginLeft: "auto", background: redL, color: red, fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{openDisputes}</span>
      )}
      {item.id === "users" && <span style={{ marginLeft: "auto", fontSize: 11, color: sub }}>{users.length}</span>}
      {item.id === "gigs" && <span style={{ marginLeft: "auto", fontSize: 11, color: sub }}>{gigs.length}</span>}
    </div>
  );

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: surf, borderRight: `1px solid ${bord}` }}>
      {/* logo */}
      <div style={{ padding: "18px 16px", borderBottom: `1px solid ${bord}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: acc, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: txt }}>Freel<span style={{ color: acc }}>amz</span></div>
          <div style={{ fontSize: 10, color: sub, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Admin</div>
        </div>
      </div>
      {/* nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 8px 8px" }}>Gestao</div>
        {navItems.map(item => <NavItem key={item.id} item={item} />)}
        <div style={{ borderTop: `1px solid ${bord}`, marginTop: 12, paddingTop: 12 }}>
          <div onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13.5, fontWeight: 500, color: sub }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>Ver site
          </div>
          <div onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/admin/login"); }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13.5, fontWeight: 500, color: red }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>Sair
          </div>
        </div>
      </nav>
      {/* footer */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${bord}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${acc},#8b5cf6)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>
            {user?.name?.[0] || "A"}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: txt }}>{user?.name?.split(" ")[0]}</div>
            <div style={{ fontSize: 10, color: acc }}>Admin</div>
          </div>
        </div>
        <button onClick={() => { const n = !dark; setDark(n); localStorage.setItem("adminDark", String(n)); }}
          style={{ background: surf2, border: `1px solid ${bord}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: txt, fontSize: 16 }}>
          {dark ? "☀" : "☾"}
        </button>
      </div>
    </div>
  );

  /* ─── shared table header ─── */
  const THead = ({ cols }: { cols: string[] }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, 1fr)`, padding: "10px 20px", background: surf2, fontSize: 11, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: "0.5px" }} className="admin-thead">
      {cols.map(c => <span key={c}>{c}</span>)}
    </div>
  );

  /* ─── stat card ─── */
  const Stat = ({ label, value, color, bg: bg2, icon }: any) => (
    <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">{icon}</svg>
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: txt, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: sub, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );

  /* ─── ACTION btn ─── */
  const Btn = ({ label, color, bg: bg2, onClick }: any) => (
    <button onClick={onClick} style={{ background: bg2, color, border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{label}</button>
  );

  /* ─── input field ─── */
  const Input = ({ value, onChange, placeholder, style: s }: any) => (
    <input value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: "100%", padding: "10px 14px", border: `1px solid ${bord}`, borderRadius: 10, fontSize: 14, outline: "none", background: surf2, color: txt, fontFamily: "inherit", ...s }} />
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade { animation: fadeUp 0.25s ease; }
        .admin-sidebar { width: 240px; position: fixed; top: 0; left: 0; height: 100vh; z-index: 70; transition: transform 0.25s; }
        .admin-main   { margin-left: 240px; flex: 1; }
        .admin-overlay { display: none; }
        .admin-burger  { display: none; }
        .admin-thead   { display: grid; }
        .admin-trow    { display: grid; }
        @media (max-width: 900px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main   { margin-left: 0; }
          .admin-burger  { display: flex !important; }
          .admin-overlay.open { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 65; }
        }
        @media (max-width: 640px) {
          .admin-thead { display: none !important; }
          .admin-trow  { grid-template-columns: 1fr !important; gap: 4px !important; }
          .admin-trow > *:not(:first-child) { font-size: 11px; color: #9ca3af; }
        }
      `}</style>

      {/* overlay */}
      {sideOpen && <div className="admin-overlay open" onClick={() => setSideOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sideOpen ? "open" : ""}`}><SidebarContent /></aside>

      {/* MAIN */}
      <main className="admin-main" style={{ display: "flex", flexDirection: "column" }}>
        {/* topbar */}
        <div style={{ background: surf, borderBottom: `1px solid ${bord}`, padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="admin-burger" onClick={() => setSideOpen(true)}
              style={{ display: "none", background: "none", border: `1px solid ${bord}`, borderRadius: 8, width: 36, height: 36, alignItems: "center", justifyContent: "center", cursor: "pointer", color: txt, flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: txt }}>{TAB_LABELS[tab] || tab}</div>
              <div style={{ fontSize: 11, color: sub }}>Painel · Freelamz</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {openDisputes > 0 && tab !== "disputes" && (
              <button onClick={() => setTab("disputes")} style={{ background: redL, color: red, border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {openDisputes} disputa{openDisputes > 1 ? "s" : ""} aberta{openDisputes > 1 ? "s" : ""}
              </button>
            )}
            <button onClick={() => loadAll()} title="Atualizar" style={{ background: surf2, border: `1px solid ${bord}`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: sub }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: "28px 24px", flex: 1 }}>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="fade">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
                <Stat label="Total Utilizadores" value={users.length} color={acc} bg={accL} icon={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />
                <Stat label="Freelancers" value={freelancers.length} color={grn} bg={grnL} icon={<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>} />
                <Stat label="Clientes" value={clients.length} color={yel} bg={yelL} icon={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />
                <Stat label="Servicos publicados" value={gigs.length} color={acc} bg={accL} icon={<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></>} />
                <Stat label="Projectos" value={projects.length} color="#8b5cf6" bg={dark ? "#1e1030" : "#f5f3ff"} icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>} />
                <Stat label="Encomendas" value={orders.length} color="#0ea5e9" bg={dark ? "#0c1a2e" : "#f0f9ff"} icon={<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>} />
                <Stat label="Disputas abertas" value={openDisputes} color={red} bg={redL} icon={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>} />
                <Stat label="Verificados" value={verified} color={grn} bg={grnL} icon={<><polyline points="20 6 9 17 4 12"/></>} />
              </div>

              {/* distribuicao */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 28 }}>
                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 14, padding: 24 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: txt, marginBottom: 16 }}>Distribuicao de utilizadores</div>
                  {[{ label: "Freelancers", val: freelancers.length, pct: Math.round(freelancers.length / Math.max(users.length, 1) * 100), color: grn },
                    { label: "Clientes", val: clients.length, pct: Math.round(clients.length / Math.max(users.length, 1) * 100), color: acc },
                    { label: "Verificados", val: verified, pct: Math.round(verified / Math.max(freelancers.length, 1) * 100), color: yel },
                  ].map(r => (
                    <div key={r.label} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: sub, marginBottom: 5 }}>
                        <span>{r.label}</span><span style={{ color: r.color, fontWeight: 700 }}>{r.val} ({r.pct}%)</span>
                      </div>
                      <div style={{ height: 6, background: bord, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${r.pct}%`, background: r.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 14, padding: 24 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: txt, marginBottom: 16 }}>Ultimos utilizadores</div>
                  {users.slice(-5).reverse().map((u, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: i < 4 ? `1px solid ${bord}` : "none" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: u.role === "freelancer" ? grnL : accL, display: "flex", alignItems: "center", justifyContent: "center", color: u.role === "freelancer" ? grn : acc, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: txt, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: sub }}>{u.email}</div>
                      </div>
                      {badge(u.role === "freelancer" ? "FL" : "CL", u.role === "freelancer" ? grn : acc, u.role === "freelancer" ? grnL : accL)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {tab === "users" && (
            <div className="fade">
              <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${bord}`, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <Input value={searchUser} onChange={(e: any) => setSearchUser(e.target.value)} placeholder="Pesquisar por nome ou email..." style={{ maxWidth: 300 }} />
                  <span style={{ fontSize: 13, color: sub, marginLeft: "auto" }}>{filtUsers.length} utilizadores</span>
                </div>
                <THead cols={["Utilizador", "Email", "Tipo", "Estado", "Acoes"]} />
                {filtUsers.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: sub }}>Nenhum utilizador encontrado.</div>
                ) : filtUsers.map((u, i) => (
                  <div key={i} className="admin-trow" style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: `1px solid ${bord}`, alignItems: "center", gap: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: txt, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: sub, overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</div>
                    {badge(u.role === "freelancer" ? "Freelancer" : "Cliente", u.role === "freelancer" ? grn : acc, u.role === "freelancer" ? grnL : accL)}
                    {badge(u.verified ? "Verificado" : "Pendente", u.verified ? grn : yel, u.verified ? grnL : yelL)}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {u.role === "freelancer" && <Btn label={u.verified ? "Remover" : "Verificar"} color={u.verified ? yel : grn} bg={u.verified ? yelL : grnL} onClick={() => toggleVerify(u.id, u.verified)} />}
                      <Btn label="Apagar" color={red} bg={redL} onClick={() => deleteUser(u.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── GIGS ── */}
          {tab === "gigs" && (
            <div className="fade">
              <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${bord}`, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <Input value={searchGig} onChange={(e: any) => setSearchGig(e.target.value)} placeholder="Pesquisar servico ou freelancer..." style={{ maxWidth: 300 }} />
                  <span style={{ fontSize: 13, color: sub, marginLeft: "auto" }}>{filtGigs.length} servicos</span>
                </div>
                <THead cols={["Servico", "Freelancer", "Categoria", "Preco", "Acoes"]} />
                {filtGigs.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: sub }}>Nenhum servico encontrado.</div>
                ) : filtGigs.map((g, i) => (
                  <div key={i} className="admin-trow" style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: `1px solid ${bord}`, alignItems: "center", gap: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: txt, overflow: "hidden", textOverflow: "ellipsis" }}>
                      <a href={`/gig/${g.id}`} target="_blank" rel="noreferrer" style={{ color: acc, textDecoration: "none" }}>{g.title}</a>
                    </div>
                    <div style={{ fontSize: 12, color: sub }}>{g.freelancer_name}</div>
                    <div style={{ fontSize: 12, color: sub }}>{g.category || "—"}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: grn }}>{g.starting_price ? `${g.starting_price} MT` : "—"}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn label="Remover" color={red} bg={redL} onClick={() => deleteGig(g.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {tab === "projects" && (
            <div className="fade">
              <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${bord}`, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <Input value={searchProject} onChange={(e: any) => setSearchProject(e.target.value)} placeholder="Pesquisar projecto..." style={{ maxWidth: 300 }} />
                  <span style={{ fontSize: 13, color: sub, marginLeft: "auto" }}>{filtProjects.length} projectos</span>
                </div>
                <THead cols={["Projecto", "Cliente", "Categoria", "Orcamento", "Acoes"]} />
                {filtProjects.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: sub }}>Nenhum projecto encontrado.</div>
                ) : filtProjects.map((p, i) => (
                  <div key={i} className="admin-trow" style={{ display: "grid", gridTemplateColumns: "3fr 2fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: `1px solid ${bord}`, alignItems: "center", gap: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: txt, overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: sub }}>{p.client_name || "—"}</div>
                    <div style={{ fontSize: 12, color: sub }}>{p.category || "—"}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: grn }}>{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "—"}</div>
                    <Btn label="Remover" color={red} bg={redL} onClick={() => deleteProject(p.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === "orders" && (
            <div className="fade">
              <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${bord}`, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["all", "in_progress", "delivered", "completed", "cancelled"].map(s => {
                    const count = s === "all" ? orders.length : orders.filter(o => o.status === s).length;
                    const labels: any = { all: "Todas", in_progress: "Em progresso", delivered: "Entregue", completed: "Concluidas", cancelled: "Canceladas" };
                    return (
                      <button key={s} style={{ padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: surf2, color: sub }}>
                        {labels[s]} ({count})
                      </button>
                    );
                  })}
                </div>
                <THead cols={["ID", "Servico", "Cliente", "Freelancer", "Total", "Estado"]} />
                {orders.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: sub }}>Nenhuma encomenda ainda.</div>
                ) : orders.slice(0, 50).map((o, i) => {
                  const stMap: any = { pending: [yel, yelL, "Pendente"], in_progress: [acc, accL, "Em progresso"], delivered: ["#0ea5e9", dark ? "#0c1a2e" : "#f0f9ff", "Entregue"], completed: [grn, grnL, "Concluida"], cancelled: [red, redL, "Cancelada"], revision_requested: [yel, yelL, "Revisao"] };
                  const st = stMap[o.status] || [sub, surf2, o.status];
                  return (
                    <div key={i} className="admin-trow" style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 1fr 1fr", padding: "12px 20px", borderBottom: `1px solid ${bord}`, alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 12, color: sub }}>#{o.id}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: txt, overflow: "hidden", textOverflow: "ellipsis" }}>{o.gig_title || "—"}</div>
                      <div style={{ fontSize: 12, color: sub }}>{o.client_name || "—"}</div>
                      <div style={{ fontSize: 12, color: sub }}>{o.freelancer_name || "—"}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: grn }}>{o.total_amount ? `${Number(o.total_amount).toLocaleString()} MT` : "—"}</div>
                      {badge(st[2], st[0], st[1])}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── REVENUE ── */}
          {tab === "revenue" && (
            <div className="fade">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
                <Stat label="Receita Total" value={`${revenue ? Number(revenue.total_revenue).toLocaleString() : 0} MT`} color={grn} bg={grnL} icon={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>} />
                <Stat label="Subscricoes Pro" value={`${revenue ? Number(revenue.subscription_revenue).toLocaleString() : 0} MT`} color={acc} bg={accL} icon={<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>} />
                <Stat label="Comissoes 5%" value={`${revenue ? Number(revenue.commission_revenue).toLocaleString() : 0} MT`} color={yel} bg={yelL} icon={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>} />
                <Stat label="Planos Pro Ativos" value={revenue?.active_pro_users || 0} color="#8b5cf6" bg={dark ? "#1e1030" : "#f5f3ff"} icon={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>} />
              </div>
              <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 14, padding: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: txt, marginBottom: 20 }}>Resumo Financeiro</div>
                {[
                  { label: "Preco Plano Pro", value: "200 MT / mes" },
                  { label: "Taxa de comissao", value: "5% por transaccao" },
                  { label: "Receita mensal (subscricoes)", value: `${revenue ? Number(revenue.monthly_revenue || 0).toLocaleString() : 0} MT` },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${bord}`, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontSize: 14, color: sub }}>{r.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: txt }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DISPUTES ── */}
          {tab === "disputes" && (
            <div className="fade">
              <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${bord}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: txt }}>Disputas</div>
                  {openDisputes > 0 && badge(`${openDisputes} abertas`, red, redL)}
                </div>
                {disputes.length === 0 ? (
                  <div style={{ padding: 48, textAlign: "center", color: sub }}>Nenhuma disputa encontrada.</div>
                ) : disputes.map((d, i) => (
                  <div key={i} style={{ padding: "18px 24px", borderBottom: `1px solid ${bord}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: txt, marginBottom: 3 }}>{d.project_title || `Contrato #${d.contract_id}`}</div>
                        <div style={{ fontSize: 12, color: acc, fontWeight: 600 }}>{d.reason}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {badge(d.status === "open" ? "Aberta" : d.status === "resolved" ? "Resolvida" : "Fechada", d.status === "open" ? yel : d.status === "resolved" ? grn : sub, d.status === "open" ? yelL : d.status === "resolved" ? grnL : surf2)}
                        {d.status === "open" && <Btn label="Resolver" color={grn} bg={grnL} onClick={() => resolveDispute(d.id)} />}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: sub, marginBottom: 6 }}>{d.description?.substring(0, 120)}</p>
                    <div style={{ fontSize: 11, color: sub }}>Aberta por {d.opened_by_name} · {new Date(d.created_at).toLocaleDateString("pt-PT")}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NEWSLETTER ── */}
          {tab === "newsletter" && (
            <div className="fade" style={{ maxWidth: 600 }}>
              <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 14, padding: 28 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: txt, marginBottom: 6 }}>Enviar Newsletter</div>
                <p style={{ fontSize: 13, color: sub, marginBottom: 24 }}>Envia um email para todos os utilizadores registados ({users.length} destinatarios).</p>
                {nlSent && (
                  <div style={{ background: grnL, color: grn, padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: 13 }}>
                    ✓ Newsletter enviada com sucesso!
                  </div>
                )}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Assunto</label>
                  <Input value={nlSubject} onChange={(e: any) => setNlSubject(e.target.value)} placeholder="Nova funcionalidade no Freelamz!" />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Mensagem</label>
                  <textarea value={nlMessage} onChange={e => setNlMessage(e.target.value)} placeholder="Escreve a mensagem aqui..."
                    style={{ width: "100%", padding: "12px 14px", border: `1px solid ${bord}`, borderRadius: 10, fontSize: 14, outline: "none", background: surf2, color: txt, fontFamily: "inherit", resize: "vertical", minHeight: 140 }} />
                </div>
                <button onClick={sendNewsletter} disabled={nlSending || !nlSubject.trim() || !nlMessage.trim()}
                  style={{ background: acc, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: (nlSending || !nlSubject.trim() || !nlMessage.trim()) ? 0.6 : 1 }}>
                  {nlSending ? "A enviar..." : `Enviar para ${users.length} utilizadores`}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
