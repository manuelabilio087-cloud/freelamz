"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const CATEGORIES = [
  { name:"Desenvolvimento Web", icon:"💻", desc:"Sites, apps, APIs, e-commerce" },
  { name:"Design Grafico",      icon:"🎨", desc:"Logos, branding, UI/UX" },
  { name:"Marketing Digital",   icon:"📈", desc:"SEO, redes sociais, ads" },
  { name:"Redacao e Traducao",  icon:"✍️", desc:"Artigos, traduções, copywriting" },
  { name:"Video e Animacao",    icon:"🎬", desc:"Edição, motion graphics, YouTube" },
  { name:"Musica e Audio",      icon:"🎵", desc:"Composição, podcast, voz-off" },
  { name:"Servicos de IA",      icon:"🤖", desc:"Automações, chatbots, prompts" },
  { name:"Negocios",            icon:"💼", desc:"Consultoria, financeiro, legal" },
  { name:"Outro",               icon:"🌍", desc:"Outra área não listada" },
];

const DEADLINES = [
  { value:"urgente",  label:"Urgente",   desc:"1 a 3 dias",      icon:"⚡" },
  { value:"curto",    label:"Curto",     desc:"1 a 2 semanas",   icon:"🚀" },
  { value:"medio",    label:"Médio",     desc:"Cerca de 1 mês",  icon:"📅" },
  { value:"longo",    label:"Longo",     desc:"Mais de 1 mês",   icon:"🗓️" },
  { value:"flexivel", label:"Flexível",  desc:"Sem prazo fixo",  icon:"🌊" },
];

const BUDGET_RANGES = [
  { label:"Pequeno",   range:"500 – 2.000 MT",  value:"1000" },
  { label:"Médio",     range:"2.000 – 10.000 MT", value:"5000" },
  { label:"Grande",    range:"10.000 – 30.000 MT", value:"15000" },
  { label:"Personalizado", range:"Definir valor", value:"custom" },
];

const Check = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const Back = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>;
const Tag = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;

export default function NewProject() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [budgetMode, setBudgetMode] = useState("");
  const [project, setProject] = useState({
    title: "", category: "", description: "",
    budget: "", deadline: "", skills: [] as string[],
  });

  const set = (k: string, v: any) => setProject(p => ({...p, [k]: v}));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !project.skills.includes(s) && project.skills.length < 8) {
      set("skills", [...project.skills, s]);
      setSkillInput("");
    }
  };

  const removeSkill = (s: string) => set("skills", project.skills.filter(x => x !== s));

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: project.title, description: project.description,
          budget: project.budget, category: project.category,
          deadline: project.deadline,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erro ao publicar"); setLoading(false); return; }
      router.push("/client-dashboard");
    } catch { setError("Erro de conexão com o servidor"); setLoading(false); }
  };

  const step1Valid = project.title.trim().length >= 10 && project.category;
  const step2Valid = project.description.trim().length >= 30 && project.budget && project.deadline;

  const acc = "#6366f1";
  const grn = "#10b981";

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{background:#f4f5f7!important}
        body{font-family:Inter,-apple-system,sans-serif;color:#111827}
        a{text-decoration:none;color:inherit}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeIn .25s ease}
        .shell{display:grid;grid-template-columns:1fr 380px;min-height:100vh}
        .left{background:#fff;padding:0;display:flex;flex-direction:column}
        .topbar{display:flex;align-items:center;justify-content:space-between;padding:20px 36px;border-bottom:1px solid #e8eaed}
        .logo-txt{font-size:18px;font-weight:700;color:#111827}
        .logo-txt span{color:${acc}}
        .back-btn{display:flex;align-items:center;gap:6px;font-size:14px;color:#6b7280;background:none;border:none;cursor:pointer;font-family:inherit;padding:6px 10px;border-radius:7px;transition:all .15s}
        .back-btn:hover{background:#f4f5f7;color:#111827}
        .step-counter{font-size:13px;color:#6b7280;font-weight:500}
        .prog-wrap{padding:0 36px;background:#fff;border-bottom:1px solid #f0f0f0}
        .prog-steps{display:flex;align-items:center;padding:16px 0;gap:0}
        .prog-step{display:flex;align-items:center;flex:1}
        .ps-circle{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;transition:all .2s}
        .ps-circle.done{background:${grn};color:#fff}
        .ps-circle.active{background:${acc};color:#fff;box-shadow:0 0 0 4px rgba(99,102,241,.2)}
        .ps-circle.idle{background:#f4f5f7;color:#9ca3af;border:2px solid #e8eaed}
        .ps-lbl{font-size:12px;font-weight:600;margin-left:8px;white-space:nowrap}
        .ps-lbl.done{color:${grn}}
        .ps-lbl.active{color:${acc}}
        .ps-lbl.idle{color:#9ca3af}
        .ps-line{flex:1;height:2px;background:#e8eaed;margin:0 8px}
        .ps-line.done{background:${grn}}
        .form-area{flex:1;padding:36px;overflow-y:auto}
        .step-title{font-size:26px;font-weight:800;color:#111827;margin-bottom:6px;letter-spacing:-.5px}
        .step-sub{font-size:15px;color:#6b7280;margin-bottom:32px;line-height:1.5}
        .form-group{margin-bottom:24px}
        .form-label{font-size:13px;font-weight:600;color:#374151;display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
        .form-label span{font-size:12px;color:#9ca3af;font-weight:400}
        .form-input{width:100%;padding:13px 16px;border:1.5px solid #e8eaed;border-radius:10px;font-size:14px;outline:none;font-family:inherit;color:#111827;background:#fff;transition:border .15s}
        .form-input:focus{border-color:${acc}}
        .form-input.error{border-color:#ef4444}
        .char-hint{font-size:12px;color:#9ca3af;margin-top:5px;display:flex;justify-content:space-between}
        .char-ok{color:${grn}}
        textarea.form-input{resize:vertical;min-height:140px;line-height:1.6}
        .cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:8px}
        .cat-card{border:1.5px solid #e8eaed;border-radius:10px;padding:14px 12px;cursor:pointer;transition:all .15s;text-align:center}
        .cat-card:hover{border-color:${acc};background:#fafafe}
        .cat-card.selected{border-color:${acc};background:#eef2ff}
        .cat-icon{font-size:22px;margin-bottom:6px}
        .cat-name{font-size:12px;font-weight:600;color:#374151}
        .cat-desc{font-size:11px;color:#9ca3af;margin-top:2px}
        .cat-card.selected .cat-name{color:${acc}}
        .deadline-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
        .dl-card{border:1.5px solid #e8eaed;border-radius:10px;padding:12px 8px;cursor:pointer;transition:all .15s;text-align:center}
        .dl-card:hover{border-color:${acc}}
        .dl-card.selected{border-color:${acc};background:#eef2ff}
        .dl-icon{font-size:18px;margin-bottom:4px}
        .dl-label{font-size:12px;font-weight:600;color:#374151}
        .dl-desc{font-size:10px;color:#9ca3af;margin-top:2px}
        .dl-card.selected .dl-label{color:${acc}}
        .budget-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:12px}
        .bud-card{border:1.5px solid #e8eaed;border-radius:10px;padding:14px;cursor:pointer;transition:all .15s}
        .bud-card:hover{border-color:${acc}}
        .bud-card.selected{border-color:${acc};background:#eef2ff}
        .bud-label{font-size:13px;font-weight:600;color:#374151;margin-bottom:3px}
        .bud-range{font-size:12px;color:#9ca3af}
        .bud-card.selected .bud-label{color:${acc}}
        .skills-wrap{border:1.5px solid #e8eaed;border-radius:10px;padding:12px;min-height:60px}
        .skills-wrap:focus-within{border-color:${acc}}
        .skills-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
        .skill-tag{display:flex;align-items:center;gap:5px;padding:4px 10px;background:#eef2ff;color:#4f46e5;border-radius:20px;font-size:12px;font-weight:600}
        .skill-x{background:none;border:none;cursor:pointer;color:#6366f1;display:flex;align-items:center;padding:0;font-size:14px;line-height:1}
        .skill-x:hover{color:#ef4444}
        .skill-in{border:none;outline:none;font-size:13px;font-family:inherit;color:#111827;width:100%;background:transparent}
        .skill-hint{font-size:11px;color:#9ca3af;margin-top:5px}
        .btn-next{width:100%;padding:14px;background:linear-gradient(135deg,${acc},#8b5cf6);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .15s;margin-top:4px}
        .btn-next:hover{opacity:.9}
        .btn-next:disabled{opacity:.45;cursor:not-allowed}
        .err-box{background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;font-size:13px;color:#dc2626;margin-bottom:16px}
        .right{background:linear-gradient(160deg,#0f0c29,#302b63,#24243e);padding:40px 32px;display:flex;flex-direction:column;color:#fff;position:sticky;top:0;height:100vh;overflow-y:auto}
        .preview-title{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;opacity:.6;margin-bottom:20px}
        .preview-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;margin-bottom:16px;backdrop-filter:blur(10px)}
        .pc-cat{display:inline-flex;align-items:center;gap:5px;background:rgba(99,102,241,.3);color:#a5b4fc;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;margin-bottom:10px}
        .pc-title{font-size:18px;font-weight:700;line-height:1.3;margin-bottom:8px;color:#fff;min-height:28px}
        .pc-title.empty{color:rgba(255,255,255,.3);font-style:italic;font-size:14px;font-weight:400}
        .pc-desc{font-size:13px;opacity:.65;line-height:1.6;min-height:40px}
        .pc-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:13px}
        .pc-row:last-child{border:none}
        .pc-lbl{opacity:.55}
        .pc-val{font-weight:600;color:#a5b4fc}
        .pc-skills{display:flex;flex-wrap:wrap;gap:5px;margin-top:12px}
        .pc-skill{padding:3px 8px;background:rgba(255,255,255,.1);border-radius:20px;font-size:11px;font-weight:500}
        .tips-box{background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);border-radius:12px;padding:16px}
        .tips-title{font-size:12px;font-weight:700;color:#6ee7b7;margin-bottom:10px;display:flex;align-items:center;gap:6px}
        .tip{font-size:12px;color:rgba(255,255,255,.65);margin-bottom:6px;padding-left:14px;position:relative;line-height:1.5}
        .tip::before{content:"→";position:absolute;left:0;color:#6ee7b7;font-size:11px}
        .est-box{background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);border-radius:12px;padding:16px;margin-bottom:16px}
        .est-val{font-size:28px;font-weight:800;color:#a5b4fc;margin-bottom:4px}
        .est-lbl{font-size:12px;opacity:.6}
        @media(max-width:900px){.shell{grid-template-columns:1fr}.right{display:none}}
        @media(max-width:600px){.form-area{padding:24px 20px}.cat-grid{grid-template-columns:repeat(2,1fr)}.deadline-grid{grid-template-columns:repeat(3,1fr)}}
      `}</style>

      <div className="shell">
        <div className="left">
          <div className="topbar">
            <button className="back-btn" onClick={() => step > 1 ? setStep(step-1) : router.back()}>
              <Back/> {step > 1 ? "Passo anterior" : "Voltar"}
            </button>
            <div className="logo-txt">Freelamz<span>.</span></div>
            <div className="step-counter">Passo {step} de 3</div>
          </div>

          <div className="prog-wrap">
            <div className="prog-steps">
              {[{n:1,l:"Detalhes"},{n:2,l:"Orçamento"},{n:3,l:"Revisão"}].map((s,i) => (
                <div key={s.n} className="prog-step">
                  <div className={`ps-circle ${step>s.n?"done":step===s.n?"active":"idle"}`}>
                    {step>s.n ? <Check/> : s.n}
                  </div>
                  <span className={`ps-lbl ${step>s.n?"done":step===s.n?"active":"idle"}`}>{s.l}</span>
                  {i < 2 && <div className={`ps-line ${step>s.n?"done":""}`}/>}
                </div>
              ))}
            </div>
          </div>

          <div className="form-area">
            {step === 1 && (
              <div className="fade">
                <div className="step-title">Descreve o teu projecto</div>
                <div className="step-sub">Quanto mais detalhes deres, melhores propostas vais receber de freelancers qualificados.</div>

                <div className="form-group">
                  <div className="form-label">Título do projecto <span>{project.title.length}/100</span></div>
                  <input className={`form-input ${project.title.length > 0 && project.title.length < 10 ? "error" : ""}`}
                    type="text" placeholder="Ex: Preciso de um website para o meu restaurante em Maputo"
                    value={project.title} maxLength={100}
                    onChange={e => set("title", e.target.value)} />
                  <div className="char-hint">
                    <span>Seja específico e claro</span>
                    <span className={project.title.length >= 10 ? "char-ok" : ""}>{project.title.length >= 10 ? "✓ Bom" : `${10-project.title.length} caracteres mínimo`}</span>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label">Categoria do projecto</div>
                  <div className="cat-grid">
                    {CATEGORIES.map(c => (
                      <div key={c.name} className={`cat-card ${project.category===c.name?"selected":""}`} onClick={() => set("category", c.name)}>
                        <div className="cat-icon">{c.icon}</div>
                        <div className="cat-name">{c.name}</div>
                        <div className="cat-desc">{c.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label">Skills necessárias <span>opcional · máx. 8</span></div>
                  <div className="skills-wrap">
                    <div className="skills-tags">
                      {project.skills.map(s => (
                        <div key={s} className="skill-tag">
                          <Tag/> {s}
                          <button className="skill-x" onClick={() => removeSkill(s)}>×</button>
                        </div>
                      ))}
                    </div>
                    <input className="skill-in" placeholder={project.skills.length < 8 ? "Ex: React, Figma, SEO... (Enter para adicionar)" : "Limite atingido"}
                      value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      disabled={project.skills.length >= 8}
                      onKeyDown={e => { if (e.key==="Enter"){e.preventDefault();addSkill();}}} />
                  </div>
                  <div className="skill-hint">Pressiona Enter para adicionar cada skill</div>
                </div>

                <button className="btn-next" disabled={!step1Valid} onClick={() => setStep(2)}>
                  Continuar para orçamento →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="fade">
                <div className="step-title">Orçamento e prazo</div>
                <div className="step-sub">Define quanto estás disposto a pagar e quando precisas que o trabalho esteja concluído.</div>

                <div className="form-group">
                  <div className="form-label">Descrição completa <span>{project.description.length} caracteres</span></div>
                  <textarea className="form-input"
                    placeholder="Descreve em detalhe o que precisas. Inclui requisitos específicos, referências visuais, funcionalidades pretendidas, público-alvo, etc."
                    value={project.description} rows={5}
                    onChange={e => set("description", e.target.value)} />
                  <div className="char-hint">
                    <span>Mínimo 30 caracteres</span>
                    <span className={project.description.length >= 30 ? "char-ok" : ""}>{project.description.length >= 30 ? "✓ Bom" : `${30-project.description.length} restantes`}</span>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label">Orçamento (MZN)</div>
                  <div className="budget-grid">
                    {BUDGET_RANGES.map(b => (
                      <div key={b.value} className={`bud-card ${budgetMode===b.value?"selected":""}`}
                        onClick={() => { setBudgetMode(b.value); if(b.value!=="custom") set("budget",b.value); else set("budget",""); }}>
                        <div className="bud-label">{b.label}</div>
                        <div className="bud-range">{b.range}</div>
                      </div>
                    ))}
                  </div>
                  {budgetMode === "custom" && (
                    <input className="form-input" type="number" placeholder="Ex: 7500"
                      value={project.budget} onChange={e => set("budget", e.target.value)} />
                  )}
                </div>

                <div className="form-group">
                  <div className="form-label">Prazo desejado</div>
                  <div className="deadline-grid">
                    {DEADLINES.map(d => (
                      <div key={d.value} className={`dl-card ${project.deadline===d.value?"selected":""}`} onClick={() => set("deadline", d.value)}>
                        <div className="dl-icon">{d.icon}</div>
                        <div className="dl-label">{d.label}</div>
                        <div className="dl-desc">{d.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn-next" disabled={!step2Valid} onClick={() => setStep(3)}>
                  Rever e publicar →
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="fade">
                <div className="step-title">Revê e publica</div>
                <div className="step-sub">Confirma os detalhes do teu projecto antes de o publicar para os freelancers.</div>

                <div style={{background:"#f8f9fc",border:"1.5px solid #e8eaed",borderRadius:"12px",padding:"20px",marginBottom:"20px"}}>
                  <div style={{fontSize:"11px",fontWeight:"600",color:"#9ca3af",textTransform:"uppercase",letterSpacing:".6px",marginBottom:"14px"}}>Resumo do projecto</div>
                  {[
                    {l:"Título",       v:project.title},
                    {l:"Categoria",    v:project.category},
                    {l:"Orçamento",    v:project.budget ? `${Number(project.budget).toLocaleString()} MT` : "—"},
                    {l:"Prazo",        v:DEADLINES.find(d=>d.value===project.deadline)?.label || "—"},
                  ].map((r,i) => (
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #e8eaed",fontSize:"14px"}}>
                      <span style={{color:"#6b7280"}}>{r.l}</span>
                      <span style={{fontWeight:"600",color:"#111827",textAlign:"right",maxWidth:"60%"}}>{r.v}</span>
                    </div>
                  ))}
                  {project.description && (
                    <div style={{paddingTop:"12px",fontSize:"13px",color:"#6b7280",lineHeight:"1.6"}}>
                      <div style={{fontWeight:"600",color:"#374151",marginBottom:"6px"}}>Descrição:</div>
                      {project.description}
                    </div>
                  )}
                  {project.skills.length > 0 && (
                    <div style={{paddingTop:"12px",display:"flex",flexWrap:"wrap",gap:"6px"}}>
                      {project.skills.map((s,i) => <span key={i} style={{padding:"3px 9px",background:"#eef2ff",color:"#4f46e5",borderRadius:"20px",fontSize:"11px",fontWeight:"600"}}>{s}</span>)}
                    </div>
                  )}
                </div>

                <div style={{background:"#ecfdf5",border:"1px solid #6ee7b7",borderRadius:"10px",padding:"14px 16px",marginBottom:"20px",fontSize:"13px",color:"#065f46",display:"flex",alignItems:"flex-start",gap:"10px"}}>
                  <span style={{fontSize:"18px"}}>💡</span>
                  <div>Após publicares, os freelancers poderão enviar propostas. Serás notificado por email quando receberes propostas.</div>
                </div>

                {error && <div className="err-box">{error}</div>}

                <button className="btn-next" disabled={loading} onClick={handleSubmit}>
                  {loading ? "A publicar..." : "🚀 Publicar Projecto"}
                </button>
                <button onClick={() => setStep(2)} style={{width:"100%",padding:"12px",marginTop:"10px",border:"1.5px solid #e8eaed",borderRadius:"10px",background:"#fff",color:"#6b7280",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>
                  Editar detalhes
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="right">
          <div className="preview-title">📋 Pré-visualização</div>

          <div className="preview-card">
            {project.category && <div className="pc-cat">{CATEGORIES.find(c=>c.name===project.category)?.icon} {project.category}</div>}
            <div className={`pc-title ${!project.title?"empty":""}`}>{project.title || "O título do teu projecto vai aparecer aqui..."}</div>
            <div className="pc-desc">{project.description || "A descrição vai aparecer aqui quando começares a escrever..."}</div>
            {project.skills.length > 0 && (
              <div className="pc-skills">{project.skills.map((s,i) => <span key={i} className="pc-skill">{s}</span>)}</div>
            )}
          </div>

          {(project.budget || project.deadline) && (
            <div className="preview-card">
              {project.budget && (
                <div className="pc-row"><span className="pc-lbl">Orçamento</span><span className="pc-val">{Number(project.budget).toLocaleString()} MT</span></div>
              )}
              {project.deadline && (
                <div className="pc-row">
                  <span className="pc-lbl">Prazo</span>
                  <span className="pc-val">{DEADLINES.find(d=>d.value===project.deadline)?.icon} {DEADLINES.find(d=>d.value===project.deadline)?.label}</span>
                </div>
              )}
            </div>
          )}

          <div className="est-box">
            <div className="est-val">~{project.category ? "5–12" : "?"}</div>
            <div className="est-lbl">propostas esperadas nas primeiras 24h</div>
          </div>

          <div className="tips-box">
            <div className="tips-title">💡 Dicas para melhores propostas</div>
            <div className="tip">Sê específico no título — evita "preciso de ajuda"</div>
            <div className="tip">Define um orçamento realista para atrair profissionais sérios</div>
            <div className="tip">Adiciona skills para filtrar freelancers qualificados</div>
            <div className="tip">Descreve o resultado final que esperas</div>
          </div>
        </div>
      </div>
    </>
  );
}