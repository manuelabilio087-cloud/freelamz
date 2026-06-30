"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

interface Gig {
  id: number;
  title: string;
  category_id?: number;
  freelancer_name: string;
  freelancer_avatar?: string;
  freelancer_verified?: boolean;
  starting_price: string;
  fastest_delivery?: number;
  avg_rating: string;
  review_count: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preco" },
  { value: "price_desc", label: "Maior preco" },
  { value: "rating", label: "Melhor avaliacao" },
  { value: "popular", label: "Mais populares" },
];

function SearchGigsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categorySlug, setCategorySlug] = useState(searchParams.get("category_slug") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [maxDeliveryDays, setMaxDeliveryDays] = useState(searchParams.get("max_delivery_days") || "");
  const [minRating, setMinRating] = useState(searchParams.get("min_rating") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchGigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categorySlug, minPrice, maxPrice, maxDeliveryDays, minRating, sort]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categorySlug) params.append("category_slug", categorySlug);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (maxDeliveryDays) params.append("max_delivery_days", maxDeliveryDays);
      if (minRating) params.append("min_rating", minRating);
      if (sort) params.append("sort", sort);

      const res = await fetch(`${API_URL}/gigs?${params.toString()}`);
      const data = await res.json();
      setGigs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setMinPrice(""); setMaxPrice(""); setMaxDeliveryDays(""); setMinRating(""); setSort("newest");
  };

  const activeFilterCount = [minPrice, maxPrice, maxDeliveryDays, minRating].filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
        .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .btn-green { background: #1dbf73; color: #fff; padding: 10px 20px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; }
        .btn-outline { background: #fff; color: #404145; padding: 10px 16px; border-radius: 6px; font-weight: 600; border: 1px solid #c5c6c9; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; }
        .input-field { padding: 10px 14px; border: 1px solid #e4e5e7; border-radius: 8px; font-size: 14px; outline: none; }
        .input-field:focus { border-color: #1dbf73; }
        .category-pill { padding: 8px 16px; border-radius: 20px; border: 1px solid #e4e5e7; background: #fff; cursor: pointer; font-size: 13px; transition: all 0.2s; white-space: nowrap; }
        .category-pill:hover, .category-pill.active { background: #1dbf73; color: #fff; border-color: #1dbf73; }
        .filters-panel { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .filter-label { font-size: 12px; color: #74767e; font-weight: 600; margin-bottom: 6px; display: block; }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
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
            <button className="btn-outline" onClick={() => setShowFilters((v) => !v)}>
              Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <select className="input-field" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "12px" }}>
              <div>
                <label className="filter-label">Preco minimo (MT)</label>
                <input type="number" className="input-field" style={{ width: "100%" }} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" min="0" />
              </div>
              <div>
                <label className="filter-label">Preco maximo (MT)</label>
                <input type="number" className="input-field" style={{ width: "100%" }} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Sem limite" min="0" />
              </div>
              <div>
                <label className="filter-label">Prazo de entrega</label>
                <select className="input-field" style={{ width: "100%" }} value={maxDeliveryDays} onChange={(e) => setMaxDeliveryDays(e.target.value)}>
                  <option value="">Qualquer prazo</option>
                  <option value="1">Ate 1 dia</option>
                  <option value="3">Ate 3 dias</option>
                  <option value="7">Ate 7 dias</option>
                  <option value="14">Ate 14 dias</option>
                </select>
              </div>
              <div>
                <label className="filter-label">Avaliacao minima</label>
                <select className="input-field" style={{ width: "100%" }} value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                  <option value="">Qualquer avaliacao</option>
                  <option value="4.5">4.5+ estrelas</option>
                  <option value="4">4+ estrelas</option>
                  <option value="3">3+ estrelas</option>
                </select>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button className="btn-outline" onClick={clearFilters}>Limpar filtros</button>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
          <button className={`category-pill ${!categorySlug ? "active" : ""}`} onClick={() => setCategorySlug("")}>Todos</button>
          {categories.map((cat) => (
            <button key={cat.id} className={`category-pill ${categorySlug === cat.slug ? "active" : ""}`} onClick={() => setCategorySlug(cat.slug)}>
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#74767e" }}>Carregando...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {gigs.map((gig) => {
              const rating = parseFloat(gig.avg_rating) || 0;
              return (
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
                        <span style={{ fontSize: "13px", color: "#74767e" }}>{gig.freelancer_name}{gig.freelancer_verified ? " ✓" : ""}</span>
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#404145", marginBottom: "8px", lineHeight: "1.4" }}>{gig.title}</h3>
                      {gig.fastest_delivery && (
                        <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "12px" }}>Entrega em {gig.fastest_delivery} {parseInt(String(gig.fastest_delivery)) === 1 ? "dia" : "dias"}</p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f1f1f1", paddingTop: "12px" }}>
                        <span style={{ fontSize: "12px", color: "#74767e" }}>
                          ⭐ {rating > 0 ? rating.toFixed(1) : "Novo"} {parseInt(gig.review_count) > 0 && `(${gig.review_count})`}
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#404145" }}>A partir de {gig.starting_price} MT</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && gigs.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#74767e" }}>
            Nenhum servico encontrado com estes filtros.
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchGigs() {
  return (
    <Suspense fallback={null}>
      <SearchGigsInner />
    </Suspense>
  );
}
