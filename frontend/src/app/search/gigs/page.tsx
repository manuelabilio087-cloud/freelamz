"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function SearchGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const categories = [
    "Programacao e Tecnologia",
    "Design Grafico",
    "Marketing Digital",
    "Redacao e Traducao",
    "Video e Animacao",
    "Musica e Audio",
    "Negocios",
    "Servicos de IA",
  ];

  useEffect(() => {
    fetchGigs();
  }, [category, search]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/gigs`;
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (search) params.append("search", search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setGigs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
        .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .btn-green { background: #1dbf73; color: #fff; padding: 10px 20px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; }
        .input-field { padding: 10px 14px; border: 1px solid #e4e5e7; border-radius: 8px; font-size: 14px; outline: none; }
        .input-field:focus { border-color: #1dbf73; }
        .category-pill { padding: 8px 16px; border-radius: 20px; border: 1px solid #e4e5e7; background: #fff; cursor: pointer; font-size: 13px; transition: all 0.2s; }
        .category-pill:hover, .category-pill.active { background: #1dbf73; color: #fff; border-color: #1dbf73; }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#404145", marginBottom: "16px" }}>Encontre servicos</h1>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              className="input-field"
              placeholder="Buscar servicos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: "200px" }}
            />
            <button onClick={fetchGigs} className="btn-green">Buscar</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          <button className={`category-pill ${!category ? "active" : ""}`} onClick={() => setCategory("")}>Todos</button>
          {categories.map((cat) => (
            <button key={cat} className={`category-pill ${category === cat ? "active" : ""}`} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Carregando...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {gigs.map((gig: any) => (
              <Link href={`/gig/${gig.id}`} key={gig.id} style={{ textDecoration: "none" }}>
                <div className="card">
                  <div style={{ height: "160px", background: "linear-gradient(135deg, #1dbf73, #0a8c55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                    💼
                  </div>
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1dbf73", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "12px" }}>
                        {gig.freelancer_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span style={{ fontSize: "13px", color: "#74767e" }}>{gig.freelancer_name}</span>
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#404145", marginBottom: "8px", lineHeight: "1.4" }}>{gig.title}</h3>
                    <p style={{ fontSize: "13px", color: "#74767e", marginBottom: "12px" }}>{gig.category}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f1f1f1", paddingTop: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#74767e" }}>⭐ 5.0</span>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#404145" }}>A partir de {gig.starting_price} MT</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && gigs.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#74767e" }}>
            Nenhum servico encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
