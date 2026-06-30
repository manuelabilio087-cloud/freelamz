"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

interface FavGig {
  favorite_id: number;
  id: number;
  title: string;
  category: string;
  freelancer_name: string;
  freelancer_avatar?: string;
  starting_price: string;
}

interface FavFreelancer {
  favorite_id: number;
  id: number;
  name: string;
  bio: string;
  avatar?: string;
  location?: string;
  verified: boolean;
  seller_level: string;
}

const HeartFilledIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;

export default function FavoritesPage() {
  const [gigs, setGigs] = useState<FavGig[]>([]);
  const [freelancers, setFreelancers] = useState<FavFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"gigs" | "freelancers">("gigs");
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGigs(data.gigs || []);
      setFreelancers(data.freelancers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (type: "gig" | "freelancer", id: number) => {
    const token = localStorage.getItem("token");
    setRemovingId(id);
    try {
      const param = type === "gig" ? `gig_id=${id}` : `freelancer_id=${id}`;
      await fetch(`${API_URL}/favorites?${param}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (type === "gig") setGigs((prev) => prev.filter((g) => g.id !== id));
      else setFreelancers((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; overflow: hidden; transition: all 0.2s; position: relative; }
        .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .fav-tab { padding: 10px 18px; border-radius: 8px; border: none; background: transparent; font-size: 14px; font-weight: 600; cursor: pointer; color: #74767e; }
        .fav-tab.active { background: #fff; color: #404145; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .remove-btn { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.55); border: none; color: #ff5c5c; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2; }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#404145", marginBottom: "20px" }}>Favoritos</h1>

        <div style={{ display: "inline-flex", gap: "4px", background: "#ececec", padding: "4px", borderRadius: "10px", marginBottom: "24px" }}>
          <button className={`fav-tab ${tab === "gigs" ? "active" : ""}`} onClick={() => setTab("gigs")}>Servicos ({gigs.length})</button>
          <button className={`fav-tab ${tab === "freelancers" ? "active" : ""}`} onClick={() => setTab("freelancers")}>Freelancers ({freelancers.length})</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#74767e" }}>Carregando...</div>
        ) : tab === "gigs" ? (
          gigs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#74767e" }}>
              <p style={{ marginBottom: "16px" }}>Ainda nao guardaste nenhum servico.</p>
              <Link href="/search/gigs" style={{ color: "#1dbf73", fontWeight: 600, textDecoration: "none" }}>Explorar servicos</Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {gigs.map((gig) => (
                <div className="card" key={gig.favorite_id}>
                  <button className="remove-btn" onClick={() => removeFavorite("gig", gig.id)} disabled={removingId === gig.id} title="Remover dos favoritos">
                    <HeartFilledIcon />
                  </button>
                  <Link href={`/gig/${gig.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ height: "150px", background: "linear-gradient(135deg, #1dbf73, #0a8c55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px" }}>
                      💼
                    </div>
                    <div style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1dbf73", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "11px" }}>
                          {gig.freelancer_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontSize: "13px", color: "#74767e" }}>{gig.freelancer_name}</span>
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#404145", marginBottom: "8px", lineHeight: 1.4 }}>{gig.title}</h3>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f1f1", paddingTop: "12px" }}>
                        <span style={{ fontSize: "12px", color: "#74767e" }}>{gig.category}</span>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#404145" }}>{gig.starting_price} MT</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )
        ) : freelancers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#74767e" }}>
            <p style={{ marginBottom: "16px" }}>Ainda nao guardaste nenhum freelancer.</p>
            <Link href="/freelancers" style={{ color: "#1dbf73", fontWeight: 600, textDecoration: "none" }}>Explorar freelancers</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {freelancers.map((f) => (
              <div className="card" key={f.favorite_id} style={{ padding: "20px", textAlign: "center" }}>
                <button className="remove-btn" onClick={() => removeFavorite("freelancer", f.id)} disabled={removingId === f.id} title="Remover dos favoritos">
                  <HeartFilledIcon />
                </button>
                <Link href={`/freelancer/${f.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#1dbf73", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "22px", overflow: "hidden" }}>
                    {f.avatar ? <img src={f.avatar} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : f.name?.[0]?.toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#404145", marginBottom: "4px" }}>{f.name} {f.verified && "✓"}</h3>
                  {f.location && <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "8px" }}>{f.location}</p>}
                  {f.bio && <p style={{ fontSize: "12px", color: "#74767e", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>{f.bio}</p>}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
