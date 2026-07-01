"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [myPlan, setMyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [dark, setDark] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    setDark(localStorage.getItem("fl_dark") === "true");
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [pR, sR, plR] = await Promise.all([
        fetch(`${API_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/subscriptions/my-plan`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const pD = await pR.json();
      const sD = await sR.json();
      const plD = await plR.json();
      setProjects(Array.isArray(pD) ? pD : []);
      setStats(sD);
      setMyPlan(plD);
    } catch {}
    setLoading(false);
  };

  const toggleDark = () => {
    const n = !dark;
    setDark(n);
    localStorage.setItem("fl_dark", String(n));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const isPro = myPlan?.plan === "pro";
  const pUsed = myPlan?.proposals_used || 0;
  const pLimit = myPlan?.proposals_limit || 3;
  const compRate = stats?.proposals > 0 ? Math.round((stats.completed / stats.proposals) * 100) : 0;

  const bg = dark ? "#0d0f14" : "#f4f5f7";
  const surf = dark ? "#161920" : "#ffffff";
  const surf2 = dark ? "#1e2028" : "#f8f9fc";
  const bord = dark ? "#2a2d3a" : "#e8eaed";
  const txt = dark ? "#e8eaf0" : "#111827";
  const sub = dark ? "#7c7f9e" : "#6b7280";
  const accT = dark ? "#a5b4fc" : "#4f46e5";
  const accB = dark ? "#1a1b3a" : "#eef2ff";

  const navItems = [
    { id: "overview", label: "Visao Geral" },
    { id: "projects", label: "Projectos" },
    { id: "profile", label: "Perfil" },
  ];

  const sidebarItem = (label: string, onClick: () => void, active = false) => (
    <div
      key={label}
      onClick={() => { onClick(); setMobileNavOpen(false); }}
      style={{
        padding: "9px 12px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13.5,
        fontWeight: 500,
        marginBottom: 2,
        background: active ? accB : "transparent",
        color: active ? accT : sub,
      }}
    >
      {label}
    </div>
  );

  const ProjectRow = ({ p }: { p: any }) => (
    <div
      onClick={() => router.push(`/projects/${p.id}`)}
      style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, marginBottom: 8, cursor: "pointer" }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: txt, marginBottom: 3 }}>{p.title}</div>
        <div style={{ fontSize: 12, color: sub }}>{p.category || "Geral"} · {p.client_name || "Cliente"}</div>
      </div>
      <span style={{ background: dark ? "#0a2018" : "#ecfdf5", color: dark ? "#6ee7b7" : "#065f46", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Aberto</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: txt }}>{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .dash-sidebar { width: 220px; position: fixed; top: 0; left: 0; height: 100vh; z-index: 60; transition: transform 0.25s ease; }
        .dash-main { margin-left: 220px; }
        .dash-overlay { display: none; }
        .dash-burger { display: none; }
        .dash-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
        @media (max-width: 880px) {
          .dash-sidebar { transform: translateX(-100%); }
          .dash-sidebar.open { transform: translateX(0); }
          .dash-main { margin-left: 0; }
          .dash-burger { display: flex; }
          .dash-overlay.open { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 55; }
        }
        @media (max-width: 560px) {
          .dash-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {mobileNavOpen && <div className="dash-overlay open" onClick={() => setMobileNavOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`dash-sidebar ${mobileNavOpen ? "open" : ""}`} style={{ background: surf, borderRight: `1px solid ${bord}`, display: "flex", flexDirection: "column" }}>
        <div onClick={() => router.push("/")} style={{ padding: "18px 16px", borderBottom: `1px solid ${bord}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 30, height: 30, background: "#6366f1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: txt }}>Freel<span style={{ color: "#6366f1" }}>amz</span></span>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: sub, textTransform: "uppercase", letterSpacing: "0.8px", padding: "6px 8px 4px" }}>Principal</div>
          {navItems.map(it => sidebarItem(it.label, () => setTab(it.id), tab === it.id))}

          <div style={{ fontSize: 10, fontWeight: 600, color: sub, textTransform: "uppercase", letterSpacing: "0.8px", padding: "14px 8px 4px" }}>Financas</div>
          {[
            { label: "Mensagens", route: "/messages" },
            { label: "Contratos", route: "/contracts" },
            { label: "Pagamentos", route: "/payments" },
            { label: "Disputas", route: "/disputes" },
          ].map(it => sidebarItem(it.label, () => router.push(it.route)))}

          <div style={{ fontSize: 10, fontWeight: 600, color: sub, textTransform: "uppercase", letterSpacing: "0.8px", padding: "14px 8px 4px" }}>Conta</div>
          {sidebarItem(isPro ? "✦ Plano Pro" : "Upgrade Pro", () => router.push("/pricing"))}
        </nav>

        <div style={{ padding: "10px 8px", borderTop: `1px solid ${bord}` }}>
          {sidebarItem(dark ? "☀ Tema claro" : "☾ Tema escuro", toggleDark)}
          {sidebarItem("Sair", logout)}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginTop: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {user?.name?.[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: txt }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: sub }}>{isPro ? "Freelancer Pro" : "Freelancer"}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dash-main" style={{ flex: 1, minHeight: "100vh", background: bg }}>
        <div style={{ background: surf, borderBottom: `1px solid ${bord}`, padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="dash-burger" onClick={() => setMobileNavOpen(true)} style={{ background: "none", border: `1px solid ${bord}`, borderRadius: 8, width: 34, height: 34, alignItems: "center", justifyContent: "center", cursor: "pointer", color: txt, flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span style={{ fontSize: 15, fontWeight: 600, color: txt }}>
              {tab === "overview" ? `Ola, ${user?.name?.split(" ")[0] || "Freelancer"} 👋` : tab === "projects" ? "Projectos" : "Perfil"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {isPro && <span style={{ background: dark ? "#1e1030" : "#f5f3ff", color: dark ? "#c4b5fd" : "#5b21b6", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✦ Pro</span>}
            <button onClick={() => router.push("/messages")} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${bord}`, background: surf2, fontSize: 13, cursor: "pointer", color: txt, fontWeight: 500 }}>
              Mensagens
            </button>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {tab === "overview" && (
            <>
              {!isPro && (
                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: txt, marginBottom: 4 }}>Plano Gratuito — {pUsed}/{pLimit} propostas usadas</div>
                    <div style={{ height: 4, background: bord, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min((pUsed / pLimit) * 100, 100)}%`, background: "#8b5cf6", borderRadius: 2 }} />
                    </div>
                  </div>
                  <button onClick={() => router.push("/pricing")} style={{ background: "#8b5cf6", color: "#fff", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    Upgrade Pro
                  </button>
                </div>
              )}

              <div className="dash-stats-grid">
                {[
                  { label: "Propostas enviadas", value: stats?.proposals || 0, sub: `${stats?.accepted || 0} aceites` },
                  { label: "Concluidos", value: stats?.completed || 0, sub: `${compRate}% sucesso` },
                  { label: "Ganhos (MT)", value: stats?.earnings ? Number(stats.earnings).toLocaleString() : "0", sub: "acumulados" },
                  { label: "Avaliacao", value: stats?.rating || "—", sub: "media" },
                ].map((s, i) => (
                  <div key={i} style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 18 }}>
                    <div style={{ fontSize: 12, color: sub, marginBottom: 8, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: txt, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: sub }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: txt }}>Projectos disponiveis</span>
                <button onClick={() => router.push("/projects")} style={{ background: "none", border: "none", color: accT, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Ver todos →</button>
              </div>

              {loading ? (
                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 32, textAlign: "center", color: sub }}>A carregar...</div>
              ) : projects.slice(0, 5).map((p, i) => <ProjectRow key={i} p={p} />)}
            </>
          )}

          {tab === "projects" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: txt }}>Todos os projectos</span>
                <button onClick={() => router.push("/projects")} style={{ background: "#6366f1", color: "#fff", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  Ver pagina completa →
                </button>
              </div>
              {loading ? (
                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 32, textAlign: "center", color: sub }}>A carregar...</div>
              ) : projects.map((p, i) => <ProjectRow key={i} p={p} />)}
            </>
          )}

          {tab === "profile" && (
            <div style={{ maxWidth: 420, margin: "0 auto", background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 32, textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 700, margin: "0 auto 14px" }}>
                {user?.name?.[0]}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: txt, marginBottom: 4 }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: sub, marginBottom: 20 }}>{user?.email}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, background: surf2, borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div><div style={{ fontSize: 22, fontWeight: 700, color: accT }}>{stats?.completed || 0}</div><div style={{ fontSize: 11, color: sub, marginTop: 2 }}>Concluidos</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 700, color: accT }}>{stats?.rating || "—"}</div><div style={{ fontSize: 11, color: sub, marginTop: 2 }}>Avaliacao</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 700, color: accT }}>{stats?.earnings ? `${Math.round(Number(stats.earnings) / 1000)}k` : "0"}</div><div style={{ fontSize: 11, color: sub, marginTop: 2 }}>MT ganhos</div></div>
              </div>
              <button onClick={() => router.push("/profile")} style={{ background: "#6366f1", color: "#fff", padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                Editar perfil
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}