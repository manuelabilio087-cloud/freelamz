"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Welcome() {
  const router = useRouter();
  const [selected, setSelected] = useState<"client" | "freelancer" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: selected }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        if (selected === "client") {
          router.push("/client-dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        .btn-green { background: #1dbf73; color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-size: 16px; }
        .btn-green:hover { background: #19a463; }
        .btn-green:disabled { opacity: 0.6; cursor: not-allowed; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 16px; padding: 48px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 520px; width: 100%; text-align: center; }
        .option { border: 2px solid #e4e5e7; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.2s; text-align: left; }
        .option:hover { border-color: #1dbf73; }
        .option.selected { border-color: #1dbf73; background: #f0fdf4; }
        @media (max-width: 768px) { .options { flex-direction: column !important; } }
      `}</style>

      <Link href="/register" style={{ position: "absolute", top: "24px", left: "24px", color: "#404145", textDecoration: "none", fontSize: "28px", zIndex: 10 }}>←</Link>

      <div className="card">
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#404145", marginBottom: "8px" }}>
          Sua conta foi criada!
        </h1>
        <p style={{ color: "#74767e", fontSize: "16px", marginBottom: "32px" }}>
          O que te traz ao Freelamz?
        </p>

        <div className="options" style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <div
            className={`option ${selected === "client" ? "selected" : ""}`}
            onClick={() => setSelected("client")}
            style={{ flex: 1 }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>💼</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#404145", marginBottom: "6px" }}>Sou Cliente</h3>
            <p style={{ color: "#74767e", fontSize: "14px" }}>Quero contratar freelancers</p>
          </div>

          <div
            className={`option ${selected === "freelancer" ? "selected" : ""}`}
            onClick={() => setSelected("freelancer")}
            style={{ flex: 1 }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#404145", marginBottom: "6px" }}>Sou Freelancer</h3>
            <p style={{ color: "#74767e", fontSize: "14px" }}>Quero encontrar trabalho</p>
          </div>
        </div>

        <button onClick={handleContinue} className="btn-green" disabled={!selected || loading} style={{ width: "100%" }}>
          {loading ? "A guardar..." : "Proximo"}
        </button>
      </div>
    </div>
  );
}
