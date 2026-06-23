"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      router.push("/welcome");
    } catch (err) {
      setError("Erro de conexao com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        .input-field { width: 100%; padding: 14px 16px; border: 1px solid #c5c6c9; border-radius: 8px; font-size: 15px; outline: none; transition: border 0.2s; background: #fff; color: #404145; }
        .input-field:focus { border-color: #1dbf73; }
        .btn-green { width: 100%; background: #1dbf73; color: #fff; padding: 14px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-size: 16px; }
        .btn-green:hover { background: #19a463; }
        .btn-green:disabled { opacity: 0.6; cursor: not-allowed; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        @media (max-width: 768px) { .layout { flex-direction: column !important; } .side { display: none !important; } }
      `}</style>

      <div className="card" style={{ maxWidth: "900px", width: "100%" }}>
        <div className="layout" style={{ display: "flex", minHeight: "560px" }}>
          <div className="side" style={{ flex: 1, background: "linear-gradient(135deg, #1dbf73, #0a8c55)", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "16px" }}>Bem-vindo de volta!</h2>
            <p style={{ fontSize: "18px", opacity: 0.9, lineHeight: "1.6" }}>Entre na sua conta para continuar a encontrar os melhores freelancers de Mocambique.</p>
          </div>

          <div style={{ flex: 1, padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#404145", marginBottom: "8px" }}>Entrar</h1>
            <p style={{ color: "#74767e", fontSize: "14px", marginBottom: "32px" }}>
              Nao tem conta? <Link href="/register" style={{ color: "#1dbf73", fontWeight: "600", textDecoration: "none" }}>Registar</Link>
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#404145", marginBottom: "8px" }}>Email</label>
                <input type="email" className="input-field" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#404145", marginBottom: "8px" }}>Senha</label>
                <input type="password" className="input-field" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link href="/forgot-password" style={{ color: "#1dbf73", fontSize: "13px", fontWeight: "500", textDecoration: "none" }}>Esqueci a senha?</Link>
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-green" disabled={loading}>
                {loading ? "A entrar..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
