"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.filter((o: any) => o.freelancer_id === user?.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    earnings: orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0),
    active: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    pending: orders.filter((o) => o.status === "pending").length,
  };

  const menuItems = [
    { id: "overview", label: "Visao Geral", icon: "📊" },
    { id: "orders", label: "Pedidos", icon: "📦" },
    { id: "messages", label: "Mensagens", icon: "💬" },
    { id: "earnings", label: "Ganhos", icon: "💰" },
    { id: "profile", label: "Perfil", icon: "👤" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .sidebar-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #6b7280; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .sidebar-link:hover, .sidebar-link.active { background: #ecfdf5; color: #059669; }
        .card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .stat-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border-left: 4px solid #059669; }
        .btn-green { background: #059669; color: #fff; padding: 10px 20px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; }
        .btn-green:hover { background: #047857; }
        .btn-outline { background: #fff; color: #059669; padding: 8px 16px; border-radius: 6px; font-weight: 600; border: 1px solid #059669; cursor: pointer; font-size: 13px; }
        .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-progress { background: #dbeafe; color: #1e40af; }
        .status-completed { background: #d1fae5; color: #065f46; }
      `}</style>

      {/* Top Navbar */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link href="/" style={{ fontSize: "26px", fontWeight: "800", color: "#059669", textDecoration: "none" }}>freelamz</Link>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/search/gigs" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Explorar</Link>
            <Link href="/orders" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Pedidos</Link>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>💰 {stats.earnings} MT</span>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>🔔</span>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>✉️</span>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "13px" }}>
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
        </div>
      </nav>

      <div style={{ display: "flex", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Sidebar */}
        <aside style={{ width: "260px", minHeight: "calc(100vh - 60px)", background: "#fff", borderRight: "1px solid #e5e7eb", padding: "24px 16px" }}>
          {/* Profile Card */}
          <div style={{ textAlign: "center", padding: "0 0 24px", borderBottom: "1px solid #e5e7eb", marginBottom: "16px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #059669, #047857)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "28px", margin: "0 auto 12px" }}>
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>{user?.name || "Freelancer"}</h3>
            <p style={{ fontSize: "13px", color: "#059669", fontWeight: "600" }}>⭐ Nivel 1 Seller</p>
            <div style={{ marginTop: "12px" }}>
              <span style={{ fontSize: "12px", color: "#6b7280", background: "#f3f4f6", padding: "4px 12px", borderRadius: "12px" }}>🟢 Disponivel</span>
            </div>
          </div>

          {/* Menu */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
            <Link href="/" className="sidebar-link">
              <span style={{ fontSize: "18px" }}>🏠</span>
              <span>Ir para Home</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "32px", maxWidth: "calc(100% - 260px)" }}>
          {activeTab === "overview" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827" }}>Visao Geral</h1>
                <Link href="/search/gigs" className="btn-green" style={{ textDecoration: "none" }}>+ Novo Servico</Link>
              </div>

              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                <div className="stat-card">
                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>Ganhos totais</p>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "#059669" }}>{stats.earnings} MT</p>
                  <p style={{ fontSize: "12px", color: "#059669", marginTop: "4px" }}>↑ 12% este mes</p>
                </div>
                <div className="stat-card" style={{ borderLeftColor: "#f59e0b" }}>
                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>Pedidos activos</p>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "#f59e0b" }}>{stats.active}</p>
                  <p style={{ fontSize: "12px", color: "#f59e0b", marginTop: "4px" }}>Em andamento</p>
                </div>
                <div className="stat-card" style={{ borderLeftColor: "#059669" }}>
                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>Concluidos</p>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "#059669" }}>{stats.completed}</p>
                  <p style={{ fontSize: "12px", color: "#059669", marginTop: "4px" }}>Entregues</p>
                </div>
                <div className="stat-card" style={{ borderLeftColor: "#6b7280" }}>
                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>Pendentes</p>
                  <p style={{ fontSize: "28px", fontWeight: "700", color: "#6b7280" }}>{stats.pending}</p>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>Aguardando</p>
                </div>
              </div>

              {/* Two Columns */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
                {/* Orders */}
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>Pedidos Recentes</h2>
                    <Link href="/orders" style={{ color: "#059669", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>Ver todos</Link>
                  </div>

                  {loading ? (
                    <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>Carregando...</p>
                  ) : orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px" }}>
                      <div style={{ fontSize: "48px", marginBottom: "12px" }}>📦</div>
                      <p style={{ color: "#6b7280", marginBottom: "16px" }}>Ainda nao tem pedidos.</p>
                      <Link href="/search/gigs" className="btn-outline" style={{ textDecoration: "none", display: "inline-block" }}>Ver servicos</Link>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {orders.slice(0, 5).map((order: any) => (
                        <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#f9fafb", borderRadius: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "linear-gradient(135deg, #059669, #047857)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px" }}>
                              💼
                            </div>
                            <div>
                              <p style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>{order.gig_title}</p>
                              <p style={{ fontSize: "12px", color: "#6b7280" }}>Cliente: {order.client_name}</p>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontWeight: "700", color: "#111827", fontSize: "14px" }}>{order.total_amount} MT</p>
                            <span className={`status-badge ${order.status === "completed" ? "status-completed" : order.status === "in_progress" ? "status-progress" : "status-pending"}`}>
                              {order.status === "completed" ? "Concluido" : order.status === "in_progress" ? "Em progresso" : "Pendente"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Quick Actions */}
                  <div className="card">
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>Acoes Rapidas</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <Link href="/search/gigs" className="btn-green" style={{ textDecoration: "none", textAlign: "center" }}>Criar Novo Gig</Link>
                      <Link href="/orders" className="btn-outline" style={{ textDecoration: "none", textAlign: "center" }}>Ver Pedidos</Link>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="card">
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>Desempenho</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", color: "#6b7280" }}>Taxa de resposta</span>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "#059669" }}>100%</span>
                        </div>
                        <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px" }}>
                          <div style={{ height: "100%", width: "100%", background: "#059669", borderRadius: "3px" }}></div>
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", color: "#6b7280" }}>Entrega no prazo</span>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "#059669" }}>98%</span>
                        </div>
                        <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px" }}>
                          <div style={{ height: "100%", width: "98%", background: "#059669", borderRadius: "3px" }}></div>
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", color: "#6b7280" }}>Avaliacao</span>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "#f59e0b" }}>4.9 ⭐</span>
                        </div>
                        <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px" }}>
                          <div style={{ height: "100%", width: "98%", background: "#f59e0b", borderRadius: "3px" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <div className="card">
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>Todos os Pedidos</h2>
              {orders.length === 0 ? (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>Nenhum pedido encontrado.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orders.map((order: any) => (
                    <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
                      <div>
                        <p style={{ fontWeight: "600", color: "#111827" }}>{order.gig_title}</p>
                        <p style={{ fontSize: "13px", color: "#6b7280" }}>Cliente: {order.client_name} | Entrega: {new Date(order.delivery_date).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontWeight: "700", color: "#111827" }}>{order.total_amount} MT</p>
                        <span className={`status-badge ${order.status === "completed" ? "status-completed" : order.status === "in_progress" ? "status-progress" : "status-pending"}`}>
                          {order.status === "completed" ? "Concluido" : order.status === "in_progress" ? "Em progresso" : "Pendente"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>Mensagens</h2>
              <p style={{ color: "#6b7280" }}>Nenhuma mensagem nova.</p>
            </div>
          )}

          {activeTab === "earnings" && (
            <div className="card">
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "20px" }}>Ganhos</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div style={{ padding: "20px", background: "#ecfdf5", borderRadius: "8px" }}>
                  <p style={{ fontSize: "13px", color: "#6b7280" }}>Ganhos do mes</p>
                  <p style={{ fontSize: "24px", fontWeight: "700", color: "#059669" }}>{stats.earnings} MT</p>
                </div>
                <div style={{ padding: "20px", background: "#fef3c7", borderRadius: "8px" }}>
                  <p style={{ fontSize: "13px", color: "#6b7280" }}>A receber</p>
                  <p style={{ fontSize: "24px", fontWeight: "700", color: "#92400e" }}>0 MT</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "linear-gradient(135deg, #059669, #047857)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "36px", margin: "0 auto 16px" }}>
                {user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>{user?.name || "Freelancer"}</h2>
              <p style={{ color: "#6b7280", marginBottom: "24px" }}>{user?.email}</p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                <span style={{ background: "#ecfdf5", color: "#059669", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>Freelancer</span>
                <span style={{ background: "#fef3c7", color: "#92400e", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>⭐ Nivel 1</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
