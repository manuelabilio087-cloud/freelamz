"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ProjectsRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // A Freelamz mudou para o modelo de servicos (estilo Fiverr):
    // o marketplace agora vive em /search/gigs.
    const search = searchParams.get("search");
    router.replace(search ? `/search/gigs?search=${encodeURIComponent(search)}` : "/search/gigs");
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", color: "#6b7280" }}>
      A redireccionar...
    </div>
  );
}

export default function ProjectsRedirect() {
  return (
    <Suspense fallback={null}>
      <ProjectsRedirectInner />
    </Suspense>
  );
}
