import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ fontSize: "72px", fontWeight: 800, color: "#1a1a1a", lineHeight: 1 }}>
          4<span style={{ color: "#22c55e" }}>0</span>4
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px" }}>
          Página não encontrada
        </h1>
        <p style={{ color: "#6b7280", fontSize: "15px", marginTop: "8px", maxWidth: "360px" }}>
          A página que procuras não existe ou foi movida.
        </p>
        <Link
          href="/"
          style={{
            marginTop: "24px",
            background: "#1a1a1a",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
