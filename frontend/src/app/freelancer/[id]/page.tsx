"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ReviewModal from "../../../components/ReviewModal";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function FreelancerProfile() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [freelancer, setFreelancer] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("sobre");
  const [user, setUser] = useState<any>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [pfTitle, setPfTitle] = useState("");
  const [pfDescription, setPfDescription] = useState("");
  const [pfImageUrl, setPfImageUrl] = useState("");
  const [pfProjectUrl, setPfProjectUrl] = useState("");
  const [pfSubmitting, setPfSubmitting] = useState(false);
  const [pfError, setPfError] = useState("");

  const isOwnProfile = user && freelancer && String(user.id) === String(freelancer.id);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    loadData();
  }, [id]);

  
  useEffect(() => {
    if (user?.role === "client" && freelancer?.id) {
      checkCanReview();
    }
  }, [user, freelancer]);

  useEffect(() => {
    if (id) fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${API_URL}/portfolio/user/${id}`);
      const data = await res.json();
      setPortfolio(Array.isArray(data) ? data : []);
    } catch {}
  };

  const handleAddPortfolio = async () => {
    if (!pfTitle.trim() || !pfImageUrl.trim()) {
      setPfError("Titulo e link da imagem sao obrigatorios.");
      return;
    }
    setPfSubmitting(true);
    setPfError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: pfTitle, description: pfDescription, image_url: pfImageUrl, project_url: pfProjectUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPfTitle(""); setPfDescription(""); setPfImageUrl(""); setPfProjectUrl("");
      setShowAddPortfolio(false);
      fetchPortfolio();
    } catch (err: any) {
      setPfError(err.message || "Erro ao adicionar item.");
    } finally {
      setPfSubmitting(false);
    }
  };

  const handleDeletePortfolio = async (itemId: number) => {
    if (!confirm("Remover este item do portfolio?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/portfolio/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio((prev) => prev.filter((p) => p.id !== itemId));
    } catch {}
  };

  const checkCanReview = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/contracts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const hasClosed = data.some((c: any) => c.freelancer_id === freelancer.id && c.status === "closed" && !c.reviewed);
      setCanReview(hasClosed);
    } catch {}
  };

const loadData = async () => {
    try {
      const [fRes, rRes] = await Promise.all([
        fetch(`${API_URL}/users/${id}`),
        fetch(`${API_URL}/reviews/user/${id}`),
      ]);
      const fData = await fRes.json();
      const rData = await rRes.json();
      setFreelancer(fData);
      setReviews(Array.isArray(rData) ? rData : []);
    } catch {}
    setLoading(false);
  };

  const parseSkills = (s: any) => {
    if (Array.isArray(s)) return s;
    try { return JSON.parse(s); } catch { return []; }
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((a, r) => a + Number(r.rating || 0), 0) / reviews.length
    : Number(freelancer?.rating || 0);

  const ratingDist = [5,4,3,2,1].map(n => ({
    star: n,
    count: reviews.filter(r => Math.round(Number(r.rating)) === n).length,
    pct: reviews.length > 0 ? (reviews.filter(r => Math.round(Number(r.rating)) === n).length / reviews.length) * 100 : 0,
  }));

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#f4f5f7",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{textAlign:"center"}}>
        <i className="ti ti-loader" style={{fontSize:"32px",color:"#6366f1",animation:"spin 1s linear infinite"}} aria-hidden="true"></i>
        <p style={{marginTop:"12px",color:"#6b7280",fontSize:"14px"}}>A carregar perfil...</p>
      </div>
    </div>
  );

  if (!freelancer || freelancer.role !== "freelancer") return (
    <div style={{minHeight:"100vh",background:"#f4f5f7",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <i className="ti ti-user-off" style={{fontSize:"48px",color:"#d1d5db",display:"block",marginBottom:"16px"}} aria-hidden="true"></i>
        <p style={{color:"#6b7280",marginBottom:"16px"}}>Freelancer não encontrado.</p>
        <button onClick={() => router.push("/freelancers")} style={{background:"#6366f1",color:"#fff",padding:"10px 20px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"14px",fontWeight:"600"}}>Ver freelancers</button>
      </div>
    </div>
  );

  const skills = parseSkills(freelancer.skills);
  const isPro = freelancer.plan === "pro";
  const isVerified = freelancer.verified;

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Inter,-apple-system,sans-serif;background:#f4f5f7;color:#111827}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade{animation:fadeIn .3s ease}

        .hero{background:#111827;position:relative;overflow:hidden;padding:0}
        .hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(99,102,241,.18) 0%,transparent 65%)}
        .hero-inner{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:40px 24px 0}
        .breadcrumb{display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,.4);margin-bottom:32px}
        .breadcrumb a{color:rgba(255,255,255,.4);text-decoration:none;transition:color .15s;display:flex;align-items:center;gap:5px}
        .breadcrumb a:hover{color:rgba(255,255,255,.8)}
        .breadcrumb i{font-size:14px}
        .hero-content{display:grid;grid-template-columns:auto 1fr auto;gap:28px;align-items:flex-start;padding-bottom:0}
        .av-wrap{position:relative;flex-shrink:0}
        .av{width:110px;height:110px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:40px;font-weight:800;border:3px solid rgba(255,255,255,.15);overflow:hidden}
        .av img{width:100%;height:100%;object-fit:cover}
        .av-pro{position:absolute;bottom:4px;right:4px;width:26px;height:26px;background:#f59e0b;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #111827}
        .av-pro i{font-size:13px;color:#fff}
        .hero-info{min-width:0}
        .name-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px}
        .name{font-size:28px;font-weight:800;color:#fff;letter-spacing:-.5px;line-height:1.1}
        .bdg-ver{display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,.2);color:#6ee7b7;border:1px solid rgba(16,185,129,.3);padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700}
        .bdg-ver i{font-size:12px}
        .bdg-pro{display:inline-flex;align-items:center;gap:4px;background:rgba(245,158,11,.2);color:#fcd34d;border:1px solid rgba(245,158,11,.3);padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700}
        .bdg-pro i{font-size:12px}
        .hero-sub{font-size:15px;color:rgba(255,255,255,.55);margin-bottom:12px;display:flex;align-items:center;gap:6px}
        .hero-sub i{font-size:16px;color:rgba(255,255,255,.35)}
        .hero-rating{display:flex;align-items:center;gap:8px;margin-bottom:16px}
        .stars{display:flex;gap:2px}
        .stars i{font-size:16px;color:#f59e0b}
        .stars i.empty{color:rgba(255,255,255,.2)}
        .rating-val{font-size:16px;font-weight:700;color:#fff}
        .rating-count{font-size:13px;color:rgba(255,255,255,.45)}
        .hero-skills{display:flex;flex-wrap:wrap;gap:6px}
        .hero-skill{padding:4px 10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.7);border-radius:20px;font-size:12px;font-weight:500}
        .hero-actions{display:flex;flex-direction:column;gap:8px;flex-shrink:0;padding-top:4px}
        .btn-contact{display:flex;align-items:center;gap:7px;padding:11px 20px;background:#10b981;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:opacity .15s}
        .btn-contact:hover{opacity:.88}
        .btn-contact i{font-size:17px}
        .btn-hire{display:flex;align-items:center;gap:7px;padding:11px 20px;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .15s}
        .btn-hire:hover{background:rgba(255,255,255,.18)}
        .btn-hire i{font-size:17px}
        .hero-stats{max-width:1100px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(255,255,255,.06);margin-top:28px}
        .h-stat{padding:18px 0;text-align:center;position:relative}
        .h-stat::after{content:"";position:absolute;right:0;top:25%;height:50%;width:1px;background:rgba(255,255,255,.06)}
        .h-stat:last-child::after{display:none}
        .h-stat-val{font-size:22px;font-weight:800;color:#fff;line-height:1}
        .h-stat-lbl{font-size:11px;color:rgba(255,255,255,.4);margin-top:4px;display:flex;align-items:center;justify-content:center;gap:4px}
        .h-stat-lbl i{font-size:13px}

        .body-wrap{max-width:1100px;margin:0 auto;padding:28px 24px;display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start}
        .tabs{display:flex;gap:0;background:#fff;border:1.5px solid #e8eaed;border-radius:12px;padding:5px;margin-bottom:20px}
        .tab{flex:1;padding:9px 16px;border-radius:8px;font-size:13px;font-weight:600;color:#9ca3af;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:6px;border:none;background:none;font-family:inherit}
        .tab i{font-size:16px}
        .tab:hover{color:#374151}
        .tab.active{background:#6366f1;color:#fff}
        .tab.active i{color:#fff}
        .card{background:#fff;border:1.5px solid #e8eaed;border-radius:14px;padding:24px;margin-bottom:16px}
        .card-title{font-size:13px;font-weight:700;color:#374151;margin-bottom:16px;display:flex;align-items:center;gap:7px;text-transform:uppercase;letter-spacing:.5px}
        .card-title i{font-size:16px;color:#9ca3af}
        .bio{font-size:14px;color:#374151;line-height:1.8}
        .skills-wrap{display:flex;flex-wrap:wrap;gap:8px}
        .skill{display:flex;align-items:center;gap:5px;padding:6px 12px;background:#eef2ff;color:#4f46e5;border-radius:20px;font-size:12px;font-weight:600;border:1px solid #c7d2fe}
        .skill i{font-size:13px}

        .reviews-header{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #f0f1f3}
        .big-rating{text-align:center}
        .big-num{font-size:56px;font-weight:800;color:#111827;line-height:1}
        .big-stars{display:flex;gap:3px;justify-content:center;margin:6px 0}
        .big-stars i{font-size:20px;color:#f59e0b}
        .big-stars i.empty{color:#e5e7eb}
        .big-count{font-size:12px;color:#9ca3af}
        .dist-bars{flex:1}
        .dist-row{display:flex;align-items:center;gap:10px;margin-bottom:6px}
        .dist-lbl{font-size:12px;color:#6b7280;width:48px;display:flex;align-items:center;gap:3px;flex-shrink:0}
        .dist-lbl i{font-size:13px;color:#f59e0b}
        .dist-track{flex:1;height:7px;background:#f3f4f6;border-radius:4px;overflow:hidden}
        .dist-fill{height:100%;background:#f59e0b;border-radius:4px;transition:width .5s ease}
        .dist-cnt{font-size:12px;color:#9ca3af;width:20px;text-align:right;flex-shrink:0}

        .review-list{display:flex;flex-direction:column;gap:16px}
        .review-card{padding:18px;background:#f8f9fc;border:1.5px solid #e8eaed;border-radius:12px}
        .rev-top{display:flex;align-items:center;gap:12px;margin-bottom:10px}
        .rev-av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;font-weight:700;flex-shrink:0}
        .rev-name{font-size:14px;font-weight:700;color:#111827}
        .rev-date{font-size:12px;color:#9ca3af;display:flex;align-items:center;gap:4px;margin-top:2px}
        .rev-date i{font-size:13px}
        .rev-stars{display:flex;gap:2px;margin-left:auto}
        .rev-stars i{font-size:14px;color:#f59e0b}
        .rev-stars i.empty{color:#e5e7eb}
        .rev-text{font-size:13px;color:#6b7280;line-height:1.65}
        .empty-reviews{text-align:center;padding:40px;color:#9ca3af}
        .empty-reviews i{font-size:40px;display:block;margin-bottom:12px}

        .side-card{background:#fff;border:1.5px solid #e8eaed;border-radius:14px;padding:20px;margin-bottom:16px}
        .side-title{font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.6px;margin-bottom:14px;display:flex;align-items:center;gap:6px}
        .side-title i{font-size:14px}
        .info-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:13px}
        .info-row:last-child{border:none}
        .info-lbl{color:#9ca3af;display:flex;align-items:center;gap:5px}
        .info-lbl i{font-size:14px}
        .info-val{font-weight:600;color:#111827;display:flex;align-items:center;gap:4px}
        .info-val i{font-size:14px;color:#10b981}
        .btn-full{width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .15s;border:none;margin-bottom:8px}
        .btn-full i{font-size:17px}
        .btn-full.green{background:#10b981;color:#fff}
        .btn-full.green:hover{background:#059669}
        .btn-full.outline{background:#fff;color:#374151;border:1.5px solid #e8eaed}
        .btn-full.outline:hover{border-color:#6366f1;color:#6366f1}
        .pro-badge-card{background:linear-gradient(135deg,#1e1b4b,#312e81);border:1px solid rgba(139,92,246,.3);border-radius:14px;padding:20px;margin-bottom:16px;color:#fff}
        .pro-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}
        .pro-top i{font-size:24px;color:#fcd34d}
        .pro-name{font-size:16px;font-weight:800}
        .pro-sub{font-size:12px;opacity:.6;margin-top:2px}
        .pro-perks{display:flex;flex-direction:column;gap:6px}
        .perk{font-size:12px;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:7px}
        .perk i{font-size:14px;color:#a5b4fc}

        @media(max-width:900px){
          .hero-content{grid-template-columns:auto 1fr;}.hero-actions{display:none}
          .body-wrap{grid-template-columns:1fr}.hero-stats{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:600px){
          .hero-content{grid-template-columns:1fr}.av{width:80px;height:80px;font-size:28px}
          .name{font-size:22px}.hero-stats{grid-template-columns:repeat(2,1fr)}.tabs{flex-wrap:wrap}
        }
      `}</style>

      <div className="hero">
        <div className="hero-bg" aria-hidden="true"/>
        <div className="hero-inner">
          <div className="breadcrumb">
            <a href="/freelancers"><i className="ti ti-arrow-left" aria-hidden="true"></i> Freelancers</a>
            <i className="ti ti-chevron-right" aria-hidden="true"></i>
            <span>{freelancer.name}</span>
          </div>

          <div className="hero-content">
            <div className="av-wrap">
              <div className="av">
                {freelancer.avatar ? <img src={freelancer.avatar} alt={freelancer.name}/> : freelancer.name?.[0]}
              </div>
              {isPro && (
                <div className="av-pro" title="Freelancer Pro">
                  <i className="ti ti-crown" aria-hidden="true"></i>
                </div>
              )}
            </div>

            <div className="hero-info">
              <div className="name-row">
                <h1 className="name">{freelancer.name}</h1>
                {isVerified && <span className="bdg-ver"><i className="ti ti-shield-check" aria-hidden="true"></i> Verificado</span>}
                {isPro && <span className="bdg-pro"><i className="ti ti-crown" aria-hidden="true"></i> Pro</span>}
              </div>
              <div className="hero-sub">
                <i className="ti ti-map-pin" aria-hidden="true"></i>
                {freelancer.location || "Moçambique"}
              </div>
              {avgRating > 0 && (
                <div className="hero-rating">
                  <div className="stars">
                    {[1,2,3,4,5].map(n => (
                      <i key={n} className={`ti ti-star${n <= Math.round(avgRating) ? "-filled" : ""} ${n > Math.round(avgRating) ? "empty" : ""}`} aria-hidden="true"></i>
                    ))}
                  </div>
                  <span className="rating-val">{avgRating.toFixed(1)}</span>
                  <span className="rating-count">({reviews.length} avaliação{reviews.length !== 1 ? "ões" : ""})</span>
                </div>
              )}
              {skills.length > 0 && (
                <div className="hero-skills">
                  {skills.slice(0,6).map((s:string,i:number) => (
                    <span key={i} className="hero-skill">{s}</span>
                  ))}
                  {skills.length > 6 && <span className="hero-skill">+{skills.length-6}</span>}
                </div>
              )}
            </div>

            <div className="hero-actions">
              <button className="btn-contact" onClick={() => router.push(`/messages?to=${freelancer.id}`)}>
                <i className="ti ti-message-circle" aria-hidden="true"></i>
                Enviar mensagem
              </button>
                            {user?.role === "client" && canReview && (
                <button className="btn-hire" onClick={() => setReviewModalOpen(true)} style={{ background: "rgba(245,158,11,.2)", borderColor: "rgba(245,158,11,.3)", color: "#fcd34d" }}>
                  <i className="ti ti-star" aria-hidden="true"></i>
                  Avaliar
                </button>
              )}
              <button className="btn-hire" onClick={() => router.push("/projects/new")}>
                <i className="ti ti-briefcase" aria-hidden="true"></i>
                Publicar projecto
              </button>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          {[
            {val: reviews.length,          lbl:"Avaliações",  icon:"ti-star"},
            {val: avgRating > 0 ? avgRating.toFixed(1) : "—", lbl:"Rating médio", icon:"ti-chart-bar"},
            {val: freelancer.projects_done || 0, lbl:"Projectos",  icon:"ti-circle-check"},
            {val: isPro ? "Pro" : "Free",  lbl:"Plano",       icon:"ti-crown"},
          ].map((s,i) => (
            <div key={i} className="h-stat">
              <div className="h-stat-val">{s.val}</div>
              <div className="h-stat-lbl"><i className={`ti ${s.icon}`} aria-hidden="true"></i>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="body-wrap fade">
        <div>
          <div className="tabs">
            {[
              {id:"sobre",      label:"Sobre",       icon:"ti-user"},
              {id:"portfolio",  label:`Portfólio (${portfolio.length})`, icon:"ti-briefcase"},
              {id:"reviews",    label:`Avaliações (${reviews.length})`, icon:"ti-star"},
            ].map(t => (
              <button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>
                <i className={`ti ${t.icon}`} aria-hidden="true"></i>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "sobre" && (
            <div className="fade">
              {freelancer.bio && (
                <div className="card">
                  <div className="card-title"><i className="ti ti-user-circle" aria-hidden="true"></i> Sobre mim</div>
                  <p className="bio">{freelancer.bio}</p>
                </div>
              )}
              {skills.length > 0 && (
                <div className="card">
                  <div className="card-title"><i className="ti ti-tools" aria-hidden="true"></i> Skills & competências</div>
                  <div className="skills-wrap">
                    {skills.map((s:string,i:number) => (
                      <span key={i} className="skill"><i className="ti ti-code" aria-hidden="true"></i>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {!freelancer.bio && skills.length === 0 && (
                <div className="card" style={{textAlign:"center",padding:"48px",color:"#9ca3af"}}>
                  <i className="ti ti-user-off" style={{fontSize:"40px",display:"block",marginBottom:"12px"}} aria-hidden="true"></i>
                  <p>Este freelancer ainda não preencheu o perfil.</p>
                </div>
              )}
            </div>
          )}

          {tab === "portfolio" && (
            <div className="fade">
              {isOwnProfile && (
                <div className="card">
                  {!showAddPortfolio ? (
                    <button
                      onClick={() => setShowAddPortfolio(true)}
                      style={{background:"#6366f1",color:"#fff",padding:"10px 18px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"13.5px",fontWeight:600,display:"flex",alignItems:"center",gap:"6px"}}
                    >
                      <i className="ti ti-plus" aria-hidden="true"></i> Adicionar item ao portfólio
                    </button>
                  ) : (
                    <div>
                      <div className="card-title"><i className="ti ti-briefcase" aria-hidden="true"></i> Novo item</div>
                      <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                        <input placeholder="Titulo do projecto" value={pfTitle} onChange={e=>setPfTitle(e.target.value)} style={{padding:"10px 12px",border:"1.5px solid #e8eaed",borderRadius:"8px",fontSize:"14px",outline:"none"}} />
                        <textarea placeholder="Descricao (opcional)" value={pfDescription} onChange={e=>setPfDescription(e.target.value)} rows={3} style={{padding:"10px 12px",border:"1.5px solid #e8eaed",borderRadius:"8px",fontSize:"14px",outline:"none",resize:"vertical",fontFamily:"inherit"}} />
                        <input placeholder="Link da imagem (https://...)" value={pfImageUrl} onChange={e=>setPfImageUrl(e.target.value)} style={{padding:"10px 12px",border:"1.5px solid #e8eaed",borderRadius:"8px",fontSize:"14px",outline:"none"}} />
                        <input placeholder="Link do projecto (opcional)" value={pfProjectUrl} onChange={e=>setPfProjectUrl(e.target.value)} style={{padding:"10px 12px",border:"1.5px solid #e8eaed",borderRadius:"8px",fontSize:"14px",outline:"none"}} />
                        {pfError && <p style={{color:"#dc2626",fontSize:"13px"}}>{pfError}</p>}
                        <div style={{display:"flex",gap:"10px"}}>
                          <button onClick={handleAddPortfolio} disabled={pfSubmitting} style={{background:"#6366f1",color:"#fff",padding:"10px 18px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"13.5px",fontWeight:600}}>
                            {pfSubmitting ? "A guardar..." : "Guardar"}
                          </button>
                          <button onClick={() => { setShowAddPortfolio(false); setPfError(""); }} style={{background:"#f3f4f6",color:"#374151",padding:"10px 18px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"13.5px",fontWeight:600}}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {portfolio.length === 0 ? (
                <div className="card" style={{textAlign:"center",padding:"48px",color:"#9ca3af"}}>
                  <i className="ti ti-briefcase" style={{fontSize:"40px",display:"block",marginBottom:"12px"}} aria-hidden="true"></i>
                  <p>{isOwnProfile ? "Ainda nao adicionaste nada ao teu portfolio." : "Este freelancer ainda nao tem itens no portfolio."}</p>
                </div>
              ) : (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",gap:"16px"}}>
                  {portfolio.map((item) => (
                    <div key={item.id} className="card" style={{padding:0,overflow:"hidden",position:"relative"}}>
                      {isOwnProfile && (
                        <button
                          onClick={() => handleDeletePortfolio(item.id)}
                          style={{position:"absolute",top:"10px",right:"10px",width:"30px",height:"30px",borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}
                          title="Remover"
                        >
                          <i className="ti ti-trash" style={{fontSize:"15px"}} aria-hidden="true"></i>
                        </button>
                      )}
                      <a href={item.project_url || undefined} target={item.project_url ? "_blank" : undefined} rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit",display:"block"}}>
                        <img src={item.image_url} alt={item.title} style={{width:"100%",height:"150px",objectFit:"cover",display:"block"}} />
                        <div style={{padding:"14px"}}>
                          <h4 style={{fontSize:"14px",fontWeight:700,color:"#111827",marginBottom:"4px"}}>{item.title}</h4>
                          {item.description && <p style={{fontSize:"12.5px",color:"#6b7280",lineHeight:1.5}}>{item.description}</p>}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "reviews" && (
            <div className="fade">
              <div className="card">
                {reviews.length > 0 ? (
                  <>
                    <div className="reviews-header">
                      <div className="big-rating">
                        <div className="big-num">{avgRating.toFixed(1)}</div>
                        <div className="big-stars">
                          {[1,2,3,4,5].map(n => (
                            <i key={n} className={`ti ti-star${n <= Math.round(avgRating) ? "-filled" : ""} ${n > Math.round(avgRating) ? "empty" : ""}`} aria-hidden="true"></i>
                          ))}
                        </div>
                        <div className="big-count">{reviews.length} avaliação{reviews.length!==1?"ões":""}</div>
                      </div>
                      <div className="dist-bars">
                        {ratingDist.map(d => (
                          <div key={d.star} className="dist-row">
                            <div className="dist-lbl">
                              <i className="ti ti-star-filled" aria-hidden="true"></i>
                              {d.star}
                            </div>
                            <div className="dist-track">
                              <div className="dist-fill" style={{width:`${d.pct}%`}}/>
                            </div>
                            <div className="dist-cnt">{d.count}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="review-list">
                      {reviews.map((r,i) => {
                        const rating = Number(r.rating || 0);
                        return (
                          <div key={i} className="review-card">
                            <div className="rev-top">
                              <div className="rev-av">{r.client_name?.[0] || "C"}</div>
                              <div style={{flex:1}}>
                                <div className="rev-name">{r.client_name || "Cliente"}</div>
                                <div className="rev-date">
                                  <i className="ti ti-calendar" aria-hidden="true"></i>
                                  {new Date(r.created_at).toLocaleDateString("pt-PT")}
                                </div>
                              </div>
                              <div className="rev-stars">
                                {[1,2,3,4,5].map(n => (
                                  <i key={n} className={`ti ti-star${n <= Math.round(rating) ? "-filled" : ""} ${n > Math.round(rating) ? "empty" : ""}`} aria-hidden="true"></i>
                                ))}
                              </div>
                            </div>
                            {r.comment && <p className="rev-text">{r.comment}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="empty-reviews">
                    <i className="ti ti-star-off" aria-hidden="true"></i>
                    <p style={{fontSize:"15px",color:"#374151",marginBottom:"6px",fontWeight:"600"}}>Ainda sem avaliações</p>
                    <p style={{fontSize:"13px"}}>As avaliações aparecem aqui após a conclusão de projectos.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          {isPro && (
            <div className="pro-badge-card">
              <div className="pro-top">
                <i className="ti ti-crown" aria-hidden="true"></i>
                <div>
                  <div className="pro-name">Freelancer Pro</div>
                  <div className="pro-sub">Membro verificado da plataforma</div>
                </div>
              </div>
              <div className="pro-perks">
                {[
                  {icon:"ti-shield-check", txt:"Identidade verificada"},
                  {icon:"ti-star",         txt:"Prioridade nos resultados"},
                  {icon:"ti-headset",      txt:"Suporte prioritário"},
                  {icon:"ti-badge",        txt:"Selo Pro destacado"},
                ].map((p,i) => (
                  <div key={i} className="perk">
                    <i className={`ti ${p.icon}`} aria-hidden="true"></i>
                    {p.txt}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="side-card">
            <div className="side-title"><i className="ti ti-info-circle" aria-hidden="true"></i> Informações</div>
            {[
              {lbl:"Localização", val:freelancer.location || "Moçambique",         icon_l:"ti-map-pin",      icon_v:""},
              {lbl:"Membro desde",val:new Date(freelancer.created_at).toLocaleDateString("pt-PT"), icon_l:"ti-calendar", icon_v:""},
              {lbl:"Avaliação",   val:avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : "Sem avaliações", icon_l:"ti-star", icon_v:"ti-star"},
              {lbl:"Projectos",   val:`${freelancer.projects_done || 0} concluído${(freelancer.projects_done||0)!==1?"s":""}`, icon_l:"ti-briefcase", icon_v:""},
            ].map((r,i) => (
              <div key={i} className="info-row">
                <span className="info-lbl"><i className={`ti ${r.icon_l}`} aria-hidden="true"></i>{r.lbl}</span>
                <span className="info-val">
                  {r.icon_v && <i className={`ti ${r.icon_v}`} aria-hidden="true"></i>}
                  {r.val}
                </span>
              </div>
            ))}
          </div>

          <div className="side-card">
            <div className="side-title"><i className="ti ti-bolt" aria-hidden="true"></i> Acções</div>
            <button className="btn-full green" onClick={() => router.push(`/messages?to=${freelancer.id}`)}>
              <i className="ti ti-message-circle" aria-hidden="true"></i>
              Enviar mensagem
            </button>
            <button className="btn-full outline" onClick={() => router.push("/projects/new")}>
              <i className="ti ti-briefcase" aria-hidden="true"></i>
              Publicar projecto
            </button>
          </div>
        </div>
      </div>
    </>
  );
}