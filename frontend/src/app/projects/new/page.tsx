"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsNewRedirect() {
  const router = useRouter();

  useEffect(() => {
    // A Freelamz mudou para o modelo de servicos (estilo Fiverr):
    // freelancers publicam servicos, clientes encomendam directamente.
    router.replace("/create-gig");
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", color: "#6b7280" }}>
      A redireccionar...
    </div>
  );
}
