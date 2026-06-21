import Link from "next/link";

export default function Home() {
  return (
    <main style={{fontFamily:"Inter,sans-serif",background:"#FFFFFF",minHeight:"100vh"}}>

      {/* NAVBAR */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,height:"80px",background:"#FFFFFF",borderBottom:"1px solid #E4E5E7",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 48px"}}>
        <Link href="/" style={{textDecoration:"none",fontSize:"26px",fontWeight:"900",color:"#404145"}}>
          Freelamz<span style={{color:"#1DBF73"}}>.</span>
        </Link>
        <div style={{display:"flex",alignItems:"center",width:"360px",height:"44px",border:"1px solid #C5C6C9",borderRadius:"6px",overflow:"hidden"}}>
          <input type="text" placeholder="Que tipo de servico voce procura?" style={{flex:1,height:"100%",border:"none",outline:"none",padding:"0 16px",fontSize:"14px"}}/>
          <button style={{width:"60px",height:"100%",background:"#222325",border:"none",cursor:"pointer",color:"#FFF",fontSize:"16px"}}>🔍</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
          <Link href="/register?role=freelancer" style={{color:"#404145",fontSize:"14px",fontWeight:"500",textDecoration:"none"}}>Torne-se vendedor</Link>
          <Link href="/login" style={{color:"#404145",fontSize:"14px",fontWeight:"500",textDecoration:"none"}}>Entrar</Link>
          <Link href="/register" style={{padding:"0 20px",height:"44px",border:"1px solid #222325",background:"#FFF",color:"#222325",fontSize:"14px",fontWeight:"600",textDecoration:"none",display:"flex",alignItems:"center",borderRadius:"6px"}}>Juntar</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:"relative",height:"700px",marginTop:"80px",display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80')",backgroundSize:"cover",backgroundPosition:"center"}}></div>
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)"}}></div>
        <div style={{position:"relative",zIndex:10,padding:"0 48px",maxWidth:"1100px"}}>
          <h1 style={{color:"#FFF",fontWeight:"300",fontSize:"80px",lineHeight:"1.05",maxWidth:"650px",marginBottom:"40px",letterSpacing:"-2px"}}>
            Nossos freelancers darao continuidade ao trabalho.
          </h1>
          <div style={{display:"flex",alignItems:"center",background:"#FFF",borderRadius:"12px",overflow:"hidden",maxWidth:"900px",height:"68px",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
            <input type="text" placeholder="Pesquise qualquer servico..." style={{flex:1,height:"100%",border:"none",outline:"none",paddingLeft:"24px",fontSize:"18px",color:"#404145"}}/>
            <button style={{width:"72px",height:"68px",background:"#222325",border:"none",cursor:"pointer",color:"#FFF",fontSize:"20px"}}>🔍</button>
          </div>
          <div style={{display:"flex",gap:"12px",marginTop:"24px",flexWrap:"wrap"}}>
            {["Desenvolvimento Web","Design Grafico","Videos UGC","Edicao de Video","Marketing Digital"].map((t,i)=>(
              <button key={i} style={{height:"48px",padding:"0 20px",background:"transparent",border:"1px solid rgba(255,255,255,0.7)",borderRadius:"8px",color:"#FFF",fontSize:"14px",cursor:"pointer"}}>{t} →</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"28px",marginTop:"36px"}}>
            <span style={{color:"#FFF",fontWeight:"500",opacity:0.9,fontSize:"14px"}}>Aprovado por:</span>
            {["Meta","Google","Netflix","PayPal","Payoneer"].map((b,i)=>(
              <span key={i} style={{color:"#FFF",fontWeight:"700",fontSize:"15px",opacity:0.9}}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section style={{background:"#FFF",padding:"60px 48px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <h2 style={{fontSize:"30px",fontWeight:"700",color:"#404145",marginBottom:"32px"}}>Categorias Populares</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"20px"}}>
            {[
              {icon:"💻",name:"Programacao e Tecnologia"},
              {icon:"🎨",name:"Design Grafico"},
              {icon:"📊",name:"Marketing Digital"},
              {icon:"✍️",name:"Redacao e Traducao"},
              {icon:"🎬",name:"Video e Animacao"},
              {icon:"🤖",name:"Servicos de IA"},
              {icon:"🎵",name:"Musica e Audio"},
              {icon:"💼",name:"Negocios"},
            ].map((c,i)=>(
              <div key={i} style={{background:"#FFF",border:"1px solid #EFEFF0",borderRadius:"16px",boxShadow:"0 1px 8px rgba(0,0,0,0.06)",padding:"24px",cursor:"pointer",transition:"all 0.3s",minHeight:"160px",display:"flex",flexDirection:"column",justifyContent:"center",gap:"12px"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 12px 25px rgba(0,0,0,0.12)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 8px rgba(0,0,0,0.06)"}}>
                <span style={{fontSize:"44px"}}>{c.icon}</span>
                <p style={{fontSize:"16px",fontWeight:"500",color:"#404145",margin:0}}>{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICOS POPULARES */}
      <section style={{background:"#F5F7FA",padding:"60px 48px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <h2 style={{fontSize:"30px",fontWeight:"700",color:"#404145",marginBottom:"32px"}}>Servicos Populares</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"24px"}}>
            {[
              {title:"Vou criar o teu website profissional",name:"Joao M.",rating:"4.9",reviews:"127",price:"2.500 MT",icon:"💻"},
              {title:"Vou desenhar o teu logo em 24h",name:"Maria S.",rating:"5.0",reviews:"89",price:"1.500 MT",icon:"🎨"},
              {title:"Vou gerir as tuas redes sociais",name:"Pedro A.",rating:"4.8",reviews:"56",price:"3.000 MT",icon:"📱"},
              {title:"Vou traduzir os teus documentos",name:"Ana L.",rating:"4.9",reviews:"203",price:"800 MT",icon:"🌐"},
            ].map((s,i)=>(
              <div key={i} style={{background:"#FFF",borderRadius:"12px",overflow:"hidden",cursor:"pointer",transition:"all 0.3s",boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,0.12)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 1px 8px rgba(0,0,0,0.06)"}}>
                <div style={{height:"180px",background:"linear-gradient(135deg,#1DBF73,#0fa85c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"56px"}}>{s.icon}</div>
                <div style={{padding:"16px"}}>
                  <p style={{fontSize:"14px",fontWeight:"500",color:"#404145",marginBottom:"12px",lineHeight:"1.4"}}>{s.title}</p>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
                    <div style={{width:"28px",height:"28px",borderRadius:"50%",background:"#1DBF73",display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontWeight:"700",fontSize:"12px"}}>{s.name[0]}</div>
                    <span style={{fontSize:"13px",color:"#74767E"}}>{s.name}</span>
                    <span style={{color:"#F5A623",fontSize:"12px"}}>⭐ {s.rating}</span>
                    <span style={{fontSize:"11px",color:"#B5B6B9"}}>({s.reviews})</span>
                  </div>
                  <div style={{borderTop:"1px solid #E4E5E7",paddingTop:"12px",display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:"11px",color:"#74767E"}}>A partir de</span>
                    <span style={{fontSize:"15px",fontWeight:"700",color:"#404145"}}>{s.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA FREELANCERS */}
      <section style={{background:"#FFF",padding:"80px 48px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",display:"flex",alignItems:"center",gap:"60px"}}>
          <div style={{flex:1}}>
            <h2 style={{fontSize:"40px",fontWeight:"700",color:"#404145",marginBottom:"16px",lineHeight:"1.2"}}>Transforme a sua habilidade em renda.</h2>
            <p style={{fontSize:"18px",color:"#74767E",marginBottom:"32px",lineHeight:"1.6"}}>Junta-te a milhares de freelancers em Mocambique e comeca a ganhar dinheiro com o que sabes fazer.</p>
            <Link href="/register?role=freelancer" style={{display:"inline-block",background:"#1DBF73",color:"#FFF",padding:"16px 32px",borderRadius:"8px",fontWeight:"600",fontSize:"16px",textDecoration:"none"}}>Comecar a vender</Link>
          </div>
          <div style={{flex:1,height:"280px",borderRadius:"24px",background:"linear-gradient(135deg,#e8f8f0,#c8f0dc)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"90px"}}>🚀</div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{background:"#F5F7FA",padding:"80px 48px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <h2 style={{fontSize:"30px",fontWeight:"700",color:"#404145",marginBottom:"40px",textAlign:"center"}}>O que os nossos clientes dizem</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"24px"}}>
            {[
              {name:"Carlos M.",company:"TechMoz",comment:"Encontrei um desenvolvedor excelente em menos de 24h. Qualidade e preco justo!"},
              {name:"Fatima A.",company:"DesignPlus",comment:"Plataforma facil de usar. Ja contratei 3 freelancers e todos entregaram no prazo."},
              {name:"Manuel J.",company:"StartupMZ",comment:"O melhor lugar para encontrar talento mocambicano. Recomendo a todos!"},
            ].map((d,i)=>(
              <div key={i} style={{background:"#FFF",borderRadius:"16px",padding:"28px",boxShadow:"0 1px 8px rgba(0,0,0,0.06)",border:"1px solid #EFEFF0"}}>
                <div style={{color:"#F5A623",fontSize:"18px",marginBottom:"16px"}}>⭐⭐⭐⭐⭐</div>
                <p style={{color:"#404145",fontSize:"15px",lineHeight:"1.6",marginBottom:"24px",fontStyle:"italic"}}>"{d.comment}"</p>
                <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                  <div style={{width:"40px",height:"40px",borderRadius:"50%",background:"#1DBF73",display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontWeight:"700"}}>{d.name[0]}</div>
                  <div>
                    <p style={{fontWeight:"600",color:"#404145",fontSize:"14px",margin:0}}>{d.name}</p>
                    <p style={{color:"#74767E",fontSize:"13px",margin:0}}>{d.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#111111",padding:"60px 48px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"48px",flexWrap:"wrap",gap:"32px"}}>
            <div>
              <h2 style={{fontSize:"22px",fontWeight:"900",color:"#FFF",marginBottom:"12px"}}>Freelamz<span style={{color:"#1DBF73"}}>.</span></h2>
              <p style={{color:"#74767E",fontSize:"14px"}}>A plataforma freelance de Mocambique 🇲🇿</p>
            </div>
            {[
              {title:"Categorias",links:["Web Design","Marketing","Video","Traducao"]},
              {title:"Sobre",links:["Quem somos","Carreiras","Blog","Imprensa"]},
              {title:"Suporte",links:["Centro de ajuda","Seguranca","Termos","Privacidade"]},
            ].map((col,i)=>(
              <div key={i}>
                <h3 style={{color:"#FFF",fontWeight:"600",marginBottom:"16px",fontSize:"14px"}}>{col.title}</h3>
                <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"10px"}}>
                  {col.links.map((l,j)=><li key={j}><a href="#" style={{color:"#74767E",fontSize:"14px",textDecoration:"none"}}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{borderTop:"1px solid #2A2A2A",paddingTop:"24px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"16px"}}>
            <p style={{color:"#74767E",fontSize:"13px"}}>© 2026 Freelamz. Todos os direitos reservados.</p>
            <div style={{display:"flex",gap:"20px"}}>
              {["Facebook","Instagram","LinkedIn","X"].map((s,i)=><a key={i} href="#" style={{color:"#74767E",fontSize:"13px",textDecoration:"none"}}>{s}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}