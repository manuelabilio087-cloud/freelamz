"use client";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <style>{`
        :root { --green: #1dbf73; --text: #404145; --text-light: #74767e; --border: #e4e5e7; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; color: var(--text); }
        a { text-decoration: none; color: inherit; }
        .header { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }
        .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; gap: 24px; }
        .logo { font-size: 32px; font-weight: 700; color: #000; }
        .logo-dot { color: var(--green); }
        .search-box { flex: 1; max-width: 500px; display: flex; align-items: center; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
        .search-box input { flex: 1; padding: 10px 16px; border: none; outline: none; font-size: 15px; }
        .search-box button { background: #000; color: #fff; padding: 0 18px; height: 42px; display: flex; align-items: center; border: none; cursor: pointer; }
        .nav-links { display: flex; align-items: center; gap: 24px; font-size: 15px; font-weight: 500; }
        .btn-join { border: 1px solid #000; padding: 8px 20px; border-radius: 4px; font-weight: 600; }
        .btn-join:hover { background: #000; color: #fff; }
        .sub-nav { border-bottom: 1px solid var(--border); overflow-x: auto; scrollbar-width: none; }
        .sub-nav-inner { max-width: 1400px; margin: 0 auto; padding: 0 32px; display: flex; gap: 28px; align-items: center; height: 48px; white-space: nowrap; font-size: 14px; color: var(--text-light); }
        .sub-nav a:hover { color: var(--green); }
        .hero { position: relative; height: 600px; display: flex; align-items: center; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&auto=format&fit=crop') center/cover no-repeat; color: #fff; padding: 0 32px; }
        .hero-inner { max-width: 1400px; margin: 0 auto; width: 100%; }
        .hero h1 { font-size: 56px; font-weight: 500; line-height: 1.15; max-width: 700px; margin-bottom: 32px; letter-spacing: -1px; }
        .hero-search { max-width: 600px; background: #fff; border-radius: 8px; display: flex; align-items: center; padding: 4px; margin-bottom: 28px; }
        .hero-search input { flex: 1; border: none; outline: none; padding: 12px 16px; font-size: 16px; color: var(--text); }
        .hero-search button { background: #000; color: #fff; width: 48px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
        .hero-tags { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-tag { border: 1px solid rgba(255,255,255,0.6); padding: 8px 18px; border-radius: 20px; font-size: 14px; color: #fff; }
        .hero-tag:hover { background: rgba(255,255,255,0.1); }
        .trusted { background: #000; color: #fff; padding: 28px 32px; }
        .trusted-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; gap: 48px; flex-wrap: wrap; }
        .trusted-logos { display: flex; gap: 48px; align-items: center; flex-wrap: wrap; }
        .trusted-logos span { font-size: 20px; font-weight: 600; opacity: 0.9; }
        .categories { padding: 48px 32px; max-width: 1400px; margin: 0 auto; }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 16px; }
        .cat-card { border: 1px solid var(--border); border-radius: 12px; padding: 24px 16px; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 12px; font-size: 14px; font-weight: 500; transition: box-shadow 0.2s; }
        .cat-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .features { padding: 64px 32px; max-width: 1400px; margin: 0 auto; }
        .features-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; }
        .features h2 { font-size: 36px; font-weight: 500; }
        .btn-dark { background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 500; border: none; cursor: pointer; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 32px; }
        .feature-item { display: flex; flex-direction: column; gap: 16px; }
        .feature-item p { color: var(--text-light); font-size: 15px; line-height: 1.6; }
        .pro-section { background: #003912; color: #fff; padding: 80px 32px; margin: 0 32px 48px; border-radius: 16px; max-width: 1400px; margin-left: auto; margin-right: auto; }
        .pro-section h2 { font-size: 42px; font-weight: 500; max-width: 600px; line-height: 1.2; margin-top: 16px; }
        .guides { padding: 48px 32px; max-width: 1400px; margin: 0 auto; }
        .guides-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .guides h2 { font-size: 36px; font-weight: 500; }
        .guides-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .guide-card { cursor: pointer; }
        .guide-img { aspect-ratio: 16/10; border-radius: 8px; overflow: hidden; margin-bottom: 12px; }
        .guide-img img { width: 100%; height: 100%; object-fit: cover; }
        .guide-card h3 { font-size: 16px; font-weight: 500; }
        .footer { border-top: 1px solid var(--border); padding: 64px 32px 32px; }
        .footer-inner { max-width: 1400px; margin: 0 auto; }
        .footer-columns { display: grid; grid-template-columns: repeat(5, 1fr); gap: 32px; margin-bottom: 48px; }
        .footer-col h4 { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
        .footer-col ul { display: flex; flex-direction: column; gap: 10px; list-style: none; }
        .footer-col a { font-size: 14px; color: var(--text-light); }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 16px; }
        .socials { display: flex; gap: 16px; }
        @media (max-width: 768px) {
          .hero h1 { font-size: 36px; }
          .footer-columns { grid-template-columns: repeat(2, 1fr); }
          .nav-links { display: none; }
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
            <a href="#">Explorar ▼</a>
            <Link href="/register?role=freelancer">Torne-se vendedor</Link>
            <Link href="/login">Entrar</Link>
            <Link href="/register" className="btn-join">Juntar</Link>
          </nav>
        </div>
      </header>

      <div className="sub-nav">
        <div className="sub-nav-inner">
          <a href="#">Em alta 🔥</a>
          <a href="#">Design grafico</a>
          <a href="#">Programacao e Tecnologia</a>
          <a href="#">Marketing Digital</a>
          <a href="#">Video e animacao</a>
          <a href="#">Redacao e Traducao</a>
          <a href="#">Musica e audio</a>
          <a href="#">Negocios</a>
          <a href="#">Servicos de IA</a>
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
            {["Desenvolvimento de Websites", "Design Grafico", "Videos UGC", "Edicao de Video", "Marketing Digital"].map((t, i) => (
              <a key={i} href="#" className="hero-tag">{t} →</a>
            ))}
          </div>
        </div>
      </section>

      <section className="trusted">
        <div className="trusted-inner">
          <span style={{fontSize:"14px", opacity:0.8}}>Aprovado por :</span>
          <div className="trusted-logos">
            {["⌘ Meta", "Google", "NETFLIX", "P&G", "PayPal", "○ Payoneer"].map((b, i) => (
              <span key={i}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="cat-grid">
          {[
            {icon: "💻", name: "Programacao e Tecnologia"},
            {icon: "🎨", name: "Design Grafico"},
            {icon: "📊", name: "Marketing Digital"},
            {icon: "✍️", name: "Redacao e Traducao"},
            {icon: "🎬", name: "Video e Animacao"},
            {icon: "🤖", name: "Servicos de IA"},
            {icon: "🎵", name: "Musica e Audio"},
            {icon: "💼", name: "Negocios"},
          ].map((c, i) => (
            <a key={i} href="#" className="cat-card">
              <span style={{fontSize:"36px"}}>{c.icon}</span>
              {c.name}
            </a>
          ))}
        </div>
      </section>

      <section className="features">
        <div className="features-header">
          <h2>Faca tudo acontecer com freelancers</h2>
          <Link href="/register"><button className="btn-dark">Inscreva-se agora</button></Link>
        </div>
        <div className="features-grid">
          {[
            {icon: "🌍", text: "Tenha acesso a um conjunto de talentos de alto nivel em Mocambique."},
            {icon: "⚡", text: "Desfrute de uma experiencia de contratacao simples e facil de usar."},
            {icon: "✅", text: "Obtenha trabalho de qualidade, rapido e dentro do orcamento."},
            {icon: "🔒", text: "So pague quando estiver satisfeito."},
          ].map((f, i) => (
            <div key={i} className="feature-item">
              <span style={{fontSize:"48px"}}>{f.icon}</span>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pro-section">
        <div style={{fontSize:"36px", fontWeight:"700"}}>Freelamz Pro.</div>
        <h2>Deixe que especialistas gerenciem o seu projecto.</h2>
      </section>

      <section className="guides">
        <div className="guides-header">
          <h2>Guias para ajudar voce a crescer</h2>
          <a href="#" style={{fontSize:"15px", fontWeight:"500"}}>Ver mais guias →</a>
        </div>
        <div className="guides-grid">
          {[
            {img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop", title: "Comece um negocio paralelo"},
            {img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop", title: "Ideias de negocios de comercio eletronico"},
            {img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop", title: "Comece um negocio online e trabalhe em casa."},
          ].map((g, i) => (
            <a key={i} href="#" className="guide-card">
              <div className="guide-img"><img src={g.img} alt={g.title} /></div>
              <h3>{g.title}</h3>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-columns">
            {[
              {title:"Categorias", links:["Design Grafico","Marketing Digital","Redacao e Traducao","Video e Animacao","Musica e Audio","Programacao","Servicos de IA","Negocios"]},
              {title:"Para clientes", links:["Como funciona o Freelamz","Historias de sucesso","Guia de Qualidade","Navegar por freelancers"]},
              {title:"Para freelancers", links:["Torne-se um freelancer","Centro Comunitario","Forum","Eventos"]},
              {title:"Solucoes Empresariais", links:["Freelamz Pro","Gestao de Projectos","Busca Especializada","Contactar vendas"]},
              {title:"Empresa", links:["Sobre o Freelamz","Central de Ajuda","Confianca e Seguranca","Carreiras","Termos de Servico","Politica de Privacidade"]},
            ].map((col, i) => (
              <div key={i} className="footer-col">
                <h4>{col.title}</h4>
                <ul>{col.links.map((l, j) => <li key={j}><a href="#">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <div style={{display:"flex", alignItems:"center", gap:"16px", fontSize:"14px", color:"#74767e"}}>
              <span style={{fontSize:"24px", fontWeight:"700", color:"#000"}}>Freelamz<span style={{color:"#1dbf73"}}>.</span></span>
              <span>© Freelamz 2026</span>
            </div>
            <div className="socials">
              {["Facebook", "Instagram", "LinkedIn", "X"].map((s, i) => (
                <a key={i} href="#" style={{fontSize:"14px", color:"#74767e"}}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}