"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function GigDetail() {
  const params = useParams();
  const router = useRouter();
  const [gig, setGig] = useState<any>(null);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGig();
  }, [params.id]);

  const fetchGig = async () => {
    try {
      const res = await fetch(`${API_URL}/gigs/${params.id}`);
      const data = await res.json();
      setGig(data.gig);
      setPackages(data.packages);
      setReviews(data.reviews);
      if (data.packages.length > 0) setSelectedPackage(data.packages[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedPackage) return;
    localStorage.setItem("checkout_gig", JSON.stringify({ gig, selectedPackage }));
    router.push("/checkout");
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Carregando...</div>;

  if (!gig) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Gig nao encontrado</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .btn-green { background: #1dbf73; color: #fff; padding: 12px 24px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; }
        .btn-green:hover { background: #19a463; }
        .btn-outline { background: #fff; color: #404145; padding: 12px 24px; border-radius: 6px; font-weight: 600; border: 1px solid #e4e5e7; cursor: pointer; }
        .package-card { border: 2px solid #e4e5e7; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; }
        .package-card:hover { border-color: #1dbf73; }
        .package-card.selected { border-color: #1dbf73; background: #f0fdf4; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 24px; }
        .gig-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
        .gig-sidebar { position: sticky; top: 84px; }
        @media (max-width: 768px) {
          .gig-layout { grid-template-columns: 1fr; }
          .gig-sidebar { position: static; }
        }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <Link href="/search/gigs" style={{ color: "#1dbf73", textDecoration: "none", fontSize: "14px" }}>← Voltar aos servicos</Link>
        </div>

        <div className="gig-layout">
          <div>
            <div className="card" style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#404145", marginBottom: "16px" }}>{gig.title}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#1dbf73", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "18px" }}>
                  {gig.freelancer_name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p style={{ fontWeight: "600", color: "#404145" }}>{gig.freelancer_name}</p>
                  <p style={{ fontSize: "13px", color: "#74767e" }}>{gig.freelancer_bio || "Freelancer"}</p>
                </div>
                <Link
                  href={`/messages?userId=${gig.freelancer_id}`}
                  style={{ marginLeft: "auto", fontSize: "13px", fontWeight: 600, color: "#1dbf73", textDecoration: "none", border: "1px solid #1dbf73", borderRadius: "6px", padding: "7px 14px", whiteSpace: "nowrap" }}
                >
                  Contactar
                </Link>
              </div>
              <div style={{ height: "300px", background: "linear-gradient(135deg, #1dbf73, #0a8c55)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px", marginBottom: "16px" }}>
                💼
              </div>
              <p style={{ color: "#404145", lineHeight: "1.6" }}>{gig.description}</p>
            </div>

            <div className="card">
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#404145", marginBottom: "16px" }}>Avaliacoes</h2>
              {reviews.length > 0 ? reviews.map((r: any, i: number) => (
                <div key={i} style={{ borderBottom: "1px solid #f1f1f1", padding: "12px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ color: "#f5a623" }}>{"⭐".repeat(r.rating)}</span>
                    <span style={{ fontSize: "13px", color: "#74767e" }}>{r.reviewer_name}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#404145" }}>{r.public_comment}</p>
                </div>
              )) : <p style={{ color: "#74767e" }}>Sem avaliacoes ainda.</p>}
            </div>
          </div>

          <div className="gig-sidebar">
            <div className="card">
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#404145", marginBottom: "16px" }}>Escolha o pacote</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {packages.map((pkg: any) => (
                  <div
                    key={pkg.id}
                    className={`package-card ${selectedPackage?.id === pkg.id ? "selected" : ""}`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "700", color: "#404145", textTransform: "capitalize" }}>{pkg.type}</span>
                      <span style={{ fontWeight: "700", color: "#1dbf73", fontSize: "18px" }}>{pkg.price} MT</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#74767e", marginBottom: "8px" }}>{pkg.title}</p>
                    <p style={{ fontSize: "12px", color: "#74767e" }}>Entrega em {pkg.delivery_days} dias • {pkg.revisions} revisoes</p>
                  </div>
                ))}
              </div>

              {selectedPackage && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "14px", color: "#404145", marginBottom: "8px" }}><strong>Descricao:</strong> {selectedPackage.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {selectedPackage.features?.map((f: string, i: number) => (
                      <span key={i} style={{ fontSize: "12px", background: "#f1f1f1", padding: "4px 10px", borderRadius: "12px" }}>✓ {f}</span>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={handleContinue} className="btn-green" style={{ width: "100%" }}>
                Continuar ({selectedPackage?.price} MT)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}