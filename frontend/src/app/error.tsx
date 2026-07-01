"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
        fontFamily: "Inter, sans-serif",
        background: "#f7f7f7",
      }}
    >
      <div style={{ fontSize: "40px" }}>⚠️</div>
      <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px" }}>
        Algo correu mal
      </h1>
      <p style={{ color: "#6b7280", fontSize: "15px", marginTop: "8px", maxWidth: "360px" }}>
        Ocorreu um erro inesperado. Por favor, tenta novamente.
      </p>
      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button
          onClick={() => reset()}
          style={{
            background: "#1a1a1a",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
        <a
          href="/"
          style={{
            background: "#fff",
            color: "#1a1a1a",
            padding: "12px 28px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "14px",
            border: "1px solid #e4e5e7",
            textDecoration: "none",
          }}
        >
          Ir para o início
        </a>
      </div>
    </div>
  );
}
