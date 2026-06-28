"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const CATEGORIES = [
  { name:"Todos",               icon:"ti-layout-grid" },
  { name:"Desenvolvimento Web", icon:"ti-device-laptop" },
  { name:"Design Grafico",      icon:"ti-palette" },
  { name:"Marketing Digital",   icon:"ti-trending-up" },
  { name:"Redacao e Traducao",  icon:"ti-pencil" },
  { name:"Video e Animacao",    icon:"ti-video" },
  { name:"Musica e Audio",      icon:"ti-music" },
  { name:"Servicos de IA",      icon:"ti-cpu" },
  { name:"Negocios",            icon:"ti-briefcase" },
];

const SORT_OPTIONS = [
  { value:"recent",  label:"Mais recentes",    icon:"ti-clock" },
  { value:"rating",  label:"Melhor avaliaÃ§Ã£o", icon:"ti-star" },
  { value:"pro",     label:"Pro primeiro",     icon:"ti-crown" },
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
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css";
    document.head.appendChild(link);
    fetch(`${API_URL}/users/freelancers`)
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
    if (category !== "Todos") r = r.filter(f => parseSkills(f.skills).some((s: string) => s.toLowerCase().includes(category.toLowerCase().split(" ")[0].toLowerCase())));
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
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}

        .hero{background:#1a1d27;padding:56px 24px 44px;color:#fff;position:relative;overflow:hidden}
        .hero::after{content:"";position:absolute;top:-120px;right:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(99,102,241,.25) 0%,transparent 70%);pointer-events:none}
        .hero-inner{position:relative;z-index:1;max-width:1160px;margin:0 auto}
        .hero-eyebrow{display:inline-flex;align-items:center;gap:7px;background:rgba(99,102,241,.18);border:1px solid rgba(99,102,241,.35);color:#a5b4fc;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:.4px;margin-bottom:18px}
        .hero h1{font-size:40px;font-weight:800;letter-spacing:-1.5px;line-height:1.1;margin-bottom:12px}
        .hero h1 span{color:#6366f1}
        .hero p{font-size:16px;color:rgba(255,255,255,.65);max-width:440px;margin-bottom:28px;line-height:1.6}
        .search-wrap{position:relative;max-width:520px}
        .search-ic{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.4);font-size:18px;pointer-events:none}
        .search-in{width:100%;padding:14px 16px 14px 46px;border-radius:12px;border:1.5px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:#fff;font-size:15px;outline:none;font-family:inherit;transition:all .2s}
        .search-in::placeholder{color:rgba(255,255,255,.35)}
        .search-in:focus{border-color:rgba(99,102,241,.6);background:rgba(255,255,255,.1)}
        .hero-stats{display:flex;gap:32px;margin-top:28px}
        .h-stat{display:flex;align-items:center;gap:10px}
        .h-stat-ic{width:36px;height:36px;border-radius:9px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:17px;color:rgba(255,255,255,.6)}
        .h-stat-txt{display:flex;flex-direction:column}
        .h-stat-val{font-size:20px;font-weight:700;line-height:1}
        .h-stat-lbl{font-size:11px;color:rgba(255,255,255,.45);margin-top:2px}

        .wrap{max-width:1160px;margin:0 auto;padding:28px 24px}
        .cats-scroll{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-bottom:20px;scrollbar-width:none}
        .cats-scroll::-webkit-scrollbar{display:none}
        .cat-pill{display:flex;align-items:center;gap:7px;padding:8px 16px;border-radius:20px;border:1.5px solid #e8eaed;background:#fff;font-size:13px;font-weight:500;color:#6b7280;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0}
        .cat-pill i{font-size:16px}
        .cat-pill:hover{border-color:#6366f1;color:#6366f1}
        .cat-pill.active{border-color:#6366f1;background:#6366f1;color:#fff;font-weight:600}
        .cat-pill.active i{color:#fff}

        .toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px}
        .results-lbl{font-size:14px;color:#6b7280}
        .results-lbl strong{color:#111827;font-weight:600}
        .right-tools{display:flex;align-items:center;gap:8px}
        .sort-sel{display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #e8eaed;border-radius:9px;font-size:13px;background:#fff;color:#374151;outline:none;cursor:pointer;font-family:inherit}
        .filter-btn{display:flex;align-items:center;gap:7px;padding:8px 14px;border:1.5px solid #e8eaed;border-radius:9px;font-size:13px;font-weight:600;background:#fff;color:#374151;cursor:pointer;transition:all .15s;position:relative;font-family:inherit}
        .filter-btn:hover{border-color:#6366f1;color:#6366f1}
        .filter-btn.active{border-color:#6366f1;background:#eef2ff;color:#4f46e5}
        .filter-bdg{position:absolute;top:-7px;right:-7px;width:18px;height:18px;background:#ef4444;color:#fff;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #f4f5f7}

        .filter-panel{background:#fff;border:1.5px solid #e8eaed;border-radius:14px;padding:20px 24px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px}
        .fp-lbl{font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.7px;margin-bottom:12px;display:flex;align-items:center;gap:6px}
        .fp-lbl i{font-size:14px}
        .r-opts{display:flex;flex-direction:column;gap:4px}
        .r-opt{display:flex;align-items:center;gap:8px;cursor:pointer;padding:7px 10px;border-radius:8px;transition:background .15s;user-select:none}
        .r-opt:hover{background:#f8f9fc}
        .r-opt input{accent-color:#6366f1;width:15px;height:15px;flex-shrink:0}
        .r-opt-stars{display:flex;gap:2px;font-size:12px}
        .r-opt-lbl{font-size:13px;color:#374151}
        .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f3f4f6}
        .toggle-row:last-child{border-bottom:none}
        .toggle-lbl{font-size:13px;color:#374151;font-weight:500;display:flex;align-items:center;gap:7px}
        .toggle-lbl i{font-size:16px;color:#9ca3af}
        .toggle{width:40px;height:22px;background:#e8eaed;border-radius:11px;cursor:pointer;position:relative;transition:background .2s;border:none;flex-shrink:0}
        .toggle.on{background:#6366f1}
        .toggle::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
        .toggle.on::after{transform:translateX(18px)}
        .clear-fp{width:100%;padding:10px;border:1.5px solid #e8eaed;border-radius:9px;background:#fff;color:#ef4444;font-weight:600;font-size:13px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .15s}
        .clear-fp:hover{background:#fef2f2;border-color:#fca5a5}

        .af-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px;align-items:center}
        .af-tag{display:flex;align-items:center;gap:5px;padding:4px 10px;background:#eef2ff;color:#4f46e5;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:none;font-family:inherit}
        .af-tag i{font-size:13px}
        .af-tag:hover{background:#e0e7ff}
        .clear-all{font-size:12px;color:#ef4444;background:none;border:none;cursor:pointer;font-weight:600;padding:4px 8px;border-radius:20px;font-family:inherit}

        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .card{background:#fff;border:1.5px solid #e8eaed;border-radius:16px;padding:22px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
        .card:hover{border-color:#6366f1;transform:translateY(-3px);box-shadow:0 12px 32px rgba(99,102,241,.11)}
        .pro-bar{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa)}
        .card-top{display:flex;align-items:flex-start;gap:13px;margin-bottom:14px}
        .av{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:19px;font-weight:700;flex-shrink:0;overflow:hidden}
        .av img{width:100%;height:100%;object-fit:cover}
        .card-inf{flex:1;min-width:0}
        .card-name{font-size:14px;font-weight:700;color:#111827;margin-bottom:4px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;line-height:1.2}
        .bdg-ver{display:inline-flex;align-items:center;gap:3px;background:#ecfdf5;color:#059669;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600}
        .bdg-ver i{font-size:11px}
        .bdg-pro{display:inline-flex;align-items:center;gap:3px;background:#f5f3ff;color:#7c3aed;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600}
        .bdg-pro i{font-size:11px}
        .card-loc{font-size:12px;color:#9ca3af;display:flex;align-items:center;gap:4px;margin-bottom:4px}
        .card-loc i{font-size:14px}
        .card-rating{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#111827}
        .card-rating i{font-size:14px;color:#f59e0b}
        .card-rating span{color:#9ca3af;font-weight:400}
        .card-bio{font-size:13px;color:#6b7280;line-height:1.6;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:40px}
        .skills{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px;min-height:22px}
        .skill{padding:3px 8px;background:#eef2ff;color:#4f46e5;border-radius:20px;font-size:11px;font-weight:600}
        .skill-more{padding:3px 8px;background:#f4f5f7;color:#6b7280;border-radius:20px;font-size:11px;font-weight:600}
        .card-footer{display:flex;gap:8px}
        .btn-profile{flex:1;background:#6366f1;color:#fff;padding:9px;border-radius:9px;font-weight:600;font-size:13px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity .15s;font-family:inherit}
        .btn-profile i{font-size:15px}
        .btn-profile:hover{opacity:.88}
        .btn-msg{width:36px;height:36px;border-radius:9px;border:1.5px solid #e8eaed;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6b7280;transition:all .15s;font-size:17px;flex-shrink:0}
        .btn-msg:hover{border-color:#6366f1;color:#6366f1}

        .skel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .skel{background:#fff;border-radius:16px;height:220px;border:1.5px solid #e8eaed;overflow:hidden;position:relative}
        .skel::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(0,0,0,.035),transparent);animation:shimmer 1.6s infinite}
        .empty{grid-column:1/-1;text-align:center;padding:72px 24px;background:#fff;border-radius:16px;border:1.5px solid #e8eaed}
        .empty i{font-size:40px;color:#d1d5db;display:block;margin-bottom:14px}
        .empty p{font-size:15px;color:#6b7280;margin-bottom:16px}
        .btn-clear{background:#6366f1;color:#fff;padding:10px 20px;border-radius:9px;font-size:14px;font-weight:600;border:none;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:7px}
        @media(max-width:960px){.grid{grid-template-columns:repeat(2,1fr)}.skel-grid{grid-template-columns:repeat(2,1fr)}.filter-panel{grid-template-columns:1fr 1fr}.hero-stats{gap:20px}}
        @media(max-width:600px){.grid{grid-template-columns:1fr}.skel-grid{grid-template-columns:1fr}.hero h1{font-size:28px}.filter-panel{grid-template-columns:1fr}.hero-stats{flex-wrap:wrap;gap:14px}}
      `}</style>

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <i className="ti ti-map-pin" aria-hidden="true"></i>
            MoÃ§ambique
          </div>
          <h1>Encontra o freelancer<br/><span>certo para o teu projecto</span></h1>
          <p>Profissionais verificados em design, programaÃ§Ã£o, marketing e muito mais â todos em MoÃ§ambique.</p>
          <div className="search-wrap">
            <i className="ti ti-search search-ic" aria-hidden="true"></i>
            <input className="search-in" placeholder="Pesquisa por nome, skill ou Ã¡rea..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="hero-stats">
            {[
              {icon:"ti-users", val:freelancers.length, lbl:"Freelancers"},
              {icon:"ti-shield-check", val:freelancers.filter(f=>f.verified).length, lbl:"Verificados"},
              {icon:"ti-crown", val:freelancers.filter(f=>f.plan==="pro").length, lbl:"Pro"},
              {icon:"ti-star", val:"4.8", lbl:"AvaliaÃ§Ã£o mÃ©dia"},
            ].map((s,i) => (
              <div key={i} className="h-stat">
                <div className="h-stat-ic"><i className={`ti ${s.icon}`} aria-hidden="true"></i></div>
                <div className="h-stat-txt">
                  <span className="h-stat-val">{s.val}</span>
                  <span className="h-stat-lbl">{s.lbl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="cats-scroll">
          {CATEGORIES.map(c => (
            <div key={c.name} className={`cat-pill ${category===c.name?"active":""}`} onClick={() => setCategory(c.name)}>
              <i className={`ti ${c.icon}`} aria-hidden="true"></i>
              {c.name}
            </div>
          ))}
        </div>

        <div className="toolbar">
          <div className="results-lbl"><strong>{filtered.length}</strong> freelancer{filtered.length!==1?"s":""} encontrado{filtered.length!==1?"s":""}</div>
          <div className="right-tools">
            <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button className={`filter-btn ${showFilters||activeFilters>0?"active":""}`} onClick={() => setShowFilters(v=>!v)}>
              <i className="ti ti-adjustments-horizontal" aria-hidden="true"></i>
              Filtros
              {activeFilters > 0 && <span className="filter-bdg">{activeFilters}</span>}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filter-panel fade">
            <div>
              <div className="fp-lbl"><i className="ti ti-star" aria-hidden="true"></i> AvaliaÃ§Ã£o mÃ­nima</div>
              <div className="r-opts">
                {[
                  {val:0, lbl:"Qualquer avaliaÃ§Ã£o"},
                  {val:3, lbl:"3 ou mais"},
                  {val:4, lbl:"4 ou mais"},
                  {val:5, lbl:"Apenas 5 estrelas"},
                ].map(r => (
                  <label key={r.val} className="r-opt">
                    <input type="radio" name="rating" checked={minRating===r.val} onChange={() => setMinRating(r.val)}/>
                    {r.val > 0 && (
                      <span className="r-opt-stars">{[1,2,3,4,5].map(i => <i key={i} className={`ti ti-star${i<=r.val?"-filled":""}`} style={{color:i<=r.val?"#f59e0b":"#d1d5db",fontSize:"13px"}} aria-hidden="true"></i>)}</span>
                    )}
                    <span className="r-opt-lbl">{r.lbl}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className="fp-lbl"><i className="ti ti-toggle-right" aria-hidden="true"></i> Filtros rÃ¡pidos</div>
              <div className="toggle-row">
                <span className="toggle-lbl"><i className="ti ti-shield-check" aria-hidden="true"></i> Apenas verificados</span>
                <button className={`toggle ${onlyVerified?"on":""}`} onClick={() => setOnlyVerified(v=>!v)} aria-label="Apenas verificados"/>
              </div>
              <div className="toggle-row">
                <span className="toggle-lbl"><i className="ti ti-crown" aria-hidden="true"></i> Apenas Pro</span>
                <button className={`toggle ${onlyPro?"on":""}`} onClick={() => setOnlyPro(v=>!v)} aria-label="Apenas Pro"/>
              </div>
            </div>
            <div>
              <div className="fp-lbl"><i className="ti ti-trash" aria-hidden="true"></i> AcÃ§Ãµes</div>
              <button className="clear-fp" onClick={clearAll}>
                <i className="ti ti-x" aria-hidden="true"></i>
                Limpar todos os filtros
              </button>
            </div>
          </div>
        )}

        {activeFilters > 0 && (
          <div className="af-row">
            {category!=="Todos" && <button className="af-tag" onClick={() => setCategory("Todos")}>{category} <i className="ti ti-x" aria-hidden="true"></i></button>}
            {minRating>0 && <button className="af-tag" onClick={() => setMinRating(0)}>{minRating}+ estrelas <i className="ti ti-x" aria-hidden="true"></i></button>}
            {onlyVerified && <button className="af-tag" onClick={() => setOnlyVerified(false)}><i className="ti ti-shield-check" aria-hidden="true"></i> Verificados <i className="ti ti-x" aria-hidden="true"></i></button>}
            {onlyPro && <button className="af-tag" onClick={() => setOnlyPro(false)}><i className="ti ti-crown" aria-hidden="true"></i> Pro <i className="ti ti-x" aria-hidden="true"></i></button>}
            <button className="clear-all" onClick={clearAll}>Limpar tudo</button>
          </div>
        )}

        {loading ? (
          <div className="skel-grid">{[1,2,3,4,5,6].map(i => <div key={i} className="skel"/>)}</div>
        ) : (
          <div className="grid fade">
            {filtered.length === 0 ? (
              <div className="empty">
                <i className="ti ti-search-off" aria-hidden="true"></i>
                <p>Nenhum freelancer encontrado com estes filtros.</p>
                <button className="btn-clear" onClick={clearAll}><i className="ti ti-refresh" aria-hidden="true"></i> Limpar filtros</button>
              </div>
            ) : filtered.map((f,i) => {
              const skills = parseSkills(f.skills);
              const rating = Number(f.rating || 0);
              return (
                <div key={f.id} className="card" onClick={() => router.push(`/freelancer/${f.id}`)}>
                  {f.plan === "pro" && <div className="pro-bar" aria-hidden="true"/>}
                  <div className="card-top">
                    <div className="av">{f.avatar ? <img src={f.avatar} alt={f.name}/> : f.name?.[0]}</div>
                    <div className="card-inf">
                      <div className="card-name">
                        {f.name}
                        {f.verified && <span className="bdg-ver"><i className="ti ti-shield-check" aria-hidden="true"></i> Verificado</span>}
                        {f.plan==="pro" && <span className="bdg-pro"><i className="ti ti-crown" aria-hidden="true"></i> Pro</span>}
                      </div>
                      {f.location && <div className="card-loc"><i className="ti ti-map-pin" aria-hidden="true"></i>{f.location}</div>}
                      {rating > 0 && (
                        <div className="card-rating">
                          <i className="ti ti-star-filled" aria-hidden="true"></i>
                          {rating.toFixed(1)}
                          <span>({f.review_count||0} avaliaÃ§Ãµes)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="card-bio">{f.bio || "Freelancer profissional em MoÃ§ambique."}</p>
                  <div className="skills">
                    {skills.slice(0,3).map((s:string,j:number) => <span key={j} className="skill">{s}</span>)}
                    {skills.length>3 && <span className="skill-more">+{skills.length-3}</span>}
                  </div>
                  <div className="card-footer">
                    <button className="btn-profile" onClick={e => { e.stopPropagation(); router.push(`/freelancer/${f.id}`); }}>
                      <i className="ti ti-user" aria-hidden="true"></i> Ver perfil
                    </button>
                    <button className="btn-msg" title="Enviar mensagem" aria-label="Enviar mensagem" onClick={e => { e.stopPropagation(); router.push(`/messages?to=${f.id}`); }}>
                      <i className="ti ti-message-circle" aria-hidden="true"></i>
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