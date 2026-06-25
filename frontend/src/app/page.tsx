"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/projects?search=${encodeURIComponent(search)}`);
    }
  };

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
        .logo { font-size: 28px; font-weight: 700; color: #000; white-space: nowrap; }
        .logo-dot { color: var(--green); }
        .nav-links { display: flex; align-items: center; gap: 24px; font-size: 14px; font-weight: 500; }
        .btn-join { border: 1px solid #000; padding: 8px 20px; border-radius: 4px; font-weight: 600; white-space: nowrap; cursor: pointer; background: #fff; }
        .btn-join:hover { background: #000; color: #fff; }

        .sub-nav { border-bottom: 1px solid var(--border); background: #fff; overflow-x: auto; scrollbar-width: none; }
        .sub-nav::-webkit-scrollbar { display: none; }
        .sub-nav-inner { max-width: 1400px; margin: 0 auto; padding: 0 32px; display: flex; gap: 28px; align-items: center; height: 48px; white-space: nowrap; font-size: 13px; color: var(--text-light); }
        .sub-nav a:hover { color: var(--green); cursor: pointer; }

        .hero { position: relative; min-height: 580px; display: flex; align-items: center; background: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&auto=format&fit=crop') center/cover no-repeat; color: #fff; padding: 60px 32px; }
        .hero-inner { max-width: 1400px; margin: 0 auto; width: 100%; }
        .hero h1 { font-size: clamp(32px, 5vw, 60px); font-weight: 500; line-height: 1.15; max-width: 650px; margin-bottom: 32px; }
        .hero-search { max-width: 620px; background: #fff; border-radius: 8px; display: flex; align-items: center; padding: 4px; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        .hero-search input { flex: 1; border: none; outline: none; padding: 12px 16px; font-size: 16px; color: var(--text); background: transparent; min-width: 0; }
        .hero-search button { background: #000; color: #fff; width: 52px; height: 52px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; font-size: 20px; flex-shrink: 0; }
        .hero-search button:hover { background: #1dbf73; }
        .hero-tags { display: flex; gap: 10px; flex-wrap: wrap; }
        .hero-tag { border: 1px solid rgba(255,255,255,0.6); padding: 7px 16px; border-radius: 20px; font-size: 13px; color: #fff; cursor: pointer; transition: background 0.2s; }
        .hero-tag:hover { background: rgba(255,255,255,0.15); }

        .trusted { background: #000; color: #fff; padding: 24px 32px; }
        .trusted-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
        .trusted-label { font-size: 13px; opacity: 0.8; white-space: nowrap; }
        .trusted-logos { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; }
        .trusted-logos span { font-size: 15px; font-weight: 600; opacity: 0.9; }

        .categories { padding: 48px 32px; max-width: 1400px; margin: 0 auto; background: #fff; }
        .categories h2 { font-size: clamp(22px, 3vw, 32px); font-weight: 600; margin-bottom: 28px; color: var(--text); }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
        .cat-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 24px 16px; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 12px; font-size: 13px; font-weight: 500; transition: box-shadow 0.2s, transform 0.2s; color: var(--text); }
        .cat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-2px); border-color: var(--green); }
        .cat-icon { font-size: 40px; }

        .features { padding: 56px 32px; max-width: 1400px; margin: 0 auto; background: #f9f9f9; }
        .features-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; flex-wrap: wrap; gap: 16px; }
        .features h2 { font-size: clamp(22px, 3vw, 36px); font-weight: 500; color: var(--text); }
        .btn-dark { background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 500; border: none; cursor: pointer; font-size: 14px; }
        .btn-dark:hover { background: #1dbf73; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px; }
        .feature-item { display: flex; flex-direction: column; gap: 14px; }
        .feature-item p { color: var(--text-light); font-size: 14px; line-height: 1.6; }
        .feature-icon { font-size: 48px; }

        .pro-section { background: #003912; color: #fff; padding: 64px 32px; margin: 32px; border-radius: 16px; }
        .pro-section h2 { font-size: clamp(24px, 4vw, 42px); font-weight: 500; max-width: 600px; line-height: 1.2; margin-top: 12px; }
        .pro-label { font-size: 28px; font-weight: 700; }

        .guides { padding: 48px 32px; max-width: 1400px; margin: 0 auto; background: #fff; }
        .guides-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .guides h2 { font-size: clamp(22px, 3vw, 36px); font-weight: 500; color: var(--text); }
        .guides-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .guide-card { cursor: pointer; }
        .guide-img { aspect-ratio: 16/10; border-radius: 10px; overflow: hidden; margin-bottom: 12px; }
        .guide-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .guide-card:hover .guide-img img { transform: scale(1.05); }
        .guide-card h3 { font-size: 15px; font-weight: 500; color: var(--text); }

        .footer { border-top: 1px solid var(--border); padding: 56px 32px 32px; background: #fff; }
        .footer-inner { max-width: 1400px; margin: 0 auto; }
        .footer-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 32px; margin-bottom: 48px; }
        .footer-col h4 { font-size: 15px; font-weight: 700; margin-bottom: 16px; color: var(--text); }
        .footer-col ul { display: flex; flex-direction: column; gap: 10px; list-style: none; }
        .footer-col a { font-size: 13px; color: var(--text-light); }
        .footer-col a:hover { color: var(--green); }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 16px; }
        .socials { display: flex; gap: 16px; flex-wrap: wrap; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .header-inner { padding: 12px 16px; }
          .pro-section { margin: 16px; padding: 40px 20px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
          .sub-nav-inner { padding: 0 16px; }
        }
        @media (max-width: 480px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
          .features-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* NAVBAR — sem barra de pesquisa */}
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">Freelamz<span className="logo-dot">.</span></Link>
          <nav className="nav-links">
            <Link href="/projects">Projectos</Link>
            <Link href="/freelancers">Freelancers</Link>
            <Link href="/register?role=freelancer">Torne-se vendedor</Link>
            <Link href="/login">Entrar</Link>
            <Link href="/register"><button className="btn-join">Juntar</button></Link>
          </nav>
        </div>
      </header>

      {/* SUB NAV */}
      <div className="sub-nav">
        <div className="sub-nav-inner">
          {["🔥 Em alta","Design Grafico","Programacao","Marketing Digital","Video","Redacao","Musica","Negocios","Servicos de IA"].map((t,i) => (
            <span key={i} onClick={() => router.push(`/projects?search=${encodeURIComponent(t.replace("🔥 ",""))}`)}>{t}</span>
          ))}
        </div>
      </div>

      {/* HERO com pesquisa funcional */}
      <section className="hero">
        <div className="hero-inner">
          <h1>Nossos freelancers<br/>darao continuidade ao<br/>trabalho.</h1>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Pesquise qualquer servico..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} title="Pesquisar">
              🔍
            </button>
          </div>
          <div className="hero-tags">
            {["Desenvolvimento Web","Design Grafico","Videos UGC","Edicao de Video","Marketing Digital"].map((t,i) => (
              <span key={i} className="hero-tag" onClick={() => router.push(`/projects?search=${encodeURIComponent(t)}`)}>
                {t} →
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* APROVADO POR */}
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

      {/* CATEGORIAS */}
      <section className="categories">
        <h2>Categorias Populares</h2>
        <div className="cat-grid">
          {[
            {icon:"💻",name:"Programacao"},
            {icon:"🎨",name:"Design Grafico"},
            {icon:"📊",name:"Marketing Digital"},
            {icon:"✍️",name:"Redacao"},
            {icon:"🎬",name:"Video"},
            {icon:"🤖",name:"Servicos de IA"},
            {icon:"🎵",name:"Musica e Audio"},
            {icon:"💼",name:"Negocios"},
          ].map((c,i) => (
            <div key={i} className="cat-card" onClick={() => router.push(`/projects?search=${encodeURIComponent(c.name)}`)}>
              <span className="cat-icon">{c.icon}</span>
              {c.name}
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="features">
        <div className="features-header">
          <h2>Faca tudo acontecer com freelancers</h2>
          <Link href="/register"><button className="btn-dark">Inscreva-se agora</button></Link>
        </div>
        <div className="features-grid">
          {[
            {icon:"🌍",text:"Acesso a talentos de alto nivel em todo Mocambique."},
            {icon:"⚡",text:"Contratacao simples, rapida e segura."},
            {icon:"✅",text:"Trabalho de qualidade dentro do orcamento."},
            {icon:"🔒",text:"So pague quando estiver 100% satisfeito."},
          ].map((f,i) => (
            <div key={i} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRO SECTION */}
      <section className="pro-section">
        <div className="pro-label">Freelamz Pro.</div>
        <h2>Deixe que especialistas gerenciem o seu projecto.</h2>
      </section>

      {/* GUIAS */}
      <section className="guides">
        <div className="guides-header">
          <h2>Guias para ajudar voce a crescer</h2>
          <Link href="/projects" style={{fontSize:"14px",fontWeight:"500",color:"var(--text)"}}>Ver mais →</Link>
        </div>
        <div className="guides-grid">
          {[
            {img:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop",title:"Comece um negocio paralelo"},
            {img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",title:"Ideias de negocios online em Mocambique"},
            {img:"https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop",title:"Trabalhe em casa com sucesso"},
          ].map((g,i) => (
            <div key={i} className="guide-card" onClick={() => router.push("/register")}>
              <div className="guide-img"><img src={g.img} alt={g.title}/></div>
              <h3>{g.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-columns">
            {[
              {title:"Categorias",links:["Design Grafico","Marketing Digital","Video","Musica","Programacao","IA","Negocios"]},
              {title:"Para clientes",links:["Como funciona","Historias de sucesso","Navegar freelancers","Publicar projecto"]},
              {title:"Para freelancers",links:["Torne-se freelancer","Comunidade","Forum","Eventos"]},
              {title:"Empresa",links:["Sobre o Freelamz","Central de Ajuda","Seguranca","Carreiras","Termos","Privacidade"]},
            ].map((col,i) => (
              <div key={i} className="footer-col">
                <h4>{col.title}</h4>
                <ul>{col.links.map((l,j) => <li key={j}><Link href="/register">{l}</Link></li>)}</ul>
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
                <Link key={i} href="/register" style={{fontSize:"13px",color:"#74767e"}}>{s}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}