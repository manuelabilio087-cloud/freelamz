"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "", skills: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      setFormData({ name: u.name || "", bio: u.bio || "", skills: Array.isArray(u.skills) ? u.skills.join(", ") : u.skills || "" });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: formData.name, bio: formData.bio, skills: formData.skills.split(",").map((s: string) => s.trim()) }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}><div>Carregando...</div></div>;

  if (!user) {
    return (
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"24px",background:"#fff"}}>
        <h1 style={{fontSize:"32px",fontWeight:"700"}}>Nao estas autenticado</h1>
        <Link href="/login" style={{background:"#1dbf73",color:"#fff",padding:"12px 32px",borderRadius:"8px",fontWeight:"600",textDecoration:"none"}}>Entrar</Link>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#f7f7f7",fontFamily:"Inter,sans-serif"}}>
      <style>{`
        .btn-green { background:#1dbf73;color:#fff;padding:10px 24px;border-radius:6px;font-weight:600;border:none;cursor:pointer; }
        .btn-outline { background:#fff;color:#404145;padding:10px 24px;border-radius:6px;font-weight:600;border:1px solid #e4e5e7;cursor:pointer; }
        .card { background:#fff;border:1px solid #e4e5e7;border-radius:12px;padding:24px; }
        .section-title { font-size:20px;font-weight:700;color:#404145;margin-bottom:16px; }
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
          .cover { height: 160px !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"#fff",borderBottom:"1px solid #e4e5e7",padding:"14px 24px"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Link href="/" style={{fontSize:"24px",fontWeight:"700",color:"#000",textDecoration:"none"}}>Freelamz<span style={{color:"#1dbf73"}}>.</span></Link>
          <div style={{display:"flex",gap:"16px",alignItems:"center"}}>
            <Link href="/" style={{color:"#404145",textDecoration:"none",fontSize:"14px"}}>Inicio</Link>
            <Link href="/projects" style={{color:"#404145",textDecoration:"none",fontSize:"14px"}}>Projectos</Link>
            <button onClick={()=>{localStorage.clear();window.location.href="/login";}} style={{background:"none",border:"none",color:"#404145",cursor:"pointer",fontSize:"14px"}}>Sair</button>
          </div>
        </div>
      </nav>

      <div style={{maxWidth:"1000px",margin:"0 auto",padding:"24px"}}>
        {/* Cover */}
        <div className="cover" style={{height:"220px",background:"linear-gradient(135deg,#1dbf73,#0a8c55)",borderRadius:"12px 12px 0 0",position:"relative"}}></div>

        {/* Profile Header */}
        <div className="card" style={{borderRadius:"0 0 12px 12px",borderTop:"none",display:"flex",gap:"24px",alignItems:"flex-end",marginBottom:"24px",flexWrap:"wrap"}}>
          <div style={{width:"120px",height:"120px",borderRadius:"50%",background:"#1dbf73",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"48px",fontWeight:"700",border:"4px solid #fff",marginTop:"-60px",flexShrink:0}}>
            {user.name ? user.name[0].toUpperCase() : "?"}
          </div>
          <div style={{flex:1,minWidth:"200px"}}>
            <h1 style={{fontSize:"28px",fontWeight:"700",color:"#404145",marginBottom:"4px"}}>{user.name}</h1>
            <p style={{color:"#74767e",fontSize:"14px"}}>@{user.name?.toLowerCase().replace(/\s/g,"") || "freelancer"} • {user.role === "freelancer" ? "Freelancer" : "Cliente"}</p>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px"}}>
              <span style={{color:"#f5a623"}}>⭐⭐⭐⭐⭐</span>
              <span style={{color:"#74767e",fontSize:"14px"}}>5.0 (12 avaliacoes)</span>
            </div>
          </div>
          <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
            {!editMode && <button className="btn-green" onClick={()=>setEditMode(true)}>Editar perfil</button>}
            <button className="btn-outline">Contactar</button>
          </div>
        </div>

        <div className="profile-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"24px"}}>
          {/* Coluna Esquerda */}
          <div style={{display:"flex",flexDirection:"column",gap:"24px"}}>
            {/* Sobre */}
            <div className="card">
              <h2 className="section-title">Sobre mim</h2>
              {editMode ? (
                <form onSubmit={handleUpdate} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
                  <div>
                    <label style={{display:"block",fontSize:"14px",fontWeight:"600",marginBottom:"6px",color:"#404145"}}>Nome</label>
                    <input type="text" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} style={{width:"100%",padding:"10px 14px",border:"1px solid #e4e5e7",borderRadius:"6px",fontSize:"14px"}}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:"14px",fontWeight:"600",marginBottom:"6px",color:"#404145"}}>Bio</label>
                    <textarea value={formData.bio} onChange={e=>setFormData({...formData,bio:e.target.value})} rows={4} style={{width:"100%",padding:"10px 14px",border:"1px solid #e4e5e7",borderRadius:"6px",fontSize:"14px",resize:"vertical"}}/>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:"14px",fontWeight:"600",marginBottom:"6px",color:"#404145"}}>Skills (separadas por virgula)</label>
                    <input type="text" value={formData.skills} onChange={e=>setFormData({...formData,skills:e.target.value})} style={{width:"100%",padding:"10px 14px",border:"1px solid #e4e5e7",borderRadius:"6px",fontSize:"14px"}}/>
                  </div>
                  <div style={{display:"flex",gap:"12px"}}>
                    <button type="submit" className="btn-green">Guardar</button>
                    <button type="button" className="btn-outline" onClick={()=>setEditMode(false)}>Cancelar</button>
                  </div>
                </form>
              ) : (
                <>
                  <p style={{color:"#74767e",lineHeight:"1.6",marginBottom:"16px"}}>{user.bio || "Este utilizador ainda nao adicionou uma bio."}</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                    {(Array.isArray(user.skills) ? user.skills : user.skills?.split(",") || []).map((skill: string, i: number) => (
                      <span key={i} style={{background:"#f1f1f1",color:"#404145",padding:"6px 14px",borderRadius:"20px",fontSize:"13px",fontWeight:"500"}}>{skill.trim()}</span>
                    ))}
                    {(!user.skills || user.skills.length === 0) && <span style={{color:"#74767e",fontSize:"14px"}}>Nenhuma skill adicionada.</span>}
                  </div>
                </>
              )}
            </div>

            {/* Servicos */}
            <div className="card">
              <h2 className="section-title">Meus servicos</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"16px"}}>
                {[
                  {title:"Website Profissional",price:"2.500 MT",desc:"Sites modernos e responsivos"},
                  {title:"Logo Design",price:"1.500 MT",desc:"Identidade visual completa"},
                  {title:"Social Media",price:"3.000 MT",desc:"Gestao de redes sociais"},
                ].map((s,i)=>(
                  <div key={i} style={{border:"1px solid #e4e5e7",borderRadius:"10px",overflow:"hidden",cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="none"}}>
                    <div style={{height:"120px",background:"linear-gradient(135deg,#1dbf73,#0a8c55)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"40px"}}>💻</div>
                    <div style={{padding:"14px"}}>
                      <p style={{fontSize:"14px",fontWeight:"600",color:"#404145",marginBottom:"6px"}}>{s.title}</p>
                      <p style={{fontSize:"12px",color:"#74767e",marginBottom:"10px"}}>{s.desc}</p>
                      <p style={{fontSize:"14px",fontWeight:"700",color:"#404145"}}>{s.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avaliacoes */}
            <div className="card">
              <h2 className="section-title">Avaliacoes</h2>
              {[
                {name:"Carlos M.",comment:"Excelente trabalho! Entregou antes do prazo.",rating:5},
                {name:"Ana L.",comment:"Muito profissional. Recomendo!",rating:5},
              ].map((r,i)=>(
                <div key={i} style={{borderBottom:"1px solid #f1f1f1",padding:"16px 0"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px"}}>
                    <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"#e4e5e7",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"700",fontSize:"14px"}}>{r.name[0]}</div>
                    <div>
                      <p style={{fontWeight:"600",fontSize:"14px"}}>{r.name}</p>
                      <span style={{color:"#f5a623",fontSize:"13px"}}>{"⭐".repeat(r.rating)}</span>
                    </div>
                  </div>
                  <p style={{color:"#74767e",fontSize:"14px",paddingLeft:"48px"}}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Direita */}
          <div style={{display:"flex",flexDirection:"column",gap:"24px"}}>
            <div className="card">
              <h2 className="section-title">Estatisticas</h2>
              <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
                {[
                  {label:"Projectos concluidos",value:"24"},
                  {label:"Clientes satisfeitos",value:"18"},
                  {label:"Taxa de resposta",value:"98%"},
                  {label:"Membro desde",value:"Jun 2026"},
                ].map((stat,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{color:"#74767e",fontSize:"14px"}}>{stat.label}</span>
                    <span style={{fontWeight:"700",color:"#404145",fontSize:"14px"}}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="section-title">Idiomas</h2>
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {[
                  {lang:"Portugues",level:"Nativo"},
                  {lang:"Ingles",level:"Fluente"},
                  {lang:"Xichangana",level:"Basico"},
                ].map((l,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:"14px",color:"#404145"}}>{l.lang}</span>
                    <span style={{fontSize:"13px",color:"#74767e"}}>{l.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{background:"#003912",color:"#fff",textAlign:"center"}}>
              <h3 style={{fontSize:"18px",fontWeight:"700",marginBottom:"8px"}}>Freelamz Pro</h3>
              <p style={{fontSize:"14px",opacity:0.9,marginBottom:"16px"}}>Destaque o seu perfil e ganhe mais clientes</p>
              <button style={{background:"#fff",color:"#003912",padding:"10px 20px",borderRadius:"6px",fontWeight:"600",border:"none",cursor:"pointer",width:"100%"}}>Ativar Pro</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
