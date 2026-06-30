"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

interface GigStat {
  id: number;
  title: string;
  views_count: number;
  orders_count: number;
  starting_price: string;
}

interface SellerAnalytics {
  gigs: GigStat[];
  total_views: number;
  total_orders: number;
  conversion_rate: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<SellerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Precisas de iniciar sessao para veres as tuas estatisticas.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/analytics/seller`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.message || "Erro ao carregar analytics.");
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

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 20px; }
        tr.gig-row:hover { background: #fafafa; }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#404145", marginBottom: "8px" }}>Analytics</h1>
        <p style={{ fontSize: "14px", color: "#74767e", marginBottom: "28px" }}>Desempenho dos teus servicos publicados.</p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#74767e" }}>Carregando...</div>
        ) : error ? (
          <div className="card" style={{ textAlign: "center", color: "#991b1b" }}>{error}</div>
        ) : data ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div className="card">
                <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "6px" }}>Visualizacoes totais</p>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#404145" }}>{data.total_views}</p>
              </div>
              <div className="card">
                <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "6px" }}>Encomendas totais</p>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#404145" }}>{data.total_orders}</p>
              </div>
              <div className="card">
                <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "6px" }}>Taxa de conversao</p>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#1dbf73" }}>{data.conversion_rate}%</p>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#404145", padding: "18px 20px 0" }}>Desempenho por servico</h2>
              {data.gigs.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#74767e" }}>
                  Ainda nao tens servicos publicados. <Link href="/create-gig" style={{ color: "#1dbf73", fontWeight: 600 }}>Cria o teu primeiro gig</Link>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
                    <thead>
                      <tr style={{ borderTop: "1px solid #e4e5e7", borderBottom: "1px solid #e4e5e7" }}>
                        <th style={{ textAlign: "left", padding: "10px 20px", fontSize: "12px", color: "#74767e", fontWeight: 600 }}>Servico</th>
                        <th style={{ textAlign: "right", padding: "10px 20px", fontSize: "12px", color: "#74767e", fontWeight: 600 }}>Visualizacoes</th>
                        <th style={{ textAlign: "right", padding: "10px 20px", fontSize: "12px", color: "#74767e", fontWeight: 600 }}>Encomendas</th>
                        <th style={{ textAlign: "right", padding: "10px 20px", fontSize: "12px", color: "#74767e", fontWeight: 600 }}>Conversao</th>
                        <th style={{ textAlign: "right", padding: "10px 20px", fontSize: "12px", color: "#74767e", fontWeight: 600 }}>A partir de</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.gigs.map((g) => {
                        const conv = g.views_count > 0 ? ((g.orders_count / g.views_count) * 100).toFixed(1) : "0.0";
                        return (
                          <tr key={g.id} className="gig-row" style={{ borderBottom: "1px solid #f1f1f1" }}>
                            <td style={{ padding: "14px 20px", fontSize: "14px", color: "#404145" }}>
                              <Link href={`/gig/${g.id}`} style={{ color: "#404145", textDecoration: "none", fontWeight: 600 }}>{g.title}</Link>
                            </td>
                            <td style={{ padding: "14px 20px", fontSize: "14px", color: "#404145", textAlign: "right" }}>{g.views_count}</td>
                            <td style={{ padding: "14px 20px", fontSize: "14px", color: "#404145", textAlign: "right" }}>{g.orders_count}</td>
                            <td style={{ padding: "14px 20px", fontSize: "14px", color: "#404145", textAlign: "right" }}>{conv}%</td>
                            <td style={{ padding: "14px 20px", fontSize: "14px", color: "#404145", textAlign: "right" }}>{g.starting_price ? `${g.starting_price} MT` : "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
