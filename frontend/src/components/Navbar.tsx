"use client";
import Link from "next/link";
import Image from "next/image";
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
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image src="/logo.svg" alt="Freelamz" width={140} height={35} priority />
      </Link>
      <div style={{ display: "flex", gap: "20px", fontSize: "14px", alignItems: "center" }}>
        <Link href="/freelancers" style={{ color: "#6b7280" }}>Freelancers</Link>
        <Link href="/projects" style={{ color: "#6b7280" }}>Projectos</Link>
        <Link href="/pricing" style={{ color: "#6b7280" }}>Planos</Link>
        {user ? (
          <Link href={user.role === "client" ? "/client-dashboard" : "/dashboard"}
            style={{ background: "#6366f1", color: "#fff", padding: "8px 18px", borderRadius: "8px", fontWeight: "600", textDecoration: "none" }}>
            Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" style={{ color: "#6b7280" }}>Entrar</Link>
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
