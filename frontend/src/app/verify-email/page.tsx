"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Esta rota estava com codigo duplicado de um dashboard (bug), sem nenhuma
// ligacao no site. O fluxo real de verificacao de email vive em /verify-phone.
// Mantemos este redirect para nao deixar um link morto para quem aceder
// diretamente a /verify-email.
export default function VerifyEmailRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/verify-phone");
  }, [router]);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", color: "#74767e" }}>
      A redirecionar...
    </div>
  );
}
