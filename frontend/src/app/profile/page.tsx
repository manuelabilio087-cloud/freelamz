"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("perfil");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "", skills: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      setFormData({ name: u.name || "", bio: u.bio || "", skills: Array.isArray(u.skills) ? u.skills.join(", ") : u.skills || "" });
    }
    setLoading(false);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: formData.name, bio: formData.bio, skills: formData.skills.split(",").map((s: string) => s.trim()) }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { id: "rede", label: "Rede de freelancers", icon: "🌐" },
    { id: "pedidos", label: "Pedidos", icon: "📋" },
    { id: "projetos", label: "Projetos", icon: "📁" },
    { id: "publicar", label: "Publique um resumo do projeto", icon: "📝" },
    { id: "encontrar", label: "Vamos encontrar o seu freelancer", icon: "🔍" },
    { id: "gerenciar", label: "Deixe-nos gerenciar seu projeto", icon: "⚙️" },
    { id: "plano", label: "Plano de conta", icon: "💳" },
    { id: "admin", label: "Administracao", icon: "🔧" },
    { id: "config", label: "Minhas configuracoes", icon: "⚙️" },
    { id: "aprovacao", label: "Solicitacoes de aprovacao", icon: "✅" },
  ];

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Carregando...</div>;

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", background: "#fff" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700" }}>Nao estas autenticado</h1>
        <Link href="/login" style={{ background: "#1dbf73", color: "#fff", padding: "12px 32px", borderRadius: "8px", fontWeight: "600", textDecoration: "none" }}>Entrar</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .btn-green { background: #1dbf73; color: #fff; padding: 10px 24px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; }
        .btn-outline { background: #fff; color: #404145; padding: 10px 24px; border-radius: 6px; font-weight: 600; border: 1px solid #e4e5e7; cursor: pointer; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 24px; }
        .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #404145; font-size: 14px; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
        .menu-item:hover { background: #f5f5f5; }
        .menu-item.active { background: #1dbf73; color: #fff; }
        .section-title { font-size: 20px; font-weight: 700; color: #404145; margin-bottom: 16px; }
        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr !important; }
          .sidebar { display: none; }
        }
      `}</style>

      <Navbar />

      <div className="profile-layout" style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>
        {/* Sidebar Menu */}
        <div className="sidebar">
          <div className="card" style={{ padding: "16px", position: "sticky", top: "88px" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f1f1", marginBottom: "8px" }}>
              <p style={{ fontWeight: "700", color: "#404145", fontSize: "15px", marginBottom: "2px" }}>{user.name}</p>
              <p style={{ color: "#74767e", fontSize: "12px" }}>{user.email}</p>
              <span style={{ display: "inline-block", marginTop: "6px", background: "#1dbf73", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>
                {user.role === "freelancer" ? "Freelancer" : "Cliente"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {menuItems.map((item) => (
                <div key={item.id} className={`menu-item ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #f1f1f1", marginTop: "8px", paddingTop: "8px" }}>
              <div className="menu-item">
                <span>🌐</span>
                <span>Portugues</span>
              </div>
              <div className="menu-item">
                <span>💰</span>
                <span>MZN Metical</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteudo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Cover + Header */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ height: "180px", background: "linear-gradient(135deg, #1dbf73, #0a8c55)" }}></div>
            <div style={{ padding: "0 24px 24px", display: "flex", gap: "20px", alignItems: "flex-end", marginTop: "-50px" }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#1dbf73", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "40px", fontWeight: "700", border: "4px solid #fff", flexShrink: 0 }}>
                {user.name ? user.name[0].toUpperCase() : "?"}
              </div>
              <div style={{ flex: 1, paddingBottom: "8px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#404145" }}>{user.name}</h1>
                <p style={{ color: "#74767e", fontSize: "14px" }}>@{user.name?.toLowerCase().replace(/\s/g, "") || "freelancer"}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                  <span style={{ color: "#f5a623" }}>⭐⭐⭐⭐⭐</span>
                  <span style={{ color: "#74767e", fontSize: "13px" }}>5.0 (12 avaliacoes)</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", paddingBottom: "8px" }}>
                {!editMode && <button className="btn-green" onClick={() => setEditMode(true)}>Editar perfil</button>}
                <button className="btn-outline">Contactar</button>
              </div>
            </div>
          </div>

          {/* Sobre / Bio */}
          <div className="card">
            <h2 className="section-title">Sobre mim</h2>
            {editMode ? (
              <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>Nome</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e4e5e7", borderRadius: "6px", fontSize: "14px" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>Bio</label>
                  <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={4} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e4e5e7", borderRadius: "6px", fontSize: "14px" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>Skills (separadas por virgula)</label>
                  <input type="text" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e4e5e7", borderRadius: "6px", fontSize: "14px" }} />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="submit" className="btn-green">Guardar</button>
                  <button type="button" className="btn-outline" onClick={() => setEditMode(false)}>Cancelar</button>
                </div>
              </form>
            ) : (
              <>
                <p style={{ color: "#74767e", lineHeight: "1.6", marginBottom: "16px" }}>{user.bio || "Este utilizador ainda nao adicionou uma bio."}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {(Array.isArray(user.skills) ? user.skills : user.skills?.split(",") || []).map((skill: string, i: number) => (
                    <span key={i} style={{ background: "#f1f1f1", color: "#404145", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "500" }}>{skill.trim()}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Servicos */}
          <div className="card">
            <h2 className="section-title">Servicos</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
              {[
                { title: "Website Profissional", price: "2.500 MT", desc: "Sites modernos e responsivos" },
                { title: "Logo Design", price: "1.500 MT", desc: "Identidade visual completa" },
                { title: "Social Media", price: "3.000 MT", desc: "Gestao de redes sociais" },
              ].map((s, i) => (
                <div key={i} style={{ border: "1px solid #e4e5e7", borderRadius: "10px", overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ height: "100px", background: "linear-gradient(135deg, #1dbf73, #0a8c55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>💻</div>
                  <div style={{ padding: "12px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{s.title}</p>
                    <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "8px" }}>{s.desc}</p>
                    <p style={{ fontWeight: "700" }}>{s.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estatisticas */}
          <div className="card">
            <h2 className="section-title">Estatisticas</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {[
                { label: "Projectos", value: "24" },
                { label: "Clientes", value: "18" },
                { label: "Resposta", value: "98%" },
                { label: "Desde", value: "Jun 2026" },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center", padding: "16px", background: "#f9f9f9", borderRadius: "10px" }}>
                  <p style={{ fontSize: "22px", fontWeight: "700", color: "#1dbf73" }}>{stat.value}</p>
                  <p style={{ fontSize: "12px", color: "#74767e" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
