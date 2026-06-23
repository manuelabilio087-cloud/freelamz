"use client";
import { useState } from "react";
import Link from "next/link";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setToken("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao processar pedido");
        setLoading(false);
        return;
      }

      setMessage(data.message);
      setToken(data.token);
    } catch (err) {
      setError("Erro de conexao com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        .input-field { width: 100%; padding: 14px 16px; border: 1px solid #c5c6c9; border-radius: 8px; font-size: 15px; outline: none; background: #fff; color: #404145; }
        .input-field:focus { border-color: #1dbf73; }
        .btn-green { width: 100%; background: #1dbf73; color: #fff; padding: 14px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-size: 16px; }
        .btn-green:hover { background: #19a463; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 480px; width: 100%; }
      `}</style>

      <div className="card">
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#404145", marginBottom: "8px" }}>Recuperar senha</h1>
        <p style={{ color: "#74767e", fontSize: "14px", marginBottom: "32px" }}>
          Digite o seu email e enviaremos um link para redefinir a senha.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#404145", marginBottom: "8px" }}>Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", fontSize: "14px" }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", color: "#166534", padding: "12px 16px", borderRadius: "8px", fontSize: "14px" }}>
              {message}
            </div>
          )}

          {token && (
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", wordBreak: "break-all" }}>
              <strong>Token (guarde isto):</strong><br/>{token}
            </div>
          )}

          <button type="submit" className="btn-green" disabled={loading}>
            {loading ? "A enviar..." : "Enviar link de recuperacao"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#74767e" }}>
          <Link href="/login" style={{ color: "#1dbf73", fontWeight: "600", textDecoration: "none" }}>Voltar ao login</Link>
        </p>
      </div>
    </div>
  );
}
