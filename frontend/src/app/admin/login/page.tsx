"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("manuelabilio087@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao fazer login.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/admin");
    } catch {
      setError("Erro de conexao. Tenta novamente.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)",
      fontFamily: "Inter, sans-serif",
      padding: "24px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "#1a1d27",
        border: "1px solid #2e3245",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 24px 48px rgba(0,0,0,0.4)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: "14px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px"
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 style={{ color: "#e8eaf0", fontSize: "22px", fontWeight: "700", marginBottom: "4px" }}>
            Freelamz Admin
          </h1>
          <p style={{ color: "#8b90a7", fontSize: "14px" }}>
            Acesso restrito ao administrador
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#e8eaf0",
              marginBottom: "6px"
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #2e3245",
                borderRadius: "10px",
                background: "#242736",
                color: "#8b90a7",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
                cursor: "not-allowed"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#e8eaf0",
              marginBottom: "6px"
            }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digita a senha de admin"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #2e3245",
                borderRadius: "10px",
                background: "#242736",
                color: "#e8eaf0",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e => e.target.style.borderColor = "#2e3245"}
            />
          </div>

          {error && (
            <div style={{
              background: "#2d1515",
              color: "#ef4444",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#4b4f6b" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {loading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                A verificar...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Entrar no Painel
              </>
            )}
          </button>
        </form>

        {/* Voltar */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <a href="/" style={{ color: "#8b90a7", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
             onMouseEnter={e => e.currentTarget.style.color = "#6366f1"}
             onMouseLeave={e => e.currentTarget.style.color = "#8b90a7"}>
            ← Voltar ao site
          </a>
        </div>

        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}