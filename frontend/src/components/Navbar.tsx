"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: "#fff", borderBottom: "1px solid #e4e5e7" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "72px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/" style={{ fontSize: "28px", fontWeight: "700", color: "#000", textDecoration: "none" }}>
            Freelamz<span style={{ color: "#1dbf73" }}>.</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", width: "320px", height: "42px", border: "1px solid #c5c6c9", borderRadius: "6px", overflow: "hidden" }}>
            <input type="text" placeholder="Que servico procura?" style={{ flex: 1, height: "100%", border: "none", outline: "none", padding: "0 14px", fontSize: "14px" }} />
            <button style={{ width: "48px", height: "100%", background: "#222325", border: "none", cursor: "pointer", color: "#fff", fontSize: "16px" }}>🔍</button>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link href="/projects" style={{ color: "#404145", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Projetos</Link>
          <Link href="/projects/new" style={{ color: "#404145", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Publicar</Link>
          
          {user ? (
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer" }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1dbf73", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "14px" }}>
                  {user.name ? user.name[0].toUpperCase() : "?"}
                </div>
                <span style={{ color: "#404145", fontSize: "14px", fontWeight: "500" }}>{user.name}</span>
                <span style={{ fontSize: "10px" }}>▼</span>
              </button>

              {dropdownOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 999 }} onClick={() => setDropdownOpen(false)}></div>
                  <div style={{ position: "absolute", top: "48px", right: 0, width: "280px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: "1px solid #e4e5e7", zIndex: 1001, padding: "8px 0" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f1f1" }}>
                      <p style={{ fontWeight: "700", color: "#404145", fontSize: "15px", marginBottom: "2px" }}>{user.name}</p>
                      <p style={{ color: "#74767e", fontSize: "13px" }}>{user.email}</p>
                      <span style={{ display: "inline-block", marginTop: "6px", background: "#1dbf73", color: "#fff", fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>
                        {user.role === "freelancer" ? "Freelancer" : "Cliente"}
                      </span>
                    </div>

                    <div style={{ padding: "8px 0" }}>
                      <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", color: "#404145", fontSize: "14px", textDecoration: "none" }} onClick={() => setDropdownOpen(false)}>
                        <span>👤</span> Perfil
                      </Link>
                      <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", color: "#404145", fontSize: "14px", textDecoration: "none" }} onClick={() => setDropdownOpen(false)}>
                        <span>📊</span> Dashboard
                      </Link>
                      <Link href="/projects" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", color: "#404145", fontSize: "14px", textDecoration: "none" }} onClick={() => setDropdownOpen(false)}>
                        <span>📁</span> Meus projetos
                      </Link>
                      <Link href="/messages" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", color: "#404145", fontSize: "14px", textDecoration: "none" }} onClick={() => setDropdownOpen(false)}>
                        <span>💬</span> Mensagens
                      </Link>
                    </div>

                    <div style={{ borderTop: "1px solid #f1f1f1", padding: "8px 0" }}>
                      <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", color: "#404145", fontSize: "14px", textDecoration: "none" }} onClick={() => setDropdownOpen(false)}>
                        <span>⚙️</span> Configuracoes
                      </Link>
                      <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", color: "#404145", fontSize: "14px", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>
                        <span>🚪</span> Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" style={{ color: "#404145", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Entrar</Link>
              <Link href="/register" style={{ padding: "10px 20px", border: "1px solid #222325", background: "#fff", color: "#222325", fontSize: "14px", fontWeight: "600", textDecoration: "none", borderRadius: "6px" }}>Juntar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
