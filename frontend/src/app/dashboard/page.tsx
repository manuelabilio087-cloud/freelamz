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

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const isPro = myPlan?.plan === "pro";
  const pUsed = myPlan?.proposals_used || 0;
  const pLimit = myPlan?.proposals_limit || 3;
  const compRate = stats?.proposals > 0 ? Math.round((stats.completed / stats.proposals) * 100) : 0;

  const navItems = [
    { id: "overview", label: "Visao Geral" },
    { id: "projects", label: "Projectos" },
    { id: "profile", label: "Perfil" },
  ];

  const externalRoutes: any = {
    messages: "/messages",
    contracts: "/contracts",
    payments: "/payments",
    pricing: "/pricing",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7", fontFamily: "Inter, sans-serif" }}>
      {/* SIDEBAR */}
      <aside style={{
        width: 220,
        background: "#ffffff",
        borderRight: "1px solid #e8eaed",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 50,
      }}>
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          style={{ padding: "18px 16px", borderBottom: "1px solid #e8eaed", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <div style={{ width: 30, height: 30, background: "#6366f1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Freel<span style={{ color: "#6366f1" }}>amz</span></span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", padding: "6px 8px 4px" }}>Principal</div>
          {navItems.map(it => (
            <div
              key={it.id}
              onClick={() => setTab(it.id)}
              style={{
                padding: "9px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13.5,
                fontWeight: 500,
                marginBottom: 2,
                background: tab === it.id ? "#eef2ff" : "transparent",
                color: tab === it.id ? "#4f46e5" : "#6b7280",
              }}
            >
              {it.label}
            </div>
          ))}

          <div style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", padding: "14px 8px 4px" }}>Financas</div>
          {[
            { label: "Mensagens", route: "/messages" },
            { label: "Contratos", route: "/contracts" },
            { label: "Pagamentos", route: "/payments" },
            { label: "Disputas", route: "/disputes" },
          ].map(it => (
            <div
              key={it.label}
              onClick={() => router.push(it.route)}
              style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 500, color: "#6b7280", marginBottom: 2 }}
            >
              {it.label}
            </div>
          ))}

          <div style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", padding: "14px 8px 4px" }}>Conta</div>
          <div onClick={() => router.push("/pricing")} style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 500, color: "#6b7280", marginBottom: 2 }}>
            {isPro ? "✦ Plano Pro" : "Upgrade Pro"}
          </div>
        </nav>

        {/* User + Logout */}
        <div style={{ padding: "10px 8px", borderTop: "1px solid #e8eaed" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {user?.name?.[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{isPro ? "Freelancer Pro" : "Freelancer"}</div>
            </div>
          </div>
          <div onClick={logout} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#ef4444", fontWeight: 500 }}>
            Sair
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh" }}>
        {/* Topbar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e8eaed", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
            {tab === "overview" ? `Ola, ${user?.name?.split(" ")[0] || "Freelancer"} 👋` : tab === "projects" ? "Projectos" : "Perfil"}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {isPro && (
              <span style={{ background: "#f5f3ff", color: "#5b21b6", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✦ Pro</span>
            )}
            <button onClick={() => router.push("/messages")} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e8eaed", background: "#fff", fontSize: 13, cursor: "pointer", color: "#374151", fontWeight: 500 }}>
              Mensagens
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>

          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <>
              {/* Plan banner */}
              {!isPro && (
                <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                      Plano Gratuito — {pUsed}/{pLimit} propostas usadas
                    </div>
                    <div style={{ height: 4, background: "#e8eaed", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min((pUsed / pLimit) * 100, 100)}%`, background: "#8b5cf6", borderRadius: 2 }} />
                    </div>
                  </div>
                  <button onClick={() => router.push("/pricing")} style={{ background: "#8b5cf6", color: "#fff", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    Upgrade Pro
                  </button>
                </div>
              )}

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Propostas enviadas", value: stats?.proposals || 0, sub: `${stats?.accepted || 0} aceites`, color: "#6366f1", bg: "#eef2ff" },
                  { label: "Concluidos", value: stats?.completed || 0, sub: `${compRate}% sucesso`, color: "#10b981", bg: "#ecfdf5" },
                  { label: "Ganhos (MT)", value: stats?.earnings ? Number(stats.earnings).toLocaleString() : "0", sub: "acumulados", color: "#f59e0b", bg: "#fffbeb" },
                  { label: "Avaliacao", value: stats?.rating || "—", sub: "media", color: "#f59e0b", bg: "#fffbeb" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, padding: 18 }}>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Projects list */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Projectos disponiveis</span>
                <button onClick={() => router.push("/projects")} style={{ background: "none", border: "none", color: "#4f46e5", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                  Ver todos →
                </button>
              </div>

              {loading ? (
                <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, padding: 32, textAlign: "center", color: "#9ca3af" }}>A carregar...</div>
              ) : projects.slice(0, 5).map((p, i) => (
                <div
                  key={i}
                  onClick={() => router.push(`/projects/${p.id}`)}
                  style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, marginBottom: 8, cursor: "pointer" }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 3 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.category || "Geral"} · {p.client_name || "Cliente"}</div>
                  </div>
                  <span style={{ background: "#ecfdf5", color: "#065f46", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Aberto</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</span>
                </div>
              ))}
            </>
          )}

          {/* PROJECTS TAB */}
          {tab === "projects" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Todos os projectos</span>
                <button onClick={() => router.push("/projects")} style={{ background: "#6366f1", color: "#fff", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  Ver pagina completa →
                </button>
              </div>
              {loading ? (
                <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, padding: 32, textAlign: "center", color: "#9ca3af" }}>A carregar...</div>
              ) : projects.map((p, i) => (
                <div
                  key={i}
                  onClick={() => router.push(`/projects/${p.id}`)}
                  style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, marginBottom: 8, cursor: "pointer" }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 3 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.category || "Geral"} · {p.client_name || "Cliente"}</div>
                  </div>
                  <span style={{ background: "#ecfdf5", color: "#065f46", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Aberto</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</span>
                </div>
              ))}
            </>
          )}

          {/* PROFILE TAB */}
          {tab === "profile" && (
            <div style={{ maxWidth: 420, margin: "0 auto", background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, padding: 32, textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 700, margin: "0 auto 14px" }}>
                {user?.name?.[0]}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>{user?.email}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, background: "#f8f9fc", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div><div style={{ fontSize: 22, fontWeight: 700, color: "#4f46e5" }}>{stats?.completed || 0}</div><div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Concluidos</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 700, color: "#4f46e5" }}>{stats?.rating || "—"}</div><div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Avaliacao</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 700, color: "#4f46e5" }}>{stats?.earnings ? `${Math.round(Number(stats.earnings) / 1000)}k` : "0"}</div><div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>MT ganhos</div></div>
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