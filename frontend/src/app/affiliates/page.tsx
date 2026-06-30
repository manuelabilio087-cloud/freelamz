"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

interface ReferralData {
  referral_code: string;
  referral_link: string;
  total_referred: number;
  total_earned: number;
  pending_earnings: number;
}

export default function AffiliatesPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Precisas de iniciar sessao para veres o teu codigo de afiliado.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/affiliates/my-code`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.message || "Erro ao carregar dados.");
        setLoading(false);
        return;
      }
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
      setError("Erro ao ligar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.referral_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 24px; }
        .stat-card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 20px; }
        .btn-green { background: #1dbf73; color: #fff; padding: 11px 20px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#404145", marginBottom: "8px" }}>Programa de afiliados</h1>
        <p style={{ fontSize: "14px", color: "#74767e", marginBottom: "28px" }}>
          Convida amigos para a Freelamz. Quando se tornarem Pro, ganhas uma comissao.
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#74767e" }}>Carregando...</div>
        ) : error ? (
          <div className="card" style={{ textAlign: "center", color: "#991b1b" }}>{error}</div>
        ) : data ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div className="stat-card">
                <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "6px" }}>Pessoas referidas</p>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#404145" }}>{data.total_referred}</p>
              </div>
              <div className="stat-card">
                <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "6px" }}>Ganho total</p>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#1dbf73" }}>{data.total_earned.toLocaleString()} MT</p>
              </div>
              <div className="stat-card">
                <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "6px" }}>A receber</p>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#f59e0b" }}>{data.pending_earnings.toLocaleString()} MT</p>
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#404145", marginBottom: "6px" }}>O teu link de indicacao</h2>
              <p style={{ fontSize: "13px", color: "#74767e", marginBottom: "14px" }}>Partilha este link. Quem se registar com ele fica ligado a ti.</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  readOnly
                  value={data.referral_link}
                  style={{ flex: 1, minWidth: "220px", padding: "11px 14px", border: "1px solid #e4e5e7", borderRadius: "8px", fontSize: "13px", color: "#404145", background: "#f7f7f7" }}
                />
                <button className="btn-green" onClick={handleCopy}>{copied ? "Copiado!" : "Copiar link"}</button>
              </div>
              <p style={{ fontSize: "12px", color: "#74767e", marginTop: "14px" }}>
                Codigo: <strong style={{ color: "#404145" }}>{data.referral_code}</strong>
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
