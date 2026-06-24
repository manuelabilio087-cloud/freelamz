"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Freelancers() {
  const router = useRouter();
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = ["Todos","Desenvolvimento Web","Design Grafico","Marketing Digital","Redacao","Video","Musica","Traducao","IA","Negocios"];

  useEffect(() => {
    fetch(`${API_URL}/users/freelancers`)
      .then(r => r.json())
      .then(data => { setFreelancers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = freelancers.filter(f => {
    const matchSearch = f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.bio?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || category === "Todos" ||
      (Array.isArray(f.skills) && f.skills.includes(category));
    return matchSearch && matchCat;
  });

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #fff !important; }
        body { font-family: Inter, sans-serif; color: #404145; }
        a { text-decoration: none; color: inherit; }
        .navbar { background: #fff; border-bottom: 1px solid #e4e5e7; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 22px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .nav-links { display: flex; align-items: center; gap: 16px; font-size: 14px; }
        .btn-primary { background: #1dbf73; color: #fff; padding: 10px 20px; border-radius: 4px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; }
        .hero { background: linear-gradient(135deg, #1dbf73, #0fa85c); color: #fff; padding: 48px 32px; text-align: center; }
        .hero h1 { font-size: 36px; font-weight: 700; margin-bottom: 8px; }
        .hero p { font-size: 16px; opacity: 0.9; margin-bottom: 28px; }
        .search-bar { display: flex; gap: 12px; max-width: 600px; margin: 0 auto; }
        .search-bar input { flex: 1; padding: 12px 16px; border: none; border-radius: 4px; font-size: 15px; outline: none; color: #404145; }
        .search-bar button { background: #000; color: #fff; padding: 12px 24px; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; }
        .container { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
        .filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }
        .filter-btn { padding: 8px 16px; border: 1px solid #e4e5e7; border-radius: 20px; font-size: 13px; cursor: pointer; background: #fff; color: #404145; transition: all 0.2s; }
        .filter-btn.active { background: #1dbf73; color: #fff; border-color: #1dbf73; }
        .stats { font-size: 14px; color: #74767e; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 16px; padding: 28px 24px; text-align: center; transition: all 0.2s; cursor: pointer; }
        .card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-4px); border-color: #1dbf73; }
        .avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #1dbf73, #0fa85c); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 28px; font-weight: 700; margin: 0 auto 16px; }
        .name { font-size: 18px; font-weight: 700; margin-bottom: 4px; color: #404145; }
        .role { font-size: 13px; color: #1dbf73; font-weight: 600; margin-bottom: 10px; }
        .bio { font-size: 13px; color: #74767e; line-height: 1.6; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 40px; }
        .skills { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 20px; min-height: 28px; }
        .skill { background: #f0fdf8; color: #1dbf73; font-size: 11px; padding: 4px 10px; border-radius: 12px; font-weight: 500; border: 1px solid #c8f0dc; }
        .divider { height: 1px; background: #e4e5e7; margin-bottom: 16px; }
        .card-footer { display: flex; gap: 8px; }
        .btn-profile { flex: 1; padding: 10px; background: #fff; color: #404145; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .btn-contact { flex: 1; padding: 10px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .empty { text-align: center; padding: 80px 24px; color: #74767e; }
        .empty-icon { font-size: 64px; margin-bottom: 16px; }
        .empty h2 { font-size: 22px; font-weight: 600; margin-bottom: 8px; color: #404145; }
        .loading { text-align: center; padding: 80px; color: #74767e; font-size: 16px; }
        @media (max-width: 768px) {
          .navbar { padding: 0 16px; }
          .hero { padding: 32px 16px; }
          .hero h1 { font-size: 26px; }
          .search-bar { flex-direction: column; }
          .container { padding: 24px 16px; }
          .grid { grid-template-columns: 1fr; }
          .nav-links { display: none; }
        }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="logo">Freelamz<span>.</span></Link>
        <div className="nav-links">
          <Link href="/projects">Projectos</Link>
          <Link href="/freelancers" style={{color:"#1dbf73",fontWeight:"600"}}>Freelancers</Link>
          <Link href="/messages">Mensagens</Link>
          <Link href="/register"><button className="btn-primary">Registar</button></Link>
        </div>
      </nav>

      <div className="hero">
        <h1>Encontra o freelancer certo</h1>
        <p>Talentos verificados prontos para o teu projecto</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Pesquisar por nome ou habilidade..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button>Pesquisar</button>
        </div>
      </div>

      <div className="container">
        <div className="filters">
          {categories.map((c, i) => (
            <button
              key={i}
              className={`filter-btn ${category === c || (c === "Todos" && !category) ? "active" : ""}`}
              onClick={() => setCategory(c === "Todos" ? "" : c)}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="stats">🔍 {filtered.length} freelancer{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>

        {loading ? (
          <div className="loading">⏳ A carregar freelancers...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">👥</div>
            <h2>Nenhum freelancer encontrado</h2>
            <p>Tenta pesquisar por outra habilidade.</p>
            <br/>
            <Link href="/register">
              <button className="btn-primary" style={{padding:"12px 24px"}}>Junta-te como freelancer</button>
            </Link>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((f, i) => (
              <div key={i} className="card">
                <div className="avatar">{f.name?.[0] || "F"}</div>
                <div className="name">{f.name}</div>
                <div className="role">
                  {Array.isArray(f.skills) && f.skills.length > 0 ? f.skills[0] : "Freelancer"}
                </div>
                <div className="bio">{f.bio || "Freelancer profissional disponível para projectos em Mocambique."}</div>
                <div className="skills">
                  {Array.isArray(f.skills) && f.skills.slice(0, 3).map((s: string, j: number) => (
                    <span key={j} className="skill">{s}</span>
                  ))}
                </div>
                <div className="divider"></div>
                <div className="card-footer">
                  <button className="btn-profile" onClick={() => router.push("/profile")}>
                    Ver perfil
                  </button>
                  <button className="btn-contact" onClick={() => router.push("/messages")}>
                    Contactar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}