"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = ["Todos","Desenvolvimento Web","Design Grafico","Marketing Digital","Redacao","Video","Musica","Traducao","IA","Negocios"];

  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then(r => r.json())
      .then(data => { setProjects(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || category === "Todos" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #fff !important; }
        body { font-family: Inter, sans-serif; color: #404145; }
        a { text-decoration: none; color: inherit; }
        
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
        .filter-btn:hover, .filter-btn.active { background: #1dbf73; color: #fff; border-color: #1dbf73; }
        .stats { display: flex; gap: 8px; align-items: center; margin-bottom: 20px; font-size: 14px; color: #74767e; }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .project-card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 24px; transition: all 0.2s; cursor: pointer; }
        .project-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .card-category { font-size: 12px; color: #1dbf73; font-weight: 600; background: #e8faf0; padding: 4px 10px; border-radius: 20px; }
        .card-budget { font-size: 18px; font-weight: 700; color: #404145; }
        .card-title { font-size: 16px; font-weight: 600; color: #404145; margin-bottom: 8px; line-height: 1.4; }
        .card-desc { font-size: 13px; color: #74767e; line-height: 1.5; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .card-footer { display: flex; justify-content: space-between; align-items: center; }
        .card-client { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #74767e; }
        .avatar { width: 28px; height: 28px; border-radius: 50%; background: #1dbf73; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }
        .card-date { font-size: 12px; color: #b5b6b9; }
        .btn-proposal { background: #1dbf73; color: #fff; padding: 8px 16px; border-radius: 4px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; }
        .empty { text-align: center; padding: 80px 24px; color: #74767e; }
        .empty-icon { font-size: 64px; margin-bottom: 16px; }
        .empty h2 { font-size: 22px; font-weight: 600; margin-bottom: 8px; color: #404145; }
        .loading { text-align: center; padding: 80px; color: #74767e; font-size: 16px; }
        @media (max-width: 768px) {
          
          .hero { padding: 32px 16px; }
          .hero h1 { font-size: 26px; }
          .search-bar { flex-direction: column; }
          .container { padding: 24px 16px; }
          .projects-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      

      <div className="hero">
        <h1>Encontra o teu proximo projecto</h1>
        <p>Milhares de oportunidades para freelancers em Mocambique</p>
        <div className="search-bar">
          <input type="text" placeholder="Pesquisar projectos..." value={search} onChange={e => setSearch(e.target.value)} />
          <button>Pesquisar</button>
        </div>
      </div>

      <div className="container">
        <div className="filters">
          {categories.map((c, i) => (
            <button key={i} className={`filter-btn ${category === c || (c === "Todos" && !category) ? "active" : ""}`} onClick={() => setCategory(c === "Todos" ? "" : c)}>{c}</button>
          ))}
        </div>

        <div className="stats">
          <span>🔍 {filtered.length} projectos encontrados</span>
        </div>

        {loading ? (
          <div className="loading">⏳ A carregar projectos...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📋</div>
            <h2>Nenhum projecto encontrado</h2>
            <p>Sê o primeiro a publicar um projecto!</p>
            <br/>
            <Link href="/projects/new"><button className="btn-primary" style={{padding:"12px 24px"}}>Publicar Projecto</button></Link>
          </div>
        ) : (
          <div className="projects-grid">
            {filtered.map((p, i) => (
              <div key={i} className="project-card" onClick={() => router.push(`/projects/${p.id}`)}>
                <div className="card-header">
                  <span className="card-category">{p.category || "Geral"}</span>
                  <span className="card-budget">{p.budget ? `${Number(p.budget).toLocaleString()} MT` : "A negociar"}</span>
                </div>
                <h3 className="card-title">{p.title}</h3>
                <p className="card-desc">{p.description}</p>
                <div className="card-footer">
                  <div className="card-client">
                    <div className="avatar">{p.client_name?.[0] || "C"}</div>
                    <span>{p.client_name || "Cliente"}</span>
                  </div>
                  <button className="btn-proposal" onClick={e => { e.stopPropagation(); router.push(`/projects/${p.id}`); }}>
                    Ver detalhes →
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
