"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao registar");
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
        select.input-field { appearance: auto; }
        .btn-green { width: 100%; background: #1dbf73; color: #fff; padding: 14px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-size: 16px; }
        .btn-green:hover { background: #19a463; }
        .btn-green:disabled { opacity: 0.6; cursor: not-allowed; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        @media (max-width: 768px) { .layout { flex-direction: column !important; } .side { display: none !important; } }
      `}</style>

      <div className="card" style={{ maxWidth: "900px", width: "100%" }}>
        <div className="layout" style={{ display: "flex", minHeight: "600px" }}>
          {/* Lado esquerdo */}
          <div className="side" style={{ flex: 1, background: "linear-gradient(135deg, #1dbf73, #0a8c55)", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "24px" }}>O sucesso comeca aqui.</h2>
            <ul style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "18px", listStyle: "none", padding: 0 }}>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>✓</span> Mais de 700 categorias
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>✓</span> Trabalho de qualidade feito mais rapido
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>✓</span> Acesso a talentos em todo Mocambique
              </li>
            </ul>
          </div>

          {/* Lado direito */}
          <div style={{ flex: 1, padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#404145", marginBottom: "8px" }}>Crie a sua conta.</h1>
            <p style={{ color: "#74767e", fontSize: "14px", marginBottom: "32px" }}>
              Ja tem uma conta? <Link href="/login" style={{ color: "#1dbf73", fontWeight: "600", textDecoration: "none" }}>Entre aqui.</Link>
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#404145", marginBottom: "8px" }}>Nome completo</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="O seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#404145", marginBottom: "8px" }}>Senha</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#404145", marginBottom: "8px" }}>Tipo de conta</label>
                <select
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="client">Cliente</option>
                </select>
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-green" disabled={loading}>
                {loading ? "A registar..." : "Criar conta"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

