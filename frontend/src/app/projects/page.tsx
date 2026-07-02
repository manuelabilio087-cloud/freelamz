"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const ClockIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ArrowRightIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const BriefcaseIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const CodeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const PaletteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
const TrendingIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const WriteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const VideoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
const MusicIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
const AiIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg>;
const BizIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const GlobeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const XIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const LOGO = () => (
  <svg width="130" height="32" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="50" height="50" rx="12" fill="#111"/>
    <rect x="13" y="10" width="5" height="28" rx="2" fill="#22c55e"/>
    <rect x="13" y="10" width="20" height="5" rx="2" fill="#22c55e"/>
    <rect x="13" y="22" width="15" height="5" rx="2" fill="#22c55e"/>
    <text x="60" y="34" fontFamily="Inter, Arial, sans-serif" fontSize="22" fontWeight="700" fill="#111" letterSpacing="-0.5">freel<tspan fill="#22c55e">amz</tspan></text>
  </svg>
);

const CAT_META: Record<string, { icon: any; color: string; bg: string }> = {
  "Desenvolvimento Web": { icon: <CodeIcon/>, color: "#4f46e5", bg: "#eef2ff" },
  "Design Grafico":      { icon: <PaletteIcon/>, color: "#7c3aed", bg: "#f5f3ff" },
  "Marketing Digital":   { icon: <TrendingIcon/>, color: "#d97706", bg: "#fffbeb" },
  "Redacao":             { icon: <WriteIcon/>, color: "#059669", bg: "#ecfdf5" },
  "Video":               { icon: <VideoIcon/>, color: "#dc2626", bg: "#fef2f2" },
  "Musica":              { icon: <MusicIcon/>, color: "#db2777", bg: "#fdf2f8" },
  "IA":                  { icon: <AiIcon/>, color: "#0284c7", bg: "#f0f9ff" },
  "Negocios":            { icon: <BizIcon/>, color: "#475569", bg: "#f8fafc" },
  "Traducao":            { icon: <GlobeIcon/>, color: "#0d9488", bg: "#f0fdfa" },
};

const ALL_CATS = ["Todos", ...Object.keys(CAT_META)];

const SORTS = [
  { label: "Mais recentes", value: "newest" },
  { label: "Maior orcamento", value: "budget_desc" },
  { label: "Menor orcamento", value: "budget_asc" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "hoje";
  if (d === 1) return "ontem";
  if (d < 7) return `ha ${d} dias`;
  if (d < 30) return `ha ${Math.floor(d / 7)} sem.`;
  return `ha ${Math.floor(d / 30)} meses`;
}

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    fetch(`${API_URL}/projects`)
      .then(r => r.json())
      .then(data => { setProjects(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  let filtered = projects.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || category === "Todos" || p.category === category;
    return matchSearch && matchCat;
  });

  if (sort === "budget_desc") filtered = [...filtered].sort((a, b) => (Number(b.budget) || 0) - (Number(a.budget) || 0));
  else if (sort === "budget_asc") filtered = [...filtered].sort((a, b) => (Number(a.budget) || 0) - (Number(b.budget) || 0));
  else filtered = [...filtered].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  const catMeta = (cat: string) => CAT_META[cat] || { icon: <BriefcaseIcon/>, color: "#6b7280", bg: "#f3f4f6" };

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #f5f6fa !important; color: #111827 !important; font-family: Inter, -apple-system, sans-serif; }
        a { text-decoration: none; color: inherit; }
        .hdr { background: #fff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 50; }
        .hdr-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .hdr-nav { display: flex; align-items: center; gap: 20px; font-size: 13.5px; color: #6b7280; font-weight: 500; }
        .hdr-nav a:hover { color: #111827; }
        .hdr-actions { display: flex; align-items: center; gap: 10px; }
        .btn-login { font-size: 13.5px; font-weight: 500; color: #374151; background: none; border: none; cursor: pointer; padding: 7px 12px; border-radius: 7px; }
        .btn-login:hover { background: #f3f4f6; }
        .btn-publish { background: #111827; color: #fff; font-size: 13.5px; font-weight: 600; padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: opacity .15s; }
        .btn-publish:hover { opacity: .85; }
        .hero-band { background: #111827; color: #fff; padding: 48px 24px; }
        .hero-inner { max-width: 1280px; margin: 0 auto; }
        .hero-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #22c55e; margin-bottom: 12px; }
        .hero-h1 { font-size: clamp(28px, 4vw, 44px); font-weight: 700; line-height: 1.15; margin-bottom: 8px; }
        .hero-h1 em { font-style: normal; color: #22c55e; }
        .hero-sub { font-size: 15px; color: #9ca3af; margin-bottom: 28px; }
        .search-wrap { display: flex; background: #fff; border-radius: 10px; overflow: hidden; max-width: 580px; }
        .search-wrap input { flex: 1; border: none; outline: none; padding: 13px 16px; font-size: 14px; color: #111827; min-width: 0; }
        .search-wrap button { background: #22c55e; border: none; color: #fff; width: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background .15s; }
        .search-wrap button:hover { background: #16a34a; }
        .hero-stats { display: flex; gap: 28px; margin-top: 24px; }
        .hero-stat { font-size: 13px; color: #6b7280; }
        .hero-stat strong { color: #fff; font-size: 20px; font-weight: 700; display: block; margin-bottom: 1px; }
        .body-wrap { max-width: 1280px; margin: 0 auto; padding: 28px 24px; display: grid; grid-template-columns: 220px 1fr; gap: 24px; align-items: start; }
        .sidebar { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; position: sticky; top: 76px; }
        .sb-section { padding: 16px; border-bottom: 1px solid #f3f4f6; }
        .sb-section:last-child { border-bottom: none; }
        .sb-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .8px; color: #9ca3af; margin-bottom: 10px; }
        .sb-cat { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 7px; cursor: pointer; font-size: 13px; color: #6b7280; font-weight: 500; transition: all .12s; }
        .sb-cat:hover { background: #f9fafb; color: #111827; }
        .sb-cat.active { background: #f0fdf4; color: #15803d; font-weight: 600; }
        .sb-cat-icon { width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sb-cat-count { margin-left: auto; font-size: 11px; background: #f3f4f6; padding: 1px 6px; border-radius: 10px; color: #9ca3af; }
        .sort-select { width: 100%; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 7px; font-size: 13px; color: #374151; background: #fff; outline: none; cursor: pointer; }
        .sort-select:focus { border-color: #22c55e; }
        .main-col { display: flex; flex-direction: column; gap: 16px; }
        .list-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .result-count { font-size: 14px; color: #6b7280; }
        .result-count strong { color: #111827; }
        .active-filter { display: inline-flex; align-items: center; gap: 5px; background: #f0fdf4; color: #15803d; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; cursor: pointer; border: 1px solid #bbf7d0; }
        .active-filter:hover { background: #dcfce7; }
        .proj-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px 22px; cursor: pointer; transition: all .18s; display: flex; flex-direction: column; gap: 0; }
        .proj-card:hover { border-color: #22c55e; box-shadow: 0 4px 20px rgba(0,0,0,.07); transform: translateY(-1px); }
        .pc-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
        .pc-cat-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; white-space: nowrap; }
        .pc-budget { font-size: 20px; font-weight: 700; color: #111827; white-space: nowrap; }
        .pc-budget-neg { font-size: 13px; font-weight: 500; color: #9ca3af; }
        .pc-title { font-size: 15px; font-weight: 600; color: #111827; line-height: 1.4; margin-bottom: 8px; }
        .pc-desc { font-size: 13px; color: #6b7280; line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 16px; }
        .pc-divider { border: none; border-top: 1px solid #f3f4f6; margin-bottom: 14px; }
        .pc-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .pc-meta { display: flex; align-items: center; gap: 14px; }
        .pc-meta-item { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #9ca3af; }
        .pc-avatar { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 10px; font-weight: 700; flex-shrink: 0; }
        .btn-detail { display: flex; align-items: center; gap: 5px; background: #111827; color: #fff; padding: 7px 14px; border-radius: 7px; font-size: 12.5px; font-weight: 600; border: none; cursor: pointer; transition: all .15s; flex-shrink: 0; }
        .btn-detail:hover { background: #22c55e; }
        .empty-box { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 72px 32px; text-align: center; }
        .empty-icon { width: 64px; height: 64px; border-radius: 16px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #d1d5db; margin: 0 auto 16px; }
        .empty-title { font-size: 17px; font-weight: 600; color: #111827; margin-bottom: 6px; }
        .empty-sub { font-size: 13px; color: #9ca3af; margin-bottom: 20px; }
        .btn-green { background: #22c55e; color: #fff; padding: 10px 22px; border-radius: 8px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; transition: background .15s; }
        .btn-green:hover { background: #16a34a; }
        .skeleton { background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .skel-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px 22px; }
        .nav-burger { display: none; background: transparent; border: none; color: #111827; cursor: pointer; padding: 4px; }
        .mob-menu-overlay { position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.5); }
        .mob-menu { position: absolute; top: 0; right: 0; width: 260px; max-width: 85vw; height: 100%; background: #fff; padding: 20px; }
        .mob-menu a { display: block; padding: 14px 8px; color: #111827; font-size: 15px; font-weight: 500; border-bottom: 1px solid #f3f4f6; }
        @media (max-width: 768px) {
          .body-wrap { grid-template-columns: 1fr; }
          .sidebar { position: static; }
          .hdr-nav { display: none; }
          .nav-burger { display: flex; }
          .hero-stats { gap: 16px; }
          .hdr-actions { gap: 6px; }
          .btn-publish span { display: none; }
          .btn-publish { padding: 8px 10px; }
        }
      `}</style>

      <header className="hdr">
        <div className="hdr-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <span onClick={() => router.push("/")} style={{ cursor: "pointer" }}><LOGO /></span>
            <nav className="hdr-nav">
              <a href="/projects">Projectos</a>
              <a href="/freelancers">Freelancers</a>
              <a href="/pricing">Planos</a>
            </nav>
          </div>
          <div className="hdr-actions">
            <button className="btn-login" onClick={() => router.push(user ? (user.role === "client" ? "/client-dashboard" : "/dashboard") : "/login")}>
              {user ? user.name?.split(" ")[0] : "Entrar"}
            </button>
            <button className="btn-publish" onClick={() => router.push("/projects/new")}>
              <PlusIcon /> <span>Publicar projecto</span>
            </button>
            <button className="nav-burger" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="mob-menu-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mob-menu" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <LOGO />
              <button onClick={() => setMobileOpen(false)} style={{ background: "transparent", border: "none", color: "#111827", cursor: "pointer" }} aria-label="Fechar menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <a href="/projects" onClick={() => setMobileOpen(false)}>Projectos</a>
            <a href="/freelancers" onClick={() => setMobileOpen(false)}>Freelancers</a>
            <a href="/pricing" onClick={() => setMobileOpen(false)}>Planos</a>
          </div>
        </div>
      )}

      <section className="hero-band">
        <div className="hero-inner">
          <div className="hero-eyebrow">Marketplace de Freelancers · Mocambique</div>
          <h1 className="hero-h1">Encontra o teu<br/>proximo <em>projecto</em></h1>
          <p className="hero-sub">Oportunidades reais, clientes locais, pagamento em meticais.</p>
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Pesquisar projectos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Escape" && setSearch("")}
            />
            <button><SearchIcon /></button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>{projects.length}</strong>projectos activos</div>
            <div className="hero-stat"><strong>{Object.keys(CAT_META).length}</strong>categorias</div>
            <div className="hero-stat"><strong>5%</strong>comissao da plataforma</div>
          </div>
        </div>
      </section>

      <div className="body-wrap">
        <aside className="sidebar">
          <div className="sb-section">
            <div className="sb-label">Categorias</div>
            {ALL_CATS.map(cat => {
              const count = cat === "Todos" ? projects.length : projects.filter(p => p.category === cat).length;
              const meta = CAT_META[cat];
              const isActive = (!category && cat === "Todos") || category === cat;
              return (
                <div key={cat} className={`sb-cat ${isActive ? "active" : ""}`} onClick={() => setCategory(cat === "Todos" ? "" : cat)}>
                  {meta ? (
                    <span className="sb-cat-icon" style={{ background: meta.bg, color: meta.color }}>{meta.icon}</span>
                  ) : (
                    <span className="sb-cat-icon" style={{ background: "#f3f4f6", color: "#9ca3af" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                    </span>
                  )}
                  {cat}
                  <span className="sb-cat-count">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="sb-section">
            <div className="sb-label">Ordenar por</div>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </aside>

        <div className="main-col">
          <div className="list-header">
            <span className="result-count"><strong>{filtered.length}</strong> {filtered.length === 1 ? "projecto" : "projectos"} encontrados</span>
            {category && (
              <span className="active-filter" onClick={() => setCategory("")}>
                {category} <XIcon />
              </span>
            )}
          </div>

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skel-card">
                <div className="skeleton" style={{ height: 18, width: "40%", marginBottom: 12 }}/>
                <div className="skeleton" style={{ height: 22, width: "75%", marginBottom: 10 }}/>
                <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: 6 }}/>
                <div className="skeleton" style={{ height: 14, width: "80%" }}/>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="empty-box">
              <div className="empty-icon"><BriefcaseIcon /></div>
              <div className="empty-title">{search ? "Nenhum projecto corresponde a pesquisa" : "Ainda nao ha projectos nesta categoria"}</div>
              <p className="empty-sub">{search ? "Tenta outros termos ou remove os filtros." : "Se o primeiro a publicar um projecto!"}</p>
              {search ? (
                <button className="btn-green" onClick={() => { setSearch(""); setCategory(""); }}>Limpar filtros</button>
              ) : (
                <button className="btn-green" onClick={() => router.push("/projects/new")}>Publicar projecto</button>
              )}
            </div>
          ) : (
            filtered.map((p, i) => {
              const cm = catMeta(p.category);
              return (
                <div key={i} className="proj-card" onClick={() => router.push(`/projects/${p.id}`)}>
                  <div className="pc-top">
                    <span className="pc-cat-pill" style={{ background: cm.bg, color: cm.color }}>
                      {cm.icon}&nbsp;{p.category || "Geral"}
                    </span>
                    {p.budget
                      ? <span className="pc-budget">{Number(p.budget).toLocaleString()} <span style={{ fontSize: 13, fontWeight: 500, color: "#9ca3af" }}>MT</span></span>
                      : <span className="pc-budget-neg">A negociar</span>
                    }
                  </div>
                  <h3 className="pc-title">{p.title}</h3>
                  <p className="pc-desc">{p.description}</p>
                  <hr className="pc-divider"/>
                  <div className="pc-footer">
                    <div className="pc-meta">
                      <span className="pc-meta-item">
                        <div className="pc-avatar">{p.client_name?.[0] || "C"}</div>
                        <span style={{ marginLeft: 4, color: "#6b7280", fontSize: 12 }}>{p.client_name || "Cliente"}</span>
                      </span>
                      {p.created_at && (
                        <span className="pc-meta-item">
                          <ClockIcon />
                          {timeAgo(p.created_at)}
                        </span>
                      )}
                    </div>
                    <button
                      className="btn-detail"
                      onClick={e => { e.stopPropagation(); router.push(`/projects/${p.id}`); }}
                    >
                      Ver detalhes <ArrowRightIcon />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}