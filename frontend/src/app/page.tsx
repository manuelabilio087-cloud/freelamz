"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Logo = () => (
  <svg width="140" height="36" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="homeLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D97A"/>
        <stop offset="100%" stopColor="#1FAE5C"/>
      </linearGradient>
    </defs>
    <circle cx="25" cy="25" r="23" fill="url(#homeLogoGrad)"/>
    <path d="M 15 14 L 15 36 M 15 14 L 33 14 M 15 24 L 29 24"
          stroke="#08160E" strokeWidth="4.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="35" cy="14" r="2.6" fill="#08160E"/>
    <text x="60" y="34" fontFamily="Inter, Arial, sans-serif" fontSize="22" fontWeight="700" fill="#1a1a1a" letterSpacing="-0.5">freel<tspan fill="#1FAE5C">amz</tspan></text>
  </svg>
);

const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const CodeIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const DesignIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
const MarketIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const WriteIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const VideoIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
const AIIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg>;
const MusicIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
const BizIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const GlobeIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const BoltIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const StarIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ShieldIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const FbIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const IgIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const LiIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const XIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25z"/></svg>;
const MenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const CloseIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = () => {
    if (search.trim()) router.push(`/search/gigs?search=${encodeURIComponent(search)}`);
  };

  const categories = [
    { icon: <CodeIcon/>, name: "Programacao", color: "#eef2ff", stroke: "#6366f1" },
    { icon: <DesignIcon/>, name: "Design Grafico", color: "#f5f3ff", stroke: "#8b5cf6" },
    { icon: <MarketIcon/>, name: "Marketing Digital", color: "#fffbeb", stroke: "#f59e0b" },
    { icon: <WriteIcon/>, name: "Redacao", color: "#ecfdf5", stroke: "#10b981" },
    { icon: <VideoIcon/>, name: "Video", color: "#fef2f2", stroke: "#ef4444" },
    { icon: <AIIcon/>, name: "Servicos de IA", color: "#f0f9ff", stroke: "#0ea5e9" },
    { icon: <MusicIcon/>, name: "Musica e Audio", color: "#fff7ed", stroke: "#f97316" },
    { icon: <BizIcon/>, name: "Negocios", color: "#f8fafc", stroke: "#475569" },
  ];

  const features = [
    { icon: <GlobeIcon/>, title: "Talentos de Mocambique", text: "Acesso a profissionais qualificados em todo o pais, prontos para o teu projecto." },
    { icon: <BoltIcon/>, title: "Contratacao rapida", text: "Publica um projecto, recebe propostas e contrata em minutos. Simples e seguro." },
    { icon: <StarIcon/>, title: "Qualidade garantida", text: "Freelancers avaliados pela comunidade. So os melhores chegam ao topo." },
    { icon: <ShieldIcon/>, title: "Pagamento seguro", text: "Paga via M-Pesa com protecao total. So liberas o pagamento quando estiveres satisfeito." },
  ];

  return (
    <>
      <style>{`
        :root { --green: #1dbf73; --text: #404145; --text-light: #74767e; --border: #e4e5e7; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #ffffff !important; color: #404145 !important; }
        body { font-family: Inter, sans-serif; line-height: 1.5; }
        a { text-decoration: none; color: inherit; }
        .header { position: sticky; top: 0; z-index: 100; background: #ffffff; border-bottom: 1px solid var(--border); }
        .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 14px 32px; gap: 24px; }
        .nav-links { display: flex; align-items: center; gap: 24px; font-size: 14px; font-weight: 500; color: var(--text); }
        .nav-links a:hover { color: var(--green); }
        .btn-join { border: 1.5px solid #000; padding: 8px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; background: #fff; font-size: 14px; transition: all 0.2s; }
        .btn-join:hover { background: #000; color: #fff; }
        .btn-register { background: #6366f1; color: #fff; padding: 8px 20px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; transition: opacity 0.2s; }
        .btn-register:hover { opacity: 0.9; }
        .sub-nav { border-bottom: 1px solid var(--border); background: #fff; overflow-x: auto; scrollbar-width: none; }
        .sub-nav::-webkit-scrollbar { display: none; }
        .sub-nav-inner { max-width: 1400px; margin: 0 auto; padding: 0 32px; display: flex; gap: 28px; align-items: center; height: 44px; white-space: nowrap; font-size: 13px; color: var(--text-light); }
        .sub-nav-inner span { cursor: pointer; transition: color 0.15s; }
        .sub-nav-inner span:hover { color: var(--green); }
        .hero { position: relative; min-height: 560px; display: flex; align-items: center; background: linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.58)), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&auto=format&fit=crop') center/cover no-repeat; color: #fff; padding: 60px 32px; }
        .hero-inner { max-width: 1400px; margin: 0 auto; width: 100%; }
        .hero h1 { font-size: clamp(32px, 5vw, 58px); font-weight: 600; line-height: 1.12; max-width: 620px; margin-bottom: 32px; }
        .hero-search { max-width: 600px; background: #fff; border-radius: 8px; display: flex; align-items: center; padding: 4px; margin-bottom: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.2); }
        .hero-search input { flex: 1; border: none; outline: none; padding: 12px 16px; font-size: 16px; color: var(--text); background: transparent; min-width: 0; }
        .hero-search button { background: #000; color: #fff; width: 52px; height: 52px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; flex-shrink: 0; transition: background 0.2s; }
        .hero-search button:hover { background: var(--green); }
        .hero-tags { display: flex; gap: 10px; flex-wrap: wrap; }
        .hero-tag { border: 1px solid rgba(255,255,255,0.55); padding: 7px 16px; border-radius: 20px; font-size: 13px; color: #fff; cursor: pointer; transition: background 0.2s; }
        .hero-tag:hover { background: rgba(255,255,255,0.15); }
        .trusted { background: #000; color: #fff; padding: 22px 32px; }
        .trusted-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
        .trusted-label { font-size: 13px; opacity: 0.7; white-space: nowrap; }
        .trusted-logos { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; }
        .trusted-logos span { font-size: 14px; font-weight: 600; opacity: 0.85; letter-spacing: 0.5px; }
        .section { padding: 56px 32px; max-width: 1400px; margin: 0 auto; }
        .section-title { font-size: clamp(22px, 3vw, 32px); font-weight: 600; margin-bottom: 32px; color: var(--text); }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 14px; }
        .cat-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 24px 16px; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 12px; font-size: 13px; font-weight: 500; transition: all 0.2s; color: var(--text); }
        .cat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-2px); border-color: var(--green); }
        .cat-icon-wrap { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .features-section { padding: 56px 32px; background: #f8f9fc; }
        .features-inner { max-width: 1400px; margin: 0 auto; }
        .features-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; flex-wrap: wrap; gap: 16px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px; }
        .feature-item { display: flex; flex-direction: column; gap: 16px; }
        .feature-item h3 { font-size: 16px; font-weight: 600; color: var(--text); }
        .feature-item p { color: var(--text-light); font-size: 14px; line-height: 1.7; }
        .btn-dark { background: #000; color: #fff; padding: 11px 24px; border-radius: 8px; font-weight: 500; border: none; cursor: pointer; font-size: 14px; transition: background 0.2s; }
        .btn-dark:hover { background: var(--green); }
        .pro-section { background: #003912; color: #fff; padding: 64px 32px; margin: 0 32px 32px; border-radius: 16px; }
        .pro-label { font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; opacity: 0.7; margin-bottom: 12px; }
        .pro-title { font-size: clamp(24px, 4vw, 42px); font-weight: 600; max-width: 560px; line-height: 1.2; }
        .guides-section { padding: 56px 32px; max-width: 1400px; margin: 0 auto; }
        .guides-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .guides-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .guide-card { cursor: pointer; }
        .guide-img { aspect-ratio: 16/10; border-radius: 10px; overflow: hidden; margin-bottom: 12px; }
        .guide-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .guide-card:hover .guide-img img { transform: scale(1.05); }
        .guide-card h3 { font-size: 15px; font-weight: 500; color: var(--text); }
        .footer { border-top: 1px solid var(--border); padding: 56px 32px 32px; background: #fff; }
        .footer-inner { max-width: 1400px; margin: 0 auto; }
        .footer-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 32px; margin-bottom: 48px; }
        .footer-col h4 { font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--text); }
        .footer-col ul { display: flex; flex-direction: column; gap: 10px; list-style: none; }
        .footer-col a { font-size: 13px; color: var(--text-light); transition: color 0.15s; }
        .footer-col a:hover { color: var(--green); }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 16px; }
        .socials { display: flex; gap: 16px; align-items: center; }
        .social-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-light); transition: all 0.15s; cursor: pointer; }
        .social-btn:hover { border-color: var(--green); color: var(--green); }
        .nav-burger { display: none; background: transparent; border: none; color: #1a1a1a; cursor: pointer; padding: 4px; }
        .mobile-menu-overlay { position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.5); }
        .mobile-menu { position: absolute; top: 0; right: 0; width: 280px; max-width: 85vw; height: 100%; background: #fff; padding: 20px; overflow-y: auto; }
        .mobile-menu a, .mobile-menu-btn { display: block; padding: 14px 8px; color: var(--text); text-decoration: none; font-size: 15px; font-weight: 500; border-bottom: 1px solid var(--border); }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-burger { display: flex; }
          .header-inner { padding: 12px 16px; }
          .pro-section { margin: 0 16px 24px; padding: 40px 20px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
          .sub-nav-inner { padding: 0 16px; }
          .section { padding: 40px 16px; }
        }
        @media (max-width: 480px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <header className="header">
        <div className="header-inner">
          <Link href="/"><Logo /></Link>
          <nav className="nav-links">
            <Link href="/search/gigs">Servicos</Link>
            <Link href="/freelancers">Freelancers</Link>
            <Link href="/pricing">Planos</Link>
            <Link href="/login">Entrar</Link>
            <Link href="/register"><button className="btn-register">Registar</button></Link>
          </nav>
          <button className="nav-burger" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
            <MenuIcon />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <Logo />
              <button onClick={() => setMobileOpen(false)} style={{ background: "transparent", border: "none", color: "#1a1a1a", cursor: "pointer" }} aria-label="Fechar menu">
                <CloseIcon />
              </button>
            </div>
            <Link href="/search/gigs" onClick={() => setMobileOpen(false)}>Servicos</Link>
            <Link href="/freelancers" onClick={() => setMobileOpen(false)}>Freelancers</Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)}>Planos</Link>
            <Link href="/login" onClick={() => setMobileOpen(false)}>Entrar</Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              style={{ marginTop: "12px", textAlign: "center", background: "#6366f1", color: "#fff", borderRadius: "8px", border: "none", fontWeight: 600 }}
            >
              Registar
            </Link>
          </div>
        </div>
      )}

      <div className="sub-nav">
        <div className="sub-nav-inner">
          {["Em alta","Design Grafico","Programacao","Marketing Digital","Video","Redacao","Musica","Negocios","Servicos de IA"].map((t,i) => (
            <span key={i} onClick={() => router.push(`/search/gigs?search=${encodeURIComponent(t)}`)}>
              {i === 0 ? "🔥 " + t : t}
            </span>
          ))}
        </div>
      </div>

      <section className="hero">
        <div className="hero-inner">
          <h1>Os melhores freelancers de Mocambique, ao teu servico.</h1>
          <div className="hero-search">
            <input type="text" placeholder="Pesquise qualquer servico..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
            <button onClick={handleSearch}><SearchIcon /></button>
          </div>
          <div className="hero-tags">
            {["Desenvolvimento Web","Design Grafico","Edicao de Video","Marketing Digital","Redacao"].map((t,i) => (
              <span key={i} className="hero-tag" onClick={() => router.push(`/search/gigs?search=${encodeURIComponent(t)}`)}>
                {t} →
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="trusted">
        <div className="trusted-inner">
          <span className="trusted-label">Aprovado por:</span>
          <div className="trusted-logos">
            {["Vodacom","Millenium BIM","mcel","Standard Bank","Movitel"].map((b,i) => <span key={i}>{b}</span>)}
          </div>
        </div>
      </section>

      <div className="section">
        <div className="section-title">Categorias Populares</div>
        <div className="cat-grid">
          {categories.map((c,i) => (
            <div key={i} className="cat-card" onClick={() => router.push(`/search/gigs?search=${encodeURIComponent(c.name)}`)}>
              <div className="cat-icon-wrap" style={{ background: c.color, color: c.stroke }}>{c.icon}</div>
              {c.name}
            </div>
          ))}
        </div>
      </div>

      <section className="features-section">
        <div className="features-inner">
          <div className="features-header">
            <div className="section-title" style={{ marginBottom: 0 }}>Faca tudo acontecer com freelancers</div>
            <Link href="/register"><button className="btn-dark">Inscreva-se agora</button></Link>
          </div>
          <div className="features-grid">
            {features.map((f,i) => (
              <div key={i} className="feature-item">
                {f.icon}
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pro-section">
        <div className="pro-label">Freelamz Pro</div>
        <div className="pro-title">Deixe que especialistas gerenciem o seu projecto com qualidade garantida.</div>
      </section>

      <section className="guides-section">
        <div className="guides-header">
          <div className="section-title" style={{ marginBottom: 0 }}>Guias para ajudar voce a crescer</div>
          <Link href="/search/gigs" style={{ fontSize: "14px", fontWeight: "500", color: "var(--text)" }}>Ver mais →</Link>
        </div>
        <div className="guides-grid">
          {[
            { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop", title: "Comece um negocio paralelo em Mocambique" },
            { img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop", title: "Ideias de negocios online que funcionam" },
            { img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop", title: "Como trabalhar em casa com sucesso" },
          ].map((g,i) => (
            <div key={i} className="guide-card" onClick={() => router.push("/register")}>
              <div className="guide-img"><img src={g.img} alt={g.title}/></div>
              <h3>{g.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-columns">
            {[
              { title: "Categorias", links: ["Design Grafico","Marketing Digital","Video","Musica","Programacao","IA","Negocios"] },
              { title: "Para clientes", links: ["Como funciona","Historias de sucesso","Navegar freelancers","Explorar servicos"] },
              { title: "Para freelancers", links: ["Torne-se freelancer","Comunidade","Forum","Eventos"] },
              { title: "Empresa", links: ["Sobre o Freelamz","Central de Ajuda","Seguranca","Carreiras","Termos","Privacidade"] },
            ].map((col,i) => (
              <div key={i} className="footer-col">
                <h4>{col.title}</h4>
                <ul>{col.links.map((l,j) => <li key={j}><Link href="/register">{l}</Link></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Logo />
              <span style={{ fontSize: "13px", color: "#74767e" }}>© Freelamz 2026</span>
            </div>
            <div className="socials">
              {[{ icon: <FbIcon/> }, { icon: <IgIcon/> }, { icon: <LiIcon/> }, { icon: <XIcon/> }].map((s,i) => (
                <div key={i} className="social-btn">{s.icon}</div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}