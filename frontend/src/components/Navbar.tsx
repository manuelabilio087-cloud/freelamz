"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <nav style={{
      background: "#fff",
      borderBottom: "1px solid #e8eaf0",
      padding: "0 32px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="40" viewBox="0 0 200 50">
          <rect x="0" y="0" width="50" height="50" rx="12" fill="#1a1a1a"/>
          <rect x="13" y="10" width="5" height="28" rx="2" fill="#22c55e"/>
          <rect x="13" y="10" width="20" height="5" rx="2" fill="#22c55e"/>
          <rect x="13" y="22" width="15" height="5" rx="2" fill="#22c55e"/>
          <text x="60" y="34" fontFamily="Inter, Arial, sans-serif" fontSize="22" fontWeight="700" fill="#1a1a1a" letterSpacing="-0.5">freel<tspan fill="#22c55e">amz</tspan></text>
        </svg>
      </Link>

      <div style={{ display: "flex", gap: "20px", fontSize: "14px", alignItems: "center" }}>
        <Link href="/freelancers" style={{ color: "#6b7280", textDecoration: "none" }}>Freelancers</Link>
        <Link href="/projects" style={{ color: "#6b7280", textDecoration: "none" }}>Projectos</Link>
        <Link href="/pricing" style={{ color: "#6b7280", textDecoration: "none" }}>Planos</Link>
        {user ? (
          <Link href={user.role === "client" ? "/client-dashboard" : "/dashboard"}
            style={{ background: "#6366f1", color: "#fff", padding: "8px 18px", borderRadius: "8px", fontWeight: "600", textDecoration: "none" }}>
            Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" style={{ color: "#6b7280", textDecoration: "none" }}>Entrar</Link>
            <Link href="/register"
              style={{ background: "#6366f1", color: "#fff", padding: "8px 18px", borderRadius: "8px", fontWeight: "600", textDecoration: "none" }}>
              Registar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}