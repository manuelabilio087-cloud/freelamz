import Link from "next/link";

export default function Home() {
  return (
    <main style={{fontFamily: "Inter, sans-serif", background: "#FFFFFF", minHeight: "100vh"}}>

      {/* NAVBAR */}
      <nav style={{position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, height: "80px", background: "#FFFFFF", borderBottom: "1px solid #E4E5E7", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px"}}>
        <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
          <button style={{display: "flex", flexDirection: "column", gap: "4px", background: "none", border: "none", cursor: "pointer"}}>
            <span style={{width: "20px", height: "2px", background: "#404145", display: "block"}}></span>
            <span style={{width: "20px", height: "2px", background: "#404145", display: "block"}}></span>
            <span style={{width: "20px", height: "2px", background: "#404145", display: "block"}}></span>
          </button>
          <Link href="/" style={{textDecoration: "none"}}>
            <span style={{fontSize: "26px", fontWeight: "900", color: "#404145"}}>Freelamz<span style={{color: "#1DBF73"}}>.</span></span>
          </Link>
        </div>
        <div style={{display: "flex", alignItems: "center", width: "360px", height: "44px", border: "1px solid #C5C6C9", borderRadius: "6px", overflow: "hidden"}}>
          <input type="text" placeholder="Que tipo de servico voce procura?" style={{flex: 1, height: "100%", border: "none", outline: "none", padding: "0 16px", fontSize: "14px", color: "#404145"}} />
          <button style={{width: "60px", height: "100%", background: "#222325", border: "none", cursor: "pointer", color: "#FFFFFF", fontSize: "18px"}}>🔍</button>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "24px"}}>
          <button style={{background: "none", border: "none", cursor: "pointer", color: "#404145", fontSize: "14px", fontWeight: "500"}}>Explorar ▼</button>
          <button style={{background: "none", border: "none", cursor: "pointer", color: "#404145", fontSize: "14px", fontWeight: "500"}}>Categorias ▼</button>
          <Link href="/register?role=freelancer" style={{color: "#404145", fontSize: "14px", fontWeight: "500", textDecoration: "none"}}>Torne-se um vendedor</Link>
          <Link href="/login" style={{color: "#404145", fontSize: "14px", fontWeight: "500", textDecoration: "none"}}>Entrar</Link>
          <Link href="/register" style={{width: "110px", height: "48px", border: "1px solid #222325", background: "#FFFFFF", color: "#222325", fontSize: "14px", fontWeight: "600", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px"}}>Juntar</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{position: "relative", height: "700px", marginTop: "80px", display: "flex", alignItems: "center", overflow: "hidden"}}>
        <div style={{position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center"}}></div>
        <div style={{position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)"}}></div>
        <div style={{position: "relative", zIndex: 10, padding: "0 48px", maxWidth: "1200px"}}>
          <h1 style={{color: "#FFFFFF", fontWeight: "300", fontSize: "88px", lineHeight: "1.05", maxWidth: "700px", marginBottom: "40px", letterSpacing: "-2px"}}>
            Nossos freelancers darao continuidade ao trabalho.
          </h1>
          <div style={{display: "flex", alignItems: "center", background: "#FFFFFF", borderRadius: "12px", overflow: "hidden", maxWidth: "1000px", height: "72px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)"}}>
            <input type="text" placeholder="Pesquise qualquer servico..." style={{flex: 1, height: "100%", border: "none", outline: "none", paddingLeft: "24px", fontSize: "20px", color: "#404145"}} />
            <button style={{width: "72px", height: "72px", background: "#222325", border: "none", cursor: "pointer", color: "#FFFFFF", fontSize: "22px", flexShrink: 0}}>🔍</button>
          </div>
          <div style={{display: "flex", gap: "16px", marginTop: "28px", flexWrap: "wrap"}}>
            {["Desenvolvimento de Websites →", "Design Grafico →", "Videos UGC →", "Edicao de Video →", "Marketing Digital →"].map((tag, i) => (
              <button key={i} style={{height: "60px", padding: "0 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.7)", borderRadius: "12px", color: "#FFFFFF", fontSize: "16px", cursor: "pointer"}}>{tag}</button>
            ))}
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "32px", marginTop: "40px"}}>
            <span style={{color: "#FFFFFF", fontWeight: "500", opacity: 0.9}}>Aprovado por:</span>
            {["Meta", "Google", "Netflix", "P&G", "PayPal", "Payoneer"].map((brand, i) => (
              <span key={i} style={{color: "#FFFFFF", fontWeight: "700", fontSize: "16px", opacity: 0.9}}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section style={{background: "#FFFFFF", padding: "60px 48px"}}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <h2 style={{fontSize: "32px", fontWeight: "700", color: "#404145", marginBottom: "32px"}}>Categorias Populares</h2>
          <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px"}}>
            {[
              {icon: "💻", name: "Programacao e Tecnologia"},
              {icon: "🎨", name: "Design Grafico"},
              {icon: "📊", name: "Marketing Digital"},
              {icon: "✍️", name: "Redacao e Traducao"},
              {icon: "🎬", name: "Video e Animacao"},
              {icon: "🤖", name: "Servicos de IA"},
              {icon: "🎵", name: "Musica e Audio"},
              {icon: "💼", name: "Negocios"},
            ].map((cat, i) => (
              <div key={i} style={{background: "#FFFFFF", border: "1px solid #EFEFF0", borderRadius: "16px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", padding: "24px", cursor: "pointer", transition: "all 0.3s ease", height: "180px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px"}}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.06)"; }}>
                <span style={{fontSize: "48px"}}>{cat.icon}</span>
                <p style={{fontSize: "18px", fontWeight: "500", color: "#404145", margin: 0}}>{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICOS POPULARES */}
      <section style={{background: "#F5F7FA", padding: "60px 48px"}}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <h2 style={{fontSize: "32px", fontWeight: "700", color: "#404145", marginBottom: "32px"}}>Servicos Populares</h2>
          <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px"}}>
            {[
              {title: "Vou criar o teu website profissional", name: "Joao M.", rating: "4.9", reviews: "127", price: "2.500 MT", icon: "💻"},
              {title: "Vou desenhar o teu logo em 24h", name: "Maria S.", rating: "5.0", reviews: "89", price: "1.500 MT", icon: "🎨"},
              {title: "Vou gerir as tuas redes sociais", name: "Pedro A.", rating: "4.8", reviews: "56", price: "3.000 MT", icon: "📱"},
              {title: "Vou traduzir os teus documentos", name: "Ana L.", rating: "4.9", reviews: "203", price: "800 MT", icon: "🌐"},
            ].map((s, i) => (
              <div key={i} style={{background: "#FFFFFF", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 1px 8px rgba(0,0,0,0.06)"}}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.06)"; }}>
                <div style={{height: "200px", background: "linear-gradient(135deg, #1DBF73, #0fa85c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px"}}>{s.icon}</div>
                <div style={{padding: "16px"}}>
                  <p style={{fontSize: "14px", fontWeight: "500", color: "#404145", marginBottom: "12px", lineHeight: "1.4"}}>{s.title}</p>
                  <div style={{display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px"}}>
                    <div style={{width: "32px", height: "32px", borderRadius: "50%", background: "#1DBF73", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: "700", fontSize: "14px"}}>{s.name[0]}</div>
                    <span style={{fontSize: "13px", color: "#74767E"}}>{s.name}</span>
                    <span style={{color: "#F5A623", fontSize: "13px"}}>⭐ {s.rating}</span>
                    <span style={{fontSize: "12px", color: "#B5B6B9"}}>({s.reviews})</span>
                  </div>
                  <div style={{borderTop: "1px solid #E4E5E7", paddingTop: "12px", display: "flex", justifyContent: "space-between"}}>
                    <span style={{fontSize: "12px", color: "#74767E"}}>A partir de</span>
                    <span style={{fontSize: "16px", fontWeight: "700", color: "#404145"}}>{s.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA FREELANCERS */}
      <section style={{background: "#FFFFFF", padding: "80px 48px"}}>
        <div style={{maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "80px"}}>
          <div style={{flex: 1}}>
            <h2 style={{fontSize: "42px", fontWeight: "700", color: "#404145", marginBottom: "16px", lineHeight: "1.2"}}>Transforme a sua habilidade em renda.</h2>
            <p style={{fontSize: "18px", color: "#74767E", marginBottom: "32px", lineHeight: "1.6"}}>Junta-te a milhares de freelancers em Mocambique e comeca a ganhar dinheiro com o que sabes fazer.</p>
            <Link href="/register?role=freelancer" style={{display: "inline-block", background: "#1DBF73", color: "#FFFFFF", padding: "16px 32px", borderRadius: "8px", fontWeight: "600", fontSize: "16px", textDecoration: "none"}}>Comecar a vender</Link>
          </div>
          <div style={{flex: 1, height: "300px", borderRadius: "24px", background: "linear-gradient(135deg, #e8f8f0, #c8f0dc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "100px"}}>🚀</div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{background: "#F5F7FA", padding: "80px 48px"}}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <h2 style={{fontSize: "32px", fontWeight: "700", color: "#404145", marginBottom: "40px", textAlign: "center"}}>O que os nossos clientes dizem</h2>
          <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px"}}>
            {[
              {name: "Carlos M.", company: "TechMoz", comment: "Encontrei um desenvolvedor excelente em menos de 24h. Servico de qualidade e preco justo!"},
              {name: "Fatima A.", company: "DesignPlus", comment: "A plataforma e muito facil de usar. Ja contratei 3 freelancers e todos entregaram no prazo."},
              {name: "Manuel J.", company: "StartupMZ", comment: "O melhor lugar para encontrar talento mocambicano. Recomendo a todos os empresarios!"},
            ].map((dep, i) => (
              <div key={i} style={{background: "#FFFFFF", borderRadius: "16px", padding: "28px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1px solid #EFEFF0"}}>
                <div style={{color: "#F5A623", fontSize: "20px", marginBottom: "16px"}}>⭐⭐⭐⭐⭐</div>
                <p style={{color: "#404145", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px", fontStyle: "italic"}}>"{dep.comment}"</p>
                <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                  <div style={{width: "44px", height: "44px", borderRadius: "50%", background: "#1DBF73", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: "700"}}>{dep.name[0]}</div>
                  <div>
                    <p style={{fontWeight: "600", color: "#404145", fontSize: "14px", margin: 0}}>{dep.name}</p>
                    <p style={{color: "#74767E", fontSize: "13px", margin: 0}}>{dep.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background: "#111111", padding: "64px 48px"}}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "40px", marginBottom: "48px"}}>
            <div>
              <h2 style={{fontSize: "24px", fontWeight: "900", color: "#FFFFFF", marginBottom: "12px"}}>Freelamz<span style={{color: "#1DBF73"}}>.</span></h2>
              <p style={{color: "#74767E", fontSize: "14px"}}>A plataforma freelance de Mocambique</p>
            </div>
            {[
              {title: "Categorias", links: ["Web Design", "Marketing", "Video", "Traducao"]},
              {title: "Sobre", links: ["Quem somos", "Carreiras", "Blog", "Imprensa"]},
              {title: "Suporte", links: ["Centro de ajuda", "Seguranca", "Termos", "Privacidade"]},
              {title: "Comunidade", links: ["Forum", "Eventos", "Podcast", "Instagram"]},
            ].map((col, i) => (
              <div key={i}>
                <h3 style={{color: "#FFFFFF", fontWeight: "600", marginBottom: "16px", fontSize: "14px"}}>{col.title}</h3>
                <ul style={{listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px"}}>
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" style={{color: "#74767E", fontSize: "14px", textDecoration: "none"}}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{borderTop: "1px solid #2A2A2A", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <p style={{color: "#74767E", fontSize: "13px"}}>© 2026 Freelamz. Todos os direitos reservados.</p>
            <div style={{display: "flex", gap: "20px"}}>
              {["Facebook", "Instagram", "LinkedIn", "X"].map((s, i) => (
                <a key={i} href="#" style={{color: "#74767E", fontSize: "13px", textDecoration: "none"}}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
