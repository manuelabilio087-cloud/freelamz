"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const Search = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const Pin = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const Check = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const Star = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const Filter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const X = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const Arr = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const Msg = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;

const CATEGORIES = ["Todos","Desenvolvimento Web","Design Grafico","Marketing Digital","Redacao e Traducao","Video e Animacao","Musica e Audio","Servicos de IA","Negocios"];
const CAT_ICONS: any = {
  "Todos":"🌍","Desenvolvimento Web":"💻","Design Grafico":"🎨","Marketing Digital":"📈",
  "Redacao e Traducao":"✍️","Video e Animacao":"🎬","Musica e Audio":"🎵","Servicos de IA":"🤖","Negocios":"💼"
};
const SORT_OPTIONS = [
  { value:"recent",  label:"Mais recentes" },
  { value:"rating",  label:"Melhor avaliação" },
  { value:"pro",     label:"Pro primeiro" },
];

export default function FreelancersPage() {
  const router = useRouter();
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [minRating, setMinRating] = useState(0);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyPro, setOnlyPro] = useState(false);
  const [sort, setSort] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/users/freelancers`, { cache: "no-store" } as any)
      .then(r => r.json()).then(d => setFreelancers(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const parseSkills = (s: any) => {
    if (Array.isArray(s)) return s;
    try { return JSON.parse(s); } catch { return []; }
  };

  const filtered = useMemo(() => {
    let r = [...freelancers];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(f => f.name?.toLowerCase().includes(q) || f.bio?.toLowerCase().includes(q) || parseSkills(f.skills).some((s: string) => s.toLowerCase().includes(q)));
    }
    if (category !== "Todos") r = r.filter(f => parseSkills(f.skills).some((s: string) => s.toLowerCase().includes(category.toLowerCase().split(" ")[0].toLowerCase())) || f.category === category);
    if (minRating > 0) r = r.filter(f => Number(f.rating || 0) >= minRating);
    if (onlyVerified) r = r.filter(f => f.verified);
    if (onlyPro) r = r.filter(f => f.plan === "pro");
    if (sort === "rating") r.sort((a,b) => Number(b.rating||0) - Number(a.rating||0));
    else if (sort === "pro") r.sort((a,b) => (b.plan==="pro"?1:0) - (a.plan==="pro"?1:0));
    else r.sort((a,b) => new Date(b.created_at||0).getTime() - new Date(a.created_at||0).getTime());
    return r;
  }, [freelancers, search, category, minRating, onlyVerified, onlyPro, sort]);

  const activeFilters = (category !== "Todos" ? 1:0) + (minRating>0?1:0) + (onlyVerified?1:0) + (onlyPro?1:0);
  const clearAll = () => { setCategory("Todos"); setMinRating(0); setOnlyVerified(false); setOnlyPro(false); setSearch(""); };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Inter,-apple-system,sans-serif;background:#f4f5f7;color:#111827}
        a{text-decoration:none;color:inherit}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeIn .25s ease}
        .hero{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 60%,#a78bfa 100%);padding:56px 24px 48px;text-align:center;color:#fff;position:relative;overflow:hidden}
        .hero::before{content:"";position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
        .hero-inner{position:relative;z-index:1}
        .hero h1{font-size:38px;font-weight:800;margin-bottom:12px;letter-spacing:-1px}
        .hero p{font-size:17px;opacity:.85;max-width:480px;margin:0 auto 28px}
        .search-wrap{max-width:540px;margin:0 auto;position:relative}
        .search-ic{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.7)}
        .search-in{width:100%;padding:14px 16px 14px 44px;border-radius:12px;border:2px solid rgba(255,255,255,.3);background:rgba(255,255,255,.15);color:#fff;font-size:15px;outline:none;backdrop-filter:blur(10px);font-family:inherit}
        .search-in::placeholder{color:rgba(255,255,255,.65)}
        .search-in:focus{border-color:rgba(255,255,255,.6);background:rgba(255,255,255,.2)}
        .hero-stats{display:flex;justify-content:center;gap:32px;margin-top:24px}
        .h-stat{text-align:center}
        .h-stat-val{font-size:22px;font-weight:800}
        .h-stat-lbl{font-size:12px;opacity:.75;margin-top:2px}
        .wrap{max-width:1160px;margin:0 auto;padding:32px 24px}
        .toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}
        .results-count{font-size:14px;color:#6b7280;font-weight:500}
        .results-count span{color:#111827;font-weight:700}
        .right-tools{display:flex;align-items:center;gap:10px}
        .sort-sel{padding:8px 14px;border:1.5px solid #e8eaed;border-radius:8px;font-size:13px;background:#fff;color:#111827;outline:none;cursor:pointer;font-family:inherit}
        .sort-sel:focus{border-color:#6366f1}
        .filter-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #e8eaed;border-radius:8px;font-size:13px;font-weight:600;background:#fff;color:#374151;cursor:pointer;transition:all .15s;position:relative}
        .filter-btn:hover{border-color:#6366f1;color:#6366f1}
        .filter-btn.active{border-color:#6366f1;background:#eef2ff;color:#4f46e5}
        .filter-bdg{position:absolute;top:-6px;right:-6px;width:18px;height:18px;background:#6366f1;color:#fff;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center}
        .cats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
        .cat-pill{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:20px;border:1.5px solid #e8eaed;background:#fff;font-size:13px;font-weight:500;color:#6b7280;cursor:pointer;transition:all .15s;white-space:nowrap}
        .cat-pill:hover{border-color:#6366f1;color:#6366f1}
        .cat-pill.active{border-color:#6366f1;background:#eef2ff;color:#4f46e5;font-weight:600}
        .filter-panel{background:#fff;border:1.5px solid #e8eaed;border-radius:14px;padding:20px 24px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;align-items:start}
        .fp-title{font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px}
        .rating-opts{display:flex;flex-direction:column;gap:6px}
        .r-opt{display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 8px;border-radius:6px;transition:background .15s}
        .r-opt:hover{background:#f4f5f7}
        .r-opt input{accent-color:#6366f1;width:14px;height:14px}
        .r-opt-stars{display:flex;gap:2px}
        .r-opt-lbl{font-size:13px;color:#374151}
        .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0}
        .toggle-row:last-child{border-bottom:none}
        .toggle-lbl{font-size:13px;color:#374151;font-weight:500}
        .toggle{width:38px;height:20px;background:#e8eaed;border-radius:10px;cursor:pointer;position:relative;transition:background .2s;border:none;flex-shrink:0}
        .toggle.on{background:#6366f1}
        .toggle::after{content:"";position:absolute;top:3px;left:3px;width:14px;height:14px;background:#fff;border-radius:50%;transition:transform .2s}
        .toggle.on::after{transform:translateX(18px)}
        .active-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
        .af-tag{display:flex;align-items:center;gap:5px;padding:4px 10px;background:#eef2ff;color:#4f46e5;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer}
        .af-tag:hover{background:#e0e7ff}
        .clear-btn{font-size:12px;color:#ef4444;background:none;border:none;cursor:pointer;font-weight:600;padding:4px 8px;border-radius:20px}
        .clear-btn:hover{background:#fef2f2}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .card{background:#fff;border:1.5px solid #e8eaed;border-radius:16px;padding:24px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
        .card:hover{border-color:#6366f1;transform:translateY(-3px);box-shadow:0 12px 32px rgba(99,102,241,.12)}
        .pro-strip{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6)}
        .card-top{display:flex;align-items:flex-start;gap:14px;margin-bottom:14px}
        .av{width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;font-weight:700;flex-shrink:0;overflow:hidden}
        .av img{width:100%;height:100%;object-fit:cover}
        .card-inf{flex:1;min-width:0}
        .card-name{font-size:15px;font-weight:700;color:#111827;margin-bottom:3px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
        .badge-ver{display:inline-flex;align-items:center;gap:3px;background:#ecfdf5;color:#10b981;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600}
        .badge-pro{display:inline-flex;align-items:center;gap:3px;background:#f5f3ff;color:#7c3aed;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600}
        .card-loc{font-size:12px;color:#9ca3af;display:flex;align-items:center;gap:3px;margin-bottom:4px}
        .card-rating{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:#111827}
        .card-rating span{color:#9ca3af;font-weight:400;font-size:12px}
        .card-bio{font-size:13px;color:#6b7280;line-height:1.6;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:42px}
        .skills{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px;min-height:24px}
        .skill{padding:3px 9px;background:#eef2ff;color:#4f46e5;border-radius:20px;font-size:11px;font-weight:600}
        .skill-more{padding:3px 9px;background:#f4f5f7;color:#6b7280;border-radius:20px;font-size:11px;font-weight:600}
        .card-footer{display:flex;gap:8px}
        .btn-profile{flex:1;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:10px;border-radius:9px;font-weight:600;font-size:13px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity .15s}
        .btn-profile:hover{opacity:.88}
        .btn-msg{width:38px;height:38px;border-radius:9px;border:1.5px solid #e8eaed;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6b7280;transition:all .15s;flex-shrink:0}
        .btn-msg:hover{border-color:#6366f1;color:#6366f1}
        .empty-state{grid-column:1/-1;text-align:center;padding:80px 24px;background:#fff;border-radius:16px;border:1.5px solid #e8eaed}
        .empty-state p{font-size:15px;color:#6b7280;margin-bottom:16px}
        .btn-clear{background:#6366f1;color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;border:none;cursor:pointer}
        .loading-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .skel{background:#fff;border-radius:16px;height:220px;border:1.5px solid #e8eaed;overflow:hidden;position:relative}
        .skel::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(0,0,0,.04),transparent);animation:shimmer 1.5s infinite}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @media(max-width:960px){.grid{grid-template-columns:repeat(2,1fr)}.loading-grid{grid-template-columns:repeat(2,1fr)}.filter-panel{grid-template-columns:1fr 1fr}}
        @media(max-width:600px){.grid{grid-template-columns:1fr}.loading-grid{grid-template-columns:1fr}.hero h1{font-size:26px}.filter-panel{grid-template-columns:1fr}.cats{gap:6px}.hero-stats{gap:20px}}
      `}</style>

      <div className="hero">
        <div className="hero-inner">
          <h1>Freelancers em Moçambique</h1>
          <p>Encontra profissionais talentosos para o teu projecto. Design, programação, marketing e muito mais.</p>
          <div className="search-wrap">
            <span className="search-ic"><Search/></span>
            <input className="search-in" placeholder="Pesquisa por nome, skill ou área..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="hero-stats">
            <div className="h-stat"><div className="h-stat-val">{freelancers.length}</div><div className="h-stat-lbl">Freelancers</div></div>
            <div className="h-stat"><div className="h-stat-val">{freelancers.filter(f=>f.verified).length}</div><div className="h-stat-lbl">Verificados</div></div>
            <div className="h-stat"><div className="h-stat-val">{freelancers.filter(f=>f.plan==="pro").length}</div><div className="h-stat-lbl">Pro</div></div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="cats">
          {CATEGORIES.map(c => (
            <div key={c} className={`cat-pill ${category===c?"active":""}`} onClick={() => setCategory(c)}>
              <span>{CAT_ICONS[c]}</span> {c}
            </div>
          ))}
        </div>

        <div className="toolbar">
          <div className="results-count"><span>{filtered.length}</span> freelancer{filtered.length!==1?"s":""} encontrado{filtered.length!==1?"s":""}</div>
          <div className="right-tools">
            <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button className={`filter-btn ${showFilters||activeFilters>0?"active":""}`} onClick={() => setShowFilters(v=>!v)}>
              <Filter/> Filtros
              {activeFilters > 0 && <span className="filter-bdg">{activeFilters}</span>}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filter-panel fade">
            <div>
              <div className="fp-title">Avaliação mínima</div>
              <div className="rating-opts">
                {[0,3,4,5].map(r => (
                  <label key={r} className="r-opt">
                    <input type="radio" name="rating" checked={minRating===r} onChange={() => setMinRating(r)}/>
                    {r===0 ? <span className="r-opt-lbl">Qualquer avaliação</span> : (
                      <><div className="r-opt-stars">{[1,2,3,4,5].map(i=><span key={i}>{i<=r?"⭐":"☆"}</span>)}</div><span className="r-opt-lbl">{r}★ ou mais</span></>
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className="fp-title">Filtros rápidos</div>
              <div className="toggle-row">
                <span className="toggle-lbl">Apenas verificados</span>
                <button className={`toggle ${onlyVerified?"on":""}`} onClick={() => setOnlyVerified(v=>!v)}/>
              </div>
              <div className="toggle-row">
                <span className="toggle-lbl">Apenas Pro</span>
                <button className={`toggle ${onlyPro?"on":""}`} onClick={() => setOnlyPro(v=>!v)}/>
              </div>
            </div>
            <div>
              <div className="fp-title">Acções</div>
              <button onClick={clearAll} style={{width:"100%",padding:"10px",border:"1.5px solid #e8eaed",borderRadius:"8px",background:"#fff",color:"#ef4444",fontWeight:"600",fontSize:"13px",cursor:"pointer"}}>Limpar todos os filtros</button>
            </div>
          </div>
        )}

        {activeFilters > 0 && (
          <div className="active-filters">
            {category!=="Todos" && <div className="af-tag" onClick={() => setCategory("Todos")}>{category} <X/></div>}
            {minRating>0 && <div className="af-tag" onClick={() => setMinRating(0)}>{minRating}★+ <X/></div>}
            {onlyVerified && <div className="af-tag" onClick={() => setOnlyVerified(false)}>Verificados <X/></div>}
            {onlyPro && <div className="af-tag" onClick={() => setOnlyPro(false)}>Pro <X/></div>}
            <button className="clear-btn" onClick={clearAll}>Limpar tudo</button>
          </div>
        )}

        {loading ? (
          <div className="loading-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skel"/>)}
          </div>
        ) : (
          <div className="grid fade">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div style={{fontSize:"40px",marginBottom:"12px"}}>🔍</div>
                <p>Nenhum freelancer encontrado com estes filtros.</p>
                <button className="btn-clear" onClick={clearAll}>Limpar filtros</button>
              </div>
            ) : filtered.map((f,i) => {
              const skills = Array.isArray(f.skills) ? f.skills : (() => { try { return JSON.parse(f.skills); } catch { return []; } })();
              const rating = Number(f.rating || 0);
              return (
                <div key={f.id} className="card" style={{animationDelay:`${i*0.04}s`}} onClick={() => router.push(`/freelancer/${f.id}`)}>
                  {f.plan === "pro" && <div className="pro-strip"/>}
                  <div className="card-top">
                    <div className="av">{f.avatar ? <img src={f.avatar} alt={f.name}/> : f.name?.[0]}</div>
                    <div className="card-inf">
                      <div className="card-name">
                        {f.name}
                        {f.verified && <span className="badge-ver"><Check/> Verificado</span>}
                        {f.plan==="pro" && <span className="badge-pro">⭐ Pro</span>}
                      </div>
                      {f.location && <div className="card-loc"><Pin/> {f.location}</div>}
                      {rating > 0 && (
                        <div className="card-rating">
                          <Star/> {rating.toFixed(1)} <span>({f.review_count||0} avaliações)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="card-bio">{f.bio || "Freelancer profissional em Moçambique."}</p>
                  <div className="skills">
                    {skills.slice(0,3).map((s:string,j:number) => <span key={j} className="skill">{s}</span>)}
                    {skills.length>3 && <span className="skill-more">+{skills.length-3}</span>}
                  </div>
                  <div className="card-footer">
                    <button className="btn-profile" onClick={e => { e.stopPropagation(); router.push(`/freelancer/${f.id}`); }}>
                      Ver perfil <Arr/>
                    </button>
                    <button className="btn-msg" title="Enviar mensagem" onClick={e => { e.stopPropagation(); router.push(`/messages?to=${f.id}`); }}>
                      <Msg/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}