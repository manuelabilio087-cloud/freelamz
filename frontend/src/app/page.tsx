"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Home() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/gigs`)
      .then((r) => r.json())
      .then((data) => {
        setGigs(Array.isArray(data) ? data.slice(0, 8) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        :root { --green: #1dbf73; --text: #404145; --text-light: #74767e; --border: #e4e5e7; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #ffffff !important; color: #404145 !important; }
        body { font-family: Inter, sans-serif; line-height: 1.5; }
        a { text-decoration: none; color: inherit; }

        .header { position: sticky; top: 0; z-index: 100; background: #ffffff; border-bottom: 1px solid var(--border); }
        .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; gap: 16px; flex-wrap: wrap; }
        .logo { font-size: 28px; font-weight: 700; color: #000; white-space: nowrap; }
        .logo-dot { color: var(--green); }
        .search-box { flex: 1; min-width: 200px; max-width: 500px; display: flex; align-items: center; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
        .search-box input { flex: 1; padding: 10px 14px; border: none; outline: none; font-size: 14px; background: #fff; color: var(--text); }
        .search-box button { background: #000; color: #fff; padding: 0 16px; height: 42px; display: flex; align-items: center; border: none; cursor: pointer; }
        .nav-links { display: flex; align-items: center; gap: 20px; font-size: 14px; font-weight: 500; }
        .btn-join { border: 1px solid #000; padding: 8px 18px; border-radius: 4px; font-weight: 600; white-space: nowrap; }
        .btn-join:hover { background: #000; color: #fff; }

        .sub-nav { border-bottom: 1px solid var(--border); background: #fff; overflow-x: auto; scrollbar-width: none; }
        .sub-nav::-webkit-scrollbar { display: none; }
        .sub-nav-inner { max-width: 1400px; margin: 0 auto; padding: 0 24px; display: flex; gap: 24px; align-items: center; height: 48px; white-space: nowrap; font-size: 13px; color: var(--text-light); }
        .sub-nav a:hover { color: var(--green); }

        .hero { position: relative; min-height: 500px; display: flex; align-items: center; background: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&auto=format&fit=crop') center/cover no-repeat; color: #fff; padding: 60px 24px; }
        .hero-inner { max-width: 1400px; margin: 0 auto; width: 100%; }
        .hero h1 { font-size: clamp(28px, 5vw, 56px); font-weight: 500; line-height: 1.15; max-width: 650px; margin-bottom: 28px; }
        .hero-search { max-width: 580px; background: #fff; border-radius: 8px; display: flex; align-items: center; padding: 4px; margin-bottom: 24px; }
        .hero-search input { flex: 1; border: none; outline: none; padding: 10px 14px; font-size: 15px; color: var(--text); background: transparent; min-width: 0; }
        .hero-search button { background: #000; color: #fff; width: 46px; height: 46px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; flex-shrink: 0; }
        .hero-tags { display: flex; gap: 10px; flex-wrap: wrap; }
        .hero-tag { border: 1px solid rgba(255,255,255,0.6); padding: 7px 14px; border-radius: 20px; font-size: 13px; color: #fff; cursor: pointer; }
        .hero-tag:hover { background: rgba(255,255,255,0.1); }

        .trusted { background: #000; color: #fff; padding: 24px; }
        .trusted-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .trusted-label { font-size: 13px; opacity: 0.8; white-space: nowrap; }
        .trusted-logos { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
        .trusted-logos span { font-size: 16px; font-weight: 600; opacity: 0.9; }

        .categories { padding: 40px 24px; max-width: 1400px; margin: 0 auto; background: #fff; }
        .categories h2 { font-size: clamp(22px, 4vw, 32px); font-weight: 600; margin-bottom: 24px; color: var(--text); }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px; }
        .cat-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 20px 14px; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; transition: box-shadow 0.2s; color: var(--text); }
        .cat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

        /* GIGS SECTION - NOVO */
        .gigs-section { padding: 48px 24px; max-width: 1400px; margin: 0 auto; background: #f9f9f9; }
        .gigs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .gigs-section h2 { font-size: clamp(22px, 4vw, 32px); font-weight: 600; color: var(--text); }
        .gigs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .gig-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: all 0.2s; cursor: pointer; }
        .gig-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .gig-image { height: 160px; background: linear-gradient(135deg, #1dbf73, #0a8c55); display: flex; align-items: center; justify-content: center; font-size: 48px; }
        .gig-body { padding: 16px; }
        .gig-freelancer { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .gig-avatar { width: 32px; height: 32px; border-radius: 50%; background: #1dbf73; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; }
        .gig-name { font-size: 13px; color: var(--text-light); }
        .gig-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 8px; line-height: 1.4; }
        .gig-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f1f1; padding-top: 12px; }
        .gig-rating { font-size: 12px; color: var(--text-light); }
        .gig-price { font-size: 14px; font-weight: 700; color: var(--text); }
        .btn-green { background: #1dbf73; color: #fff; padding: 12px 28px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-size: 16px; }
        .btn-green:hover { background: #19a463; }
        .btn-outline { background: transparent; color: #1dbf73; padding: 10px 24px; border-radius: 8px; font-weight: 600; border: 2px solid #1dbf73; cursor: pointer; font-size: 15px; }
        .btn-outline:hover { background: #f0fdf4; }

        .features { padding: 48px 24px; max-width: 1400px; margin: 0 auto; background: #f9f9f9; }
        .features-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-wrap: wrap; gap: 16px; }
        .features h2 { font-size: clamp(22px, 4vw, 36px); font-weight: 500; color: var(--text); }
        .btn-dark { background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 500; border: none; cursor: pointer; font-size: 14px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 28px; }
        .feature-item { display: flex; flex-direction: column; gap: 12px; }
        .feature-item p { color: var(--text-light); font-size: 14px; line-height: 1.6; }

        .pro-section { background: #003912; color: #fff; padding: 60px 24px; margin: 24px; border-radius: 16px; }
        .pro-section h2 { font-size: clamp(24px, 4vw, 42px); font-weight: 500; max-width: 600px; line-height: 1.2; margin-top: 12px; }

        .guides { padding: 48px 24px; max-width: 1400px; margin: 0 auto; background: #fff; }
        .guides-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .guides h2 { font-size: clamp(22px, 4vw, 36px); font-weight: 500; color: var(--text); }
        .guides-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
        .guide-card { cursor: pointer; }
        .guide-img { aspect-ratio: 16/10; border-radius: 8px; overflow: hidden; margin-bottom: 10px; }
        .guide-img img { width: 100%; height: 100%; object-fit: cover; }
        .guide-card h3 { font-size: 15px; font-weight: 500; color: var(--text); }

        .cta-section { background: linear-gradient(135deg, #0a4226, #1dbf73); padding: 60px 24px; text-align: center; color: #fff; }
        .cta-section h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
        .cta-section p { font-size: 16px; margin-bottom: 32px; opacity: 0.9; }
        .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        .footer { border-top: 1px solid var(--border); padding: 48px 24px 24px; background: #fff; }
        .footer-inner { max-width: 1400px; margin: 0 auto; }
        .footer-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 24px; margin-bottom: 40px; }
        .footer-col h4 { font-size: 15px; font-weight: 700; margin-bottom: 14px; color: var(--text); }
        .footer-col ul { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .footer-col a { font-size: 13px; color: var(--text-light); }
        .footer-col a:hover { color: var(--green); }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 16px; }
        .socials { display: flex; gap: 16px; flex-wrap: wrap; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .search-box { max-width: 100%; order: 3; width: 100%; }
          .hero-tags { display: none; }
          .pro-section { margin: 12px; padding: 40px 20px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
          .gigs-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .header-inner { padding: 12px 16px; }
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
          .features-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">Freelamz<span className="logo-dot">.</span></Link>
          <div className="search-box">
            <input type="text" placeholder="Que tipo de servico voce procura hoje?" />
            <button>🔍</button>
          </div>
          <nav className="nav-links">
            <Link href="/search/gigs">Explorar</Link>
            <Link href="/register?role=freelancer">Torne-se vendedor</Link>
            <Link href="/login">Entrar</Link>
            <Link href="/register" className="btn-join">Juntar</Link>
          </nav>
        </div>
      </header>

      <div className="sub-nav">
        <div className="sub-nav-inner">
          <Link href="/search/gigs">Em alta 🔥</Link>
          <Link href="/search/gigs?category=Design%20Grafico">Design grafico</Link>
          <Link href="/search/gigs?category=Programacao%20e%20Tecnologia">Programacao</Link>
          <Link href="/search/gigs?category=Marketing%20Digital">Marketing Digital</Link>
          <Link href="/search/gigs?category=Video%20e%20Animacao">Video</Link>
          <Link href="/search/gigs?category=Redacao%20e%20Traducao">Redacao</Link>
          <Link href="/search/gigs?category=Musica%20e%20Audio">Musica</Link>
          <Link href="/search/gigs?category=Negocios">Negocios</Link>
          <Link href="/search/gigs?category=Servicos%20de%20IA">Servicos de IA</Link>
        </div>
      </div>

      <section className="hero">
        <div className="hero-inner">
          <h1>Nossos freelancers<br/>darao continuidade ao<br/>trabalho.</h1>
          <div className="hero-search">
            <input type="text" placeholder="Pesquise qualquer servico..." />
            <button>🔍</button>
          </div>
          <div className="hero-tags">
            <Link href="/search/gigs?category=Desenvolvimento%20Web" className="hero-tag">Desenvolvimento Web →</Link>
            <Link href="/search/gigs?category=Design%20Grafico" className="hero-tag">Design Grafico →</Link>
            <Link href="/search/gigs?category=Video%20e%20Animacao" className="hero-tag">Videos UGC →</Link>
            <Link href="/search/gigs?category=Video%20e%20Animacao" className="hero-tag">Edicao de Video →</Link>
            <Link href="/search/gigs?category=Marketing%20Digital" className="hero-tag">Marketing Digital →</Link>
          </div>
        </div>
      </section>

      <section className="trusted">
        <div className="trusted-inner">
          <span className="trusted-label">Aprovado por :</span>
          <div className="trusted-logos">
            {["Meta","Google","NETFLIX","P&G","PayPal","Payoneer"].map((b,i) => (
              <span key={i}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="categories">
        <div>
          <h2>Categorias Populares</h2>
          <div className="cat-grid">
            {[
              {icon:"💻",name:"Programacao e Tecnologia",slug:"Programacao e Tecnologia"},
              {icon:"🎨",name:"Design Grafico",slug:"Design Grafico"},
              {icon:"📊",name:"Marketing Digital",slug:"Marketing Digital"},
              {icon:"✍️",name:"Redacao e Traducao",slug:"Redacao e Traducao"},
              {icon:"🎬",name:"Video e Animacao",slug:"Video e Animacao"},
              {icon:"🤖",name:"Servicos de IA",slug:"Servicos de IA"},
              {icon:"🎵",name:"Musica e Audio",slug:"Musica e Audio"},
              {icon:"💼",name:"Negocios",slug:"Negocios"},
            ].map((c,i) => (
              <Link key={i} href={`/search/gigs?category=${encodeURIComponent(c.slug)}`} className="cat-card">
                <span style={{fontSize:"36px"}}>{c.icon}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GIGS EM DESTAQUE - NOVO */}
      <section className="gigs-section">
        <div className="gigs-header">
          <h2>Servicos em destaque</h2>
          <Link href="/search/gigs" style={{ color: "#1dbf73", fontWeight: "600", fontSize: "14px" }}>Ver todos →</Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Carregando...</div>
        ) : (
          <div className="gigs-grid">
            {gigs.length > 0 ? gigs.map((gig: any) => (
              <Link href={`/gig/${gig.id}`} key={gig.id} style={{ textDecoration: "none" }}>
                <div className="gig-card">
                  <div className="gig-image">💼</div>
                  <div className="gig-body">
                    <div className="gig-freelancer">
                      <div className="gig-avatar">{gig.freelancer_name?.[0]?.toUpperCase() || "?"}</div>
                      <span className="gig-name">{gig.freelancer_name}</span>
                    </div>
                    <h3 className="gig-title">{gig.title}</h3>
                    <div className="gig-footer">
                      <span className="gig-rating">⭐ 5.0</span>
                      <span className="gig-price">A partir de {gig.starting_price} MT</span>
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
                <p style={{ color: "#74767e", marginBottom: "16px" }}>Ainda nao ha servicos disponiveis.</p>
                <Link href="/register" className="btn-green" style={{ textDecoration: "none", display: "inline-block" }}>Seja o primeiro a vender</Link>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="features">
        <div className="features-header">
          <h2>Faca tudo acontecer com freelancers</h2>
          <Link href="/register"><button className="btn-dark">Inscreva-se agora</button></Link>
        </div>
        <div className="features-grid">
          {[
            {icon:"🌍",text:"Tenha acesso a talentos de alto nivel em Mocambique."},
            {icon:"⚡",text:"Experiencia de contratacao simples e facil de usar."},
            {icon:"✅",text:"Trabalho de qualidade, rapido e dentro do orcamento."},
            {icon:"🔒",text:"So pague quando estiver satisfeito."},
          ].map((f,i) => (
            <div key={i} className="feature-item">
              <span style={{fontSize:"44px"}}>{f.icon}</span>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pro-section">
        <div style={{fontSize:"32px",fontWeight:"700"}}>Freelamz Pro.</div>
        <h2>Deixe que especialistas gerenciem o seu projecto.</h2>
      </section>

      <section className="guides">
        <div className="guides-header">
          <h2>Guias para ajudar voce a crescer</h2>
          <a href="#" style={{fontSize:"14px",fontWeight:"500",color:"var(--text)"}}>Ver mais →</a>
        </div>
        <div className="guides-grid">
          {[
            {img:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop",title:"Comece um negocio paralelo"},
            {img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",title:"Ideias de negocios online"},
            {img:"https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop",title:"Trabalhe em casa com sucesso"},
          ].map((g,i) => (
            <a key={i} href="#" className="guide-card">
              <div className="guide-img"><img src={g.img} alt={g.title}/></div>
              <h3>{g.title}</h3>
            </a>
          ))}
        </div>
      </section>

      {/* CTA - NOVO */}
      <section className="cta-section">
        <h2>Pronto para comecar?</h2>
        <p>Junte-se a milhares de freelancers e clientes em Mocambique.</p>
        <div className="cta-buttons">
          <Link href="/register" className="btn-green" style={{ textDecoration: "none" }}>Criar conta gratis</Link>
          <Link href="/search/gigs" className="btn-outline" style={{ textDecoration: "none", background: "#fff", color: "#1dbf73" }}>Explorar servicos</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-columns">
            {[
              {title:"Categorias",links:["Design Grafico","Marketing Digital","Video","Musica","Programacao","IA","Negocios"]},
              {title:"Para clientes",links:["Como funciona","Historias de sucesso","Guia de Qualidade","Navegar freelancers"]},
              {title:"Para freelancers",links:["Torne-se freelancer","Comunidade","Forum","Eventos"]},
              {title:"Empresa",links:["Sobre o Freelamz","Central de Ajuda","Seguranca","Carreiras","Termos","Privacidade"]},
            ].map((col,i) => (
              <div key={i} className="footer-col">
                <h4>{col.title}</h4>
                <ul>{col.links.map((l,j) => <li key={j}><a href="#">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <div style={{display:"flex",alignItems:"center",gap:"12px",fontSize:"13px",color:"#74767e"}}>
              <span style={{fontSize:"22px",fontWeight:"700",color:"#000"}}>Freelamz<span style={{color:"#1dbf73"}}>.</span></span>
              <span>© Freelamz 2026</span>
            </div>
            <div className="socials">
              {["Facebook","Instagram","LinkedIn","X"].map((s,i) => (
                <a key={i} href="#" style={{fontSize:"13px",color:"#74767e"}}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}