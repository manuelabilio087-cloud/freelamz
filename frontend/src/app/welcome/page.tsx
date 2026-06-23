"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Welcome() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleContinue = () => {
    router.push("/profile");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <style>{`
        .btn-green { background: #1dbf73; color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-size: 16px; }
        .btn-green:hover { background: #19a463; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 16px; padding: 48px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); max-width: 520px; width: 100%; text-align: center; }
      `}</style>

      {/* Seta voltar */}
      <Link href="/" style={{ position: "absolute", top: "24px", left: "24px", color: "#404145", textDecoration: "none", fontSize: "28px", zIndex: 10 }}>←</Link>

      <div className="card">
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎉</div>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#404145", marginBottom: "12px" }}>
          Sua conta foi criada!
        </h1>
        <p style={{ color: "#74767e", fontSize: "16px", marginBottom: "32px", lineHeight: "1.6" }}>
          Bem-vindo ao Freelamz, {user?.name || "utilizador"}! A plataforma freelance de Mocambique.
        </p>

        <button onClick={handleContinue} className="btn-green">
          Completar perfil →
        </button>

        <p style={{ marginTop: "24px", fontSize: "14px", color: "#74767e" }}>
          <Link href="/" style={{ color: "#1dbf73", fontWeight: "600", textDecoration: "none" }}>Ir para a pagina inicial</Link>
        </p>
      </div>
    </div>
  );
}
