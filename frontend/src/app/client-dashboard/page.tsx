"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
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

  const loadData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [oR, fR] = await Promise.all([
        fetch(`${API_URL}/orders?role=buying`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users/freelancers`),
      ]);
      const oD = await oR.json();
      const fD = await fR.json();
      setOrders(Array.isArray(oD) ? oD : []);
      setFreelancers(Array.isArray(fD) ? fD : []);
    } catch {}
    setLoading(false);
  };

  const bg    = dark ? "#0d0f14" : "#f4f5f7";
  const surf  = dark ? "#161920" : "#ffffff";
  const surf2 = dark ? "#1e2028" : "#f8f9fc";
  const bord  = dark ? "#2a2d3a" : "#e8eaed";
  const txt   = dark ? "#e8eaf0" : "#111827";
  const sub   = dark ? "#7c7f9e" : "#6b7280";
  const accT  = dark ? "#a5b4fc" : "#4f46e5";
  const accB  = dark ? "#1a1b3a" : "#eef2ff";
  const grnT  = dark ? "#6ee7b7" : "#065f46";
  const grnB  = dark ? "#0a2018" : "#ecfdf5";
  const ambT  = dark ? "#fcd34d" : "#92400e";
  const ambB  = dark ? "#271c00" : "#fffbeb";
  const rdT   = dark ? "#fca5a5" : "#991b1b";
  const rdB   = dark ? "#2a0f0f" : "#fef2f2";
  const grn   = "#10b981";

  const ongoingOrders   = orders.filter((o: any) => ["pending_payment", "pending", "in_progress", "revision_requested", "delivered"].includes(o.status));
  const completedOrders = orders.filter((o: any) => o.status === "completed");
  const totalInvested   = completedOrders.reduce((sum: number, o: any) => sum + (Number(o.total_amount) || 0), 0);

  const navGo = (id: string) => {
    const routes: any = { messages: "/messages", contracts: "/contracts", payments: "/payments", disputes: "/disputes", profile: "/profile" };
    setMobileNavOpen(false);
    if (routes[id]) { router.push(routes[id]); return; }
    setTab(id);
  };

  const SideItem = ({ id, label }: { id: string; label: string }) => (
    <div
      onClick={() => navGo(id)}
      style={{
        padding: "9px 12px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13.5,
        fontWeight: 500,
        marginBottom: 2,
        background: tab === id ? grnB : "transparent",
        color: tab === id ? grnT : sub,
      }}
    >
      {label}
    </div>
  );

  const orderStatusMap: any = {
    pending: { label: "Pendente", bg: ambB, col: ambT },
    in_progress: { label: "Em progresso", bg: accB, col: accT },
    revision_requested: { label: "Revisao pedida", bg: ambB, col: ambT },
    delivered: { label: "Entregue", bg: accB, col: accT },
    completed: { label: "Concluida", bg: grnB, col: grnT },
    cancelled: { label: "Cancelada", bg: rdB, col: rdT },
  };

  const OrderRow = ({ o }: { o: any }) => {
    const st = orderStatusMap[o.status] || { label: o.status, bg: surf2, col: sub };
    return (
      <div
        onClick={() => router.push(`/orders/${o.id}`)}
        style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, marginBottom: 8, cursor: "pointer" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: txt, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.gig_title || `Encomenda #${o.id}`}</div>
          <div style={{ fontSize: 12, color: sub }}>{o.freelancer_name || "Freelancer"}</div>
        </div>
        <span style={{ background: st.bg, color: st.col, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: txt, whiteSpace: "nowrap" }}>{o.total_amount ? `${Number(o.total_amount).toLocaleString()} MT` : "—"}</span>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .dash-sidebar { width: 220px; position: fixed; top: 0; left: 0; height: 100vh; z-index: 60; transition: transform 0.25s ease; }
        .dash-main { margin-left: 220px; }
        .dash-overlay { display: none; }
        .dash-burger { display: none; }
        .dash-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
        .dash-freelancers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 880px) {
          .dash-sidebar { transform: translateX(-100%); }
          .dash-sidebar.open { transform: translateX(0); }
          .dash-main { margin-left: 0; }
          .dash-burger { display: flex; }
          .dash-overlay.open { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 55; }
        }
        @media (max-width: 640px) {
          .dash-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-freelancers-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {mobileNavOpen && <div className="dash-overlay open" onClick={() => setMobileNavOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`dash-sidebar ${mobileNavOpen ? "open" : ""}`} style={{ background: surf, borderRight: `1px solid ${bord}`, display: "flex", flexDirection: "column" }}>
        <div onClick={() => router.push("/")} style={{ padding: "18px 16px", borderBottom: `1px solid ${bord}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 30, height: 30, background: grn, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: txt }}>Freel<span style={{ color: grn }}>amz</span></span>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: sub, textTransform: "uppercase", letterSpacing: "0.8px", padding: "6px 8px 4px" }}>Principal</div>
          <SideItem id="overview"    label="Visao Geral" />
          <SideItem id="orders"      label="As minhas Encomendas" />
          <SideItem id="freelancers" label="Freelancers" />
          <SideItem id="messages"    label="Mensagens" />

          <div style={{ fontSize: 10, fontWeight: 600, color: sub, textTransform: "uppercase", letterSpacing: "0.8px", padding: "14px 8px 4px" }}>Gestao</div>
          <SideItem id="contracts" label="Contratos" />
          <SideItem id="payments"  label="Pagamentos" />
          <SideItem id="disputes"  label="Disputas" />

          <div style={{ fontSize: 10, fontWeight: 600, color: sub, textTransform: "uppercase", letterSpacing: "0.8px", padding: "14px 8px 4px" }}>Conta</div>
          <SideItem id="profile" label="Perfil" />
        </nav>

        <div style={{ padding: "10px 8px", borderTop: `1px solid ${bord}` }}>
          <div onClick={toggleDark} style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 500, color: sub, marginBottom: 2 }}>
            {dark ? "☀ Tema claro" : "☾ Tema escuro"}
          </div>
          <div onClick={logout} style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 500, color: "#ef4444", marginBottom: 6 }}>
            Sair
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${grn},#6366f1)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {user?.name?.[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: txt }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: sub }}>Cliente</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dash-main" style={{ flex: 1, minHeight: "100vh", background: bg }}>
        {/* Topbar */}
        <div style={{ background: surf, borderBottom: `1px solid ${bord}`, padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <button className="dash-burger" onClick={() => setMobileNavOpen(true)} style={{ background: "none", border: `1px solid ${bord}`, borderRadius: 8, width: 34, height: 34, alignItems: "center", justifyContent: "center", cursor: "pointer", color: txt, flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span style={{ fontSize: 15, fontWeight: 600, color: txt, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {tab === "overview" ? `Ola, ${user?.name?.split(" ")[0] || "Cliente"} 👋` : tab === "orders" ? "As minhas Encomendas" : tab === "freelancers" ? "Freelancers" : "Dashboard"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => router.push("/messages")} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${bord}`, background: surf2, fontSize: 13, cursor: "pointer", color: txt, fontWeight: 500 }}>
              Mensagens
            </button>
            <button onClick={() => router.push("/search/gigs")} style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: grn, fontSize: 13, cursor: "pointer", color: "#fff", fontWeight: 600 }}>
              Explorar Servicos
            </button>
          </div>
        </div>

        <div style={{ padding: 24 }}>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <>
              {/* Stats */}
              <div className="dash-stats-grid">
                {[
                  { label: "Encomendas feitas",     value: orders.length, sub: `${ongoingOrders.length} em andamento`, bg: accB, col: accT },
                  { label: "Em andamento",          value: ongoingOrders.length, sub: "a decorrer", bg: ambB, col: ambT },
                  { label: "Concluidas",            value: completedOrders.length, sub: "servicos entregues", bg: grnB, col: grnT },
                  { label: "Total investido (MT)",  value: totalInvested.toLocaleString(), sub: "em servicos", bg: ambB, col: ambT },
                ].map((s, i) => (
                  <div key={i} style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 18 }}>
                    <div style={{ fontSize: 12, color: sub, marginBottom: 8, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: txt, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: sub }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Quick access */}
              <div style={{ fontSize: 14, fontWeight: 600, color: txt, marginBottom: 12 }}>Acesso rapido</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
                {[
                  { label: "Explorar Servicos", action: () => router.push("/search/gigs"), bg: accB, col: accT },
                  { label: "Freelancers", action: () => setTab("freelancers"), bg: accB, col: accT },
                  { label: "Mensagens",   action: () => router.push("/messages"), bg: grnB, col: grnT },
                  { label: "Pagamentos",  action: () => router.push("/payments"), bg: ambB, col: ambT },
                ].map((q, i) => (
                  <div key={i} onClick={q.action} style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 10, padding: 16, cursor: "pointer", textAlign: "center" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: q.bg, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 18, color: q.col }}>●</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: txt }}>{q.label}</div>
                  </div>
                ))}
              </div>

              {/* My orders */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: txt }}>As minhas encomendas</span>
                <button onClick={() => setTab("orders")} style={{ background: "none", border: "none", color: accT, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Ver todas →</button>
              </div>
              {loading ? (
                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 32, textAlign: "center", color: sub }}>A carregar...</div>
              ) : orders.length === 0 ? (
                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 40, textAlign: "center", color: sub }}>
                  <p style={{ marginBottom: 16 }}>Ainda nao fizeste nenhuma encomenda.</p>
                  <button onClick={() => router.push("/search/gigs")} style={{ background: grn, color: "#fff", padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                    Explorar servicos
                  </button>
                </div>
              ) : orders.slice(0, 4).map((o, i) => <OrderRow key={i} o={o} />)}
            </>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: txt }}>Todas as minhas encomendas ({orders.length})</span>
                <button onClick={() => router.push("/search/gigs")} style={{ background: grn, color: "#fff", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  Explorar Servicos
                </button>
              </div>
              {loading ? (
                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 32, textAlign: "center", color: sub }}>A carregar...</div>
              ) : orders.length === 0 ? (
                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 40, textAlign: "center", color: sub }}>
                  <p style={{ marginBottom: 16 }}>Ainda sem encomendas.</p>
                  <button onClick={() => router.push("/search/gigs")} style={{ background: grn, color: "#fff", padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                    Explorar agora
                  </button>
                </div>
              ) : orders.map((o, i) => <OrderRow key={i} o={o} />)}
            </>
          )}

          {/* FREELANCERS */}
          {tab === "freelancers" && (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, color: txt, marginBottom: 16 }}>Freelancers disponiveis ({freelancers.length})</div>
              {loading ? (
                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 32, textAlign: "center", color: sub }}>A carregar...</div>
              ) : freelancers.length === 0 ? (
                <div style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 40, textAlign: "center", color: sub }}>Nenhum freelancer registado ainda.</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {freelancers.map((f, i) => {
                    const skills = Array.isArray(f.skills) ? f.skills : (() => { try { return JSON.parse(f.skills || "[]"); } catch { return []; } })();
                    return (
                      <div key={i} onClick={() => router.push(`/freelancer/${f.id}`)} style={{ background: surf, border: `1px solid ${bord}`, borderRadius: 12, padding: 20, textAlign: "center", cursor: "pointer" }}>
                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${grn},#6366f1)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 auto 12px" }}>
                          {f.avatar ? <img src={f.avatar} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : f.name?.[0]}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: txt, marginBottom: 4 }}>{f.name}</div>
                        <div style={{ fontSize: 12, color: sub, marginBottom: 12, lineHeight: 1.5 }}>{f.bio || "Freelancer profissional em Mocambique"}</div>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
                          {skills.slice(0, 3).map((s: string, j: number) => (
                            <span key={j} style={{ background: surf2, color: sub, fontSize: 11, padding: "3px 8px", borderRadius: 10, border: `1px solid ${bord}` }}>{s}</span>
                          ))}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); router.push("/messages"); }}
                          style={{ width: "100%", padding: 9, background: grn, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}
                        >
                          Contactar
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
