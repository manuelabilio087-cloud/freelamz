"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const CATEGORIES = [
  { name:"Desenvolvimento Web", icon:"ti-device-laptop", desc:"Sites, apps, APIs, e-commerce" },
  { name:"Design Grafico",      icon:"ti-palette",       desc:"Logos, branding, UI/UX" },
  { name:"Marketing Digital",   icon:"ti-trending-up",   desc:"SEO, redes sociais, ads" },
  { name:"Redacao e Traducao",  icon:"ti-pencil",        desc:"Artigos, traduções, copywriting" },
  { name:"Video e Animacao",    icon:"ti-video",         desc:"Edição, motion graphics, YouTube" },
  { name:"Musica e Audio",      icon:"ti-music",         desc:"Composição, podcast, voz-off" },
  { name:"Servicos de IA",      icon:"ti-cpu",           desc:"Automações, chatbots, prompts" },
  { name:"Negocios",            icon:"ti-briefcase",     desc:"Consultoria, financeiro, legal" },
  { name:"Outro",               icon:"ti-world",         desc:"Outra área não listada" },
];

const DEADLINES = [
  { value:"urgente",  label:"Urgente",  desc:"1 a 3 dias",     icon:"ti-bolt" },
  { value:"curto",    label:"Curto",    desc:"1 a 2 semanas",  icon:"ti-rocket" },
  { value:"medio",    label:"Médio",    desc:"Cerca de 1 mês", icon:"ti-calendar" },
  { value:"longo",    label:"Longo",    desc:"Mais de 1 mês",  icon:"ti-calendar-month" },
  { value:"flexivel", label:"Flexível", desc:"Sem prazo fixo", icon:"ti-infinity" },
];

const BUDGET_RANGES = [
  { label:"Pequeno",       range:"500 – 2.000 MT",    value:"1000" },
  { label:"Médio",         range:"2.000 – 10.000 MT", value:"5000" },
  { label:"Grande",        range:"10.000 – 30.000 MT",value:"15000" },
  { label:"Personalizado", range:"Definir valor",      value:"custom" },
];

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
        .back-btn i{font-size:17px}
        .step-counter{font-size:13px;color:#6b7280;font-weight:500}
        .prog-wrap{padding:0 36px;background:#fff;border-bottom:1px solid #f0f0f0}
        .prog-steps{display:flex;align-items:center;padding:16px 0;gap:0}
        .prog-step{display:flex;align-items:center;flex:1}
        .ps-circle{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;transition:all .2s}
        .ps-circle.done{background:${grn};color:#fff}
        .ps-circle.done i{font-size:14px}
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
        .cat-icon{width:40px;height:40px;border-radius:10px;background:#f4f5f7;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;transition:all .15s}
        .cat-icon i{font-size:20px;color:#6b7280;transition:color .15s}
        .cat-card.selected .cat-icon{background:#eef2ff}
        .cat-card.selected .cat-icon i{color:${acc}}
        .cat-name{font-size:12px;font-weight:600;color:#374151}
        .cat-desc{font-size:11px;color:#9ca3af;margin-top:2px}
        .cat-card.selected .cat-name{color:${acc}}
        .deadline-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
        .dl-card{border:1.5px solid #e8eaed;border-radius:10px;padding:12px 8px;cursor:pointer;transition:all .15s;text-align:center}
        .dl-card:hover{border-color:${acc}}
        .dl-card.selected{border-color:${acc};background:#eef2ff}
        .dl-icon{width:36px;height:36px;border-radius:8px;background:#f4f5f7;display:flex;align-items:center;justify-content:center;margin:0 auto 6px;transition:all .15s}
        .dl-icon i{font-size:18px;color:#6b7280;transition:color .15s}
        .dl-card.selected .dl-icon{background:#eef2ff}
        .dl-card.selected .dl-icon i{color:${acc}}
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
        .skill-tag i{font-size:13px}
        .skill-x{background:none;border:none;cursor:pointer;color:#6366f1;display:flex;align-items:center;padding:0;font-size:16px;line-height:1;transition:color .15s}
        .skill-x:hover{color:#ef4444}
        .skill-in{border:none;outline:none;font-size:13px;font-family:inherit;color:#111827;width:100%;background:transparent}
        .skill-hint{font-size:11px;color:#9ca3af;margin-top:5px;display:flex;align-items:center;gap:4px}
        .skill-hint i{font-size:13px}
        .btn-next{width:100%;padding:14px;background:linear-gradient(135deg,${acc},#8b5cf6);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .15s;margin-top:4px;font-family:inherit}
        .btn-next i{font-size:18px}
        .btn-next:hover{opacity:.9}
        .btn-next:disabled{opacity:.45;cursor:not-allowed}
        .err-box{background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;font-size:13px;color:#dc2626;margin-bottom:16px;display:flex;align-items:center;gap:8px}
        .err-box i{font-size:16px;flex-shrink:0}
        .right{background:linear-gradient(160deg,#0f0c29,#302b63,#24243e);padding:40px 32px;display:flex;flex-direction:column;color:#fff;position:sticky;top:0;height:100vh;overflow-y:auto}
        .preview-title{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;opacity:.6;margin-bottom:20px;display:flex;align-items:center;gap:7px}
        .preview-title i{font-size:16px}
        .preview-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:20px;margin-bottom:16px;backdrop-filter:blur(10px)}
        .pc-cat{display:inline-flex;align-items:center;gap:6px;background:rgba(99,102,241,.3);color:#a5b4fc;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;margin-bottom:10px}
        .pc-cat i{font-size:13px}
        .pc-title{font-size:18px;font-weight:700;line-height:1.3;margin-bottom:8px;color:#fff;min-height:28px}
        .pc-title.empty{color:rgba(255,255,255,.3);font-style:italic;font-size:14px;font-weight:400}
        .pc-desc{font-size:13px;opacity:.65;line-height:1.6;min-height:40px}
        .pc-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:13px}
        .pc-row:last-child{border:none}
        .pc-lbl{opacity:.55;display:flex;align-items:center;gap:6px}
        .pc-lbl i{font-size:14px}
        .pc-val{font-weight:600;color:#a5b4fc}
        .pc-skills{display:flex;flex-wrap:wrap;gap:5px;margin-top:12px}
        .pc-skill{padding:3px 8px;background:rgba(255,255,255,.1);border-radius:20px;font-size:11px;font-weight:500}
        .tips-box{background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);border-radius:12px;padding:16px}
        .tips-title{font-size:12px;font-weight:700;color:#6ee7b7;margin-bottom:10px;display:flex;align-items:center;gap:6px}
        .tips-title i{font-size:15px}
        .tip{font-size:12px;color:rgba(255,255,255,.65);margin-bottom:6px;padding-left:20px;position:relative;line-height:1.5}
        .tip i{position:absolute;left:0;top:1px;font-size:13px;color:#6ee7b7}
        .est-box{background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);border-radius:12px;padding:16px;margin-bottom:16px}
        .est-top{display:flex;align-items:center;gap:8px;margin-bottom:4px}
        .est-top i{font-size:20px;color:#a5b4fc}
        .est-val{font-size:28px;font-weight:800;color:#a5b4fc}
        .est-lbl{font-size:12px;opacity:.6}
        .review-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e8eaed;font-size:14px}
        .review-row:last-child{border:none}
        .review-lbl{color:#6b7280;display:flex;align-items:center;gap:6px}
        .review-lbl i{font-size:15px}
        .review-val{font-weight:600;color:#111827;text-align:right;max-width:60%}
        .info-box{background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:14px 16px;margin-bottom:20px;font-size:13px;color:#065f46;display:flex;align-items:flex-start;gap:10px}
        .info-box i{font-size:20px;flex-shrink:0;margin-top:1px}
        .btn-back{width:100%;padding:12px;margin-top:10px;border:1.5px solid #e8eaed;border-radius:10px;background:#fff;color:#6b7280;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .15s}
        .btn-back i{font-size:16px}
        .btn-back:hover{border-color:#6366f1;color:#6366f1}
        @media(max-width:900px){.shell{grid-template-columns:1fr}.right{display:none}}
        @media(max-width:600px){.form-area{padding:24px 20px}.cat-grid{grid-template-columns:repeat(2,1fr)}.deadline-grid{grid-template-columns:repeat(3,1fr)}}
      `}</style>

      <div className="shell">
        <div className="left">
          <div className="topbar">
            <button className="back-btn" onClick={() => step > 1 ? setStep(step-1) : router.back()}>
              <i className="ti ti-arrow-left" aria-hidden="true"></i>
              {step > 1 ? "Passo anterior" : "Voltar"}
            </button>
            <div className="logo-txt">Freelamz<span>.</span></div>
            <div className="step-counter">Passo {step} de 3</div>
          </div>

          <div className="prog-wrap">
            <div className="prog-steps">
              {[{n:1,l:"Detalhes"},{n:2,l:"Orçamento"},{n:3,l:"Revisão"}].map((s,i) => (
                <div key={s.n} className="prog-step">
                  <div className={`ps-circle ${step>s.n?"done":step===s.n?"active":"idle"}`}>
                    {step>s.n ? <i className="ti ti-check" aria-hidden="true"></i> : s.n}
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
                        <div className="cat-icon">
                          <i className={`ti ${c.icon}`} aria-hidden="true"></i>
                        </div>
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
                          <i className="ti ti-tag" aria-hidden="true"></i>
                          {s}
                          <button className="skill-x" onClick={() => removeSkill(s)} aria-label={`Remover ${s}`}>
                            <i className="ti ti-x" aria-hidden="true"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                    <input className="skill-in"
                      placeholder={project.skills.length < 8 ? "Ex: React, Figma, SEO... (Enter para adicionar)" : "Limite atingido"}
                      value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      disabled={project.skills.length >= 8}
                      onKeyDown={e => { if (e.key==="Enter"){e.preventDefault();addSkill();}}} />
                  </div>
                  <div className="skill-hint">
                    <i className="ti ti-corner-down-left" aria-hidden="true"></i>
                    Pressiona Enter para adicionar cada skill
                  </div>
                </div>

                <button className="btn-next" disabled={!step1Valid} onClick={() => setStep(2)}>
                  Continuar para orçamento
                  <i className="ti ti-arrow-right" aria-hidden="true"></i>
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
                        <div className="dl-icon">
                          <i className={`ti ${d.icon}`} aria-hidden="true"></i>
                        </div>
                        <div className="dl-label">{d.label}</div>
                        <div className="dl-desc">{d.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn-next" disabled={!step2Valid} onClick={() => setStep(3)}>
                  Rever e publicar
                  <i className="ti ti-arrow-right" aria-hidden="true"></i>
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="fade">
                <div className="step-title">Revê e publica</div>
                <div className="step-sub">Confirma os detalhes do teu projecto antes de o publicar para os freelancers.</div>

                <div style={{background:"#f8f9fc",border:"1.5px solid #e8eaed",borderRadius:"12px",padding:"20px",marginBottom:"20px"}}>
                  <div style={{fontSize:"11px",fontWeight:"600",color:"#9ca3af",textTransform:"uppercase",letterSpacing:".6px",marginBottom:"14px",display:"flex",alignItems:"center",gap:"6px"}}>
                    <i className="ti ti-clipboard-list" style={{fontSize:"14px"}} aria-hidden="true"></i>
                    Resumo do projecto
                  </div>
                  {[
                    {l:"Título",    v:project.title,    icon:"ti-file-text"},
                    {l:"Categoria", v:project.category, icon:"ti-tag"},
                    {l:"Orçamento", v:project.budget ? `${Number(project.budget).toLocaleString()} MT` : "—", icon:"ti-currency-dollar"},
                    {l:"Prazo",     v:DEADLINES.find(d=>d.value===project.deadline)?.label || "—", icon:"ti-calendar"},
                  ].map((r,i) => (
                    <div key={i} className="review-row">
                      <span className="review-lbl">
                        <i className={`ti ${r.icon}`} aria-hidden="true"></i>
                        {r.l}
                      </span>
                      <span className="review-val">{r.v}</span>
                    </div>
                  ))}
                  {project.description && (
                    <div style={{paddingTop:"12px",fontSize:"13px",color:"#6b7280",lineHeight:"1.6"}}>
                      <div style={{fontWeight:"600",color:"#374151",marginBottom:"6px",display:"flex",alignItems:"center",gap:"6px"}}>
                        <i className="ti ti-align-left" style={{fontSize:"14px"}} aria-hidden="true"></i>
                        Descrição:
                      </div>
                      {project.description}
                    </div>
                  )}
                  {project.skills.length > 0 && (
                    <div style={{paddingTop:"12px",display:"flex",flexWrap:"wrap",gap:"6px"}}>
                      {project.skills.map((s,i) => (
                        <span key={i} style={{padding:"3px 9px",background:"#eef2ff",color:"#4f46e5",borderRadius:"20px",fontSize:"11px",fontWeight:"600"}}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="info-box">
                  <i className="ti ti-info-circle" aria-hidden="true"></i>
                  <div>Após publicares, os freelancers poderão enviar propostas. Serás notificado quando receberes propostas.</div>
                </div>

                {error && (
                  <div className="err-box">
                    <i className="ti ti-alert-circle" aria-hidden="true"></i>
                    {error}
                  </div>
                )}

                <button className="btn-next" disabled={loading} onClick={handleSubmit}>
                  <i className="ti ti-rocket" aria-hidden="true"></i>
                  {loading ? "A publicar..." : "Publicar projecto"}
                </button>
                <button className="btn-back" onClick={() => setStep(2)}>
                  <i className="ti ti-arrow-left" aria-hidden="true"></i>
                  Editar detalhes
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="right">
          <div className="preview-title">
            <i className="ti ti-eye" aria-hidden="true"></i>
            Pré-visualização
          </div>

          <div className="preview-card">
            {project.category && (
              <div className="pc-cat">
                <i className={`ti ${CATEGORIES.find(c=>c.name===project.category)?.icon}`} aria-hidden="true"></i>
                {project.category}
              </div>
            )}
            <div className={`pc-title ${!project.title?"empty":""}`}>
              {project.title || "O título do teu projecto vai aparecer aqui..."}
            </div>
            <div className="pc-desc">
              {project.description || "A descrição vai aparecer aqui quando começares a escrever..."}
            </div>
            {project.skills.length > 0 && (
              <div className="pc-skills">
                {project.skills.map((s,i) => <span key={i} className="pc-skill">{s}</span>)}
              </div>
            )}
          </div>

          {(project.budget || project.deadline) && (
            <div className="preview-card">
              {project.budget && (
                <div className="pc-row">
                  <span className="pc-lbl"><i className="ti ti-currency-dollar" aria-hidden="true"></i> Orçamento</span>
                  <span className="pc-val">{Number(project.budget).toLocaleString()} MT</span>
                </div>
              )}
              {project.deadline && (
                <div className="pc-row">
                  <span className="pc-lbl"><i className="ti ti-calendar" aria-hidden="true"></i> Prazo</span>
                  <span className="pc-val">
                    <i className={`ti ${DEADLINES.find(d=>d.value===project.deadline)?.icon}`} aria-hidden="true"></i>
                    {" "}{DEADLINES.find(d=>d.value===project.deadline)?.label}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="est-box">
            <div className="est-top">
              <i className="ti ti-users" aria-hidden="true"></i>
              <div className="est-val">~{project.category ? "5–12" : "?"}</div>
            </div>
            <div className="est-lbl">propostas esperadas nas primeiras 24h</div>
          </div>

          <div className="tips-box">
            <div className="tips-title">
              <i className="ti ti-bulb" aria-hidden="true"></i>
              Dicas para melhores propostas
            </div>
            {[
              {icon:"ti-cursor-text", txt:"Sê específico no título — evita \"preciso de ajuda\""},
              {icon:"ti-coin",        txt:"Define um orçamento realista para atrair profissionais sérios"},
              {icon:"ti-tags",        txt:"Adiciona skills para filtrar freelancers qualificados"},
              {icon:"ti-target",      txt:"Descreve o resultado final que esperas"},
            ].map((t,i) => (
              <div key={i} className="tip">
                <i className={`ti ${t.icon}`} aria-hidden="true"></i>
                {t.txt}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}