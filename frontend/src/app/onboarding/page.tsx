"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

const AREAS = [
  { value: "web", label: "Desenvolvimento Web", icon: "💻" },
  { value: "mobile", label: "Apps Mobile", icon: "📱" },
  { value: "design", label: "Design Grafico", icon: "🎨" },
  { value: "marketing", label: "Marketing Digital", icon: "📈" },
  { value: "video", label: "Video e Animacao", icon: "🎬" },
  { value: "writing", label: "Redacao e Traducao", icon: "✍️" },
  { value: "ai", label: "Servicos de IA", icon: "🤖" },
  { value: "business", label: "Negocios", icon: "💼" },
];

const LEVELS = [
  { value: "junior", label: "Junior", desc: "Menos de 2 anos", icon: "🌱" },
  { value: "mid", label: "Medio", desc: "2 a 5 anos", icon: "⚡" },
  { value: "senior", label: "Senior", desc: "Mais de 5 anos", icon: "🏆" },
];

const ALL_SKILLS: Record<string, string[]> = {
  web: ["React", "Next.js", "Vue.js", "Angular", "Node.js", "PHP", "Laravel", "WordPress", "HTML/CSS", "TypeScript"],
  mobile: ["Flutter", "React Native", "Android", "iOS", "Kotlin", "Swift"],
  design: ["Figma", "Photoshop", "Illustrator", "Canva", "After Effects", "Premiere"],
  marketing: ["SEO", "Google Ads", "Facebook Ads", "Email Marketing", "Instagram", "TikTok"],
  video: ["Premiere", "After Effects", "DaVinci Resolve", "Final Cut", "Motion Graphics"],
  writing: ["Copywriting", "Traducao PT/EN", "Redacao Academica", "Blog", "Roteiros"],
  ai: ["ChatGPT", "Midjourney", "Automacoes", "Python", "Machine Learning"],
  business: ["Gestao de Projectos", "Excel", "Power BI", "Consultoria", "Vendas"],
};

const EXPERIENCE = [
  { value: "0-1", label: "Menos de 1 ano", icon: "🔰" },
  { value: "1-3", label: "1 a 3 anos", icon: "📚" },
  { value: "3-5", label: "3 a 5 anos", icon: "💪" },
  { value: "5+", label: "Mais de 5 anos", icon: "🎯" },
];

const OBJECTIVES = [
  { value: "extra", label: "Ganhar dinheiro extra", desc: "Complementar o meu rendimento actual", icon: "💰" },
  { value: "fulltime", label: "Trabalho a tempo completo", desc: "Quero viver do freelancing", icon: "🚀" },
  { value: "business", label: "Expandir o meu negocio", desc: "Tenho uma empresa e quero mais clientes", icon: "🌍" },
];

const AVAILABILITY = [
  { value: "10", label: "Menos de 10h/semana", icon: "🕐" },
  { value: "20", label: "10 a 20h/semana", icon: "🕑" },
  { value: "40", label: "20 a 40h/semana", icon: "🕒" },
  { value: "full", label: "Disponivel a tempo inteiro", icon: "🟢" },
];

const DURATION = [
  { value: "short", label: "Projectos curtos", desc: "1 a 2 semanas", icon: "⚡" },
  { value: "mid", label: "Projectos medios", desc: "1 a 3 meses", icon: "📅" },
  { value: "long", label: "Projectos longos", desc: "Mais de 3 meses", icon: "🏗️" },
  { value: "any", label: "Qualquer tipo", desc: "Estou aberto a tudo", icon: "✅" },
];

const COMMUNICATION = [
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
  { value: "email", label: "Email", icon: "📧" },
  { value: "chat", label: "Chat da plataforma", icon: "🖥️" },
  { value: "all", label: "Qualquer canal", icon: "📡" },
];

const STEPS = [
  "Foto de perfil",
  "Area principal",
  "Nivel de experiencia",
  "As tuas skills",
  "Anos de experiencia",
  "Objectivo principal",
  "Disponibilidade",
  "Taxa por hora",
  "Tipo de projectos",
  "Comunicacao preferida",
  "Portfolio e links",
  "A tua bio",
];

const CLIENT_INTENT = [
  { value: "onetime", label: "Um projecto pontual", desc: "Preciso de algo feito uma vez", icon: "🎯" },
  { value: "recurring", label: "Preciso de ajuda recorrente", desc: "Vou contratar com regularidade", icon: "🔁" },
  { value: "team", label: "Montar uma equipa", desc: "Quero vários freelancers para o meu negócio", icon: "👥" },
];

const BUDGET_RANGES = [
  { value: "low", label: "Até 5.000 MT", desc: "Tarefas simples e rápidas", icon: "💵" },
  { value: "mid", label: "5.000 - 20.000 MT", desc: "Projectos de média dimensão", icon: "💰" },
  { value: "high", label: "20.000 - 50.000 MT", desc: "Projectos mais completos", icon: "💎" },
  { value: "enterprise", label: "50.000 MT+", desc: "Projectos grandes ou continuos", icon: "🏢" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("freelancer");
  const [clientStep, setClientStep] = useState(1);
  const [clientForm, setClientForm] = useState({ avatar: "", intent: "", categories: [] as string[], budget: "", bio: "" });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [form, setForm] = useState({
    avatar: "",
    area: "",
    level: "",
    skills: [] as string[],
    experience: "",
    objective: "",
    availability: "",
    hourlyRate: "",
    projectDuration: "",
    communication: "",
    github: "",
    linkedin: "",
    portfolio: "",
    bio: "",
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css";
    document.head.appendChild(link);
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    const parsed = JSON.parse(u);
    setUserRole(parsed.role || "freelancer");
  }, []);

  const handleClientAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatarPreview(result);
      setClientForm(f => ({ ...f, avatar: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleClientFinish = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          avatar: clientForm.avatar || undefined,
          bio: clientForm.bio,
          location: "Mocambique",
          client_preferences: {
            intent: clientForm.intent,
            categories: clientForm.categories,
            budget: clientForm.budget,
          },
        }),
      });
      const updatedUser = await res.json();
      if (updatedUser && updatedUser.id) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...currentUser, ...updatedUser }));
      }
      localStorage.setItem("onboarding_done", "true");
      router.push("/search/gigs");
    } catch {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / 12) * 100;

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatarPreview(result);
      setForm(f => ({ ...f, avatar: result }));
    };
    reader.readAsDataURL(file);
  };

  const toggleSkill = (skill: string) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : f.skills.length < 8 ? [...f.skills, skill] : f.skills,
    }));
  };

  const canNext = () => {
    if (step === 1) return true;
    if (step === 2) return !!form.area;
    if (step === 3) return !!form.level;
    if (step === 4) return form.skills.length > 0;
    if (step === 5) return !!form.experience;
    if (step === 6) return !!form.objective;
    if (step === 7) return !!form.availability;
    if (step === 8) return !!form.hourlyRate;
    if (step === 9) return !!form.projectDuration;
    if (step === 10) return !!form.communication;
    if (step === 11) return true;
    if (step === 12) return form.bio.length >= 10;
    return true;
  };

  const handleFinish = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          avatar: form.avatar,
          bio: form.bio,
          skills: JSON.stringify(form.skills),
          location: "Mocambique",
          hourly_rate: form.hourlyRate,
          experience: form.experience,
          level: form.level,
          area: form.area,
          availability: form.availability,
          objective: form.objective,
          project_duration: form.projectDuration,
          communication: form.communication,
          github: form.github,
          linkedin: form.linkedin,
          portfolio: form.portfolio,
        }),
      });
      localStorage.setItem("onboarding_done", "true");
      router.push(user.role === "client" ? "/client-dashboard" : "/dashboard");
    } catch {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "4px solid #e8eaed", cursor: "pointer", position: "relative" }}
              onClick={() => document.getElementById("avatar-input")?.click()}>
              {avatarPreview
                ? <img src={avatarPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 48 }}>📷</span>}
              <div style={{ position: "absolute", bottom: 4, right: 4, width: 32, height: 32, background: "#6366f1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                <i className="ti ti-camera" style={{ color: "#fff", fontSize: 16 }}></i>
              </div>
            </div>
            <input id="avatar-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>Clica para adicionar a tua foto</p>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>Perfis com foto recebem 3x mais propostas</p>
          </div>
        );

      case 2:
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {AREAS.map(a => (
              <div key={a.value} onClick={() => setForm(f => ({ ...f, area: a.value, skills: [] }))}
                style={{ padding: "16px 14px", borderRadius: 12, border: `2px solid ${form.area === a.value ? "#6366f1" : "#e8eaed"}`, background: form.area === a.value ? "#eef2ff" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "all .15s" }}>
                <span style={{ fontSize: 24 }}>{a.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: form.area === a.value ? "#4f46e5" : "#374151" }}>{a.label}</span>
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {LEVELS.map(l => (
              <div key={l.value} onClick={() => setForm(f => ({ ...f, level: l.value }))}
                style={{ padding: "18px 20px", borderRadius: 12, border: `2px solid ${form.level === l.value ? "#6366f1" : "#e8eaed"}`, background: form.level === l.value ? "#eef2ff" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all .15s" }}>
                <span style={{ fontSize: 32 }}>{l.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: form.level === l.value ? "#4f46e5" : "#111827" }}>{l.label}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{l.desc}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 4:
        const skills = ALL_SKILLS[form.area] || ALL_SKILLS.web;
        return (
          <div>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Escolhe ate 8 skills ({form.skills.length}/8)</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {skills.map(s => (
                <div key={s} onClick={() => toggleSkill(s)}
                  style={{ padding: "8px 16px", borderRadius: 20, border: `2px solid ${form.skills.includes(s) ? "#6366f1" : "#e8eaed"}`, background: form.skills.includes(s) ? "#6366f1" : "#fff", color: form.skills.includes(s) ? "#fff" : "#374151", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .15s" }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {EXPERIENCE.map(e => (
              <div key={e.value} onClick={() => setForm(f => ({ ...f, experience: e.value }))}
                style={{ padding: "16px 20px", borderRadius: 12, border: `2px solid ${form.experience === e.value ? "#6366f1" : "#e8eaed"}`, background: form.experience === e.value ? "#eef2ff" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all .15s" }}>
                <span style={{ fontSize: 28 }}>{e.icon}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: form.experience === e.value ? "#4f46e5" : "#111827" }}>{e.label}</span>
              </div>
            ))}
          </div>
        );

      case 6:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {OBJECTIVES.map(o => (
              <div key={o.value} onClick={() => setForm(f => ({ ...f, objective: o.value }))}
                style={{ padding: "18px 20px", borderRadius: 12, border: `2px solid ${form.objective === o.value ? "#6366f1" : "#e8eaed"}`, background: form.objective === o.value ? "#eef2ff" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all .15s" }}>
                <span style={{ fontSize: 32 }}>{o.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: form.objective === o.value ? "#4f46e5" : "#111827" }}>{o.label}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{o.desc}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 7:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {AVAILABILITY.map(a => (
              <div key={a.value} onClick={() => setForm(f => ({ ...f, availability: a.value }))}
                style={{ padding: "16px 20px", borderRadius: 12, border: `2px solid ${form.availability === a.value ? "#6366f1" : "#e8eaed"}`, background: form.availability === a.value ? "#eef2ff" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all .15s" }}>
                <span style={{ fontSize: 28 }}>{a.icon}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: form.availability === a.value ? "#4f46e5" : "#111827" }}>{a.label}</span>
              </div>
            ))}
          </div>
        );

      case 8:
        return (
          <div>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15, fontWeight: 700, color: "#6b7280" }}>MT</span>
              <input
                type="number"
                placeholder="ex: 500"
                value={form.hourlyRate}
                onChange={e => setForm(f => ({ ...f, hourlyRate: e.target.value }))}
                style={{ width: "100%", padding: "16px 16px 16px 50px", borderRadius: 12, border: "2px solid #e8eaed", fontSize: 20, fontWeight: 700, color: "#111827", outline: "none", fontFamily: "inherit" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {["150", "300", "500", "800", "1200", "2000"].map(v => (
                <div key={v} onClick={() => setForm(f => ({ ...f, hourlyRate: v }))}
                  style={{ padding: "10px", borderRadius: 10, border: `2px solid ${form.hourlyRate === v ? "#6366f1" : "#e8eaed"}`, background: form.hourlyRate === v ? "#eef2ff" : "#fff", cursor: "pointer", textAlign: "center", fontSize: 14, fontWeight: 600, color: form.hourlyRate === v ? "#4f46e5" : "#374151" }}>
                  {v} MT
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12, textAlign: "center" }}>Media no mercado mocambicano: 300-800 MT/hora</p>
          </div>
        );

      case 9:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {DURATION.map(d => (
              <div key={d.value} onClick={() => setForm(f => ({ ...f, projectDuration: d.value }))}
                style={{ padding: "16px 20px", borderRadius: 12, border: `2px solid ${form.projectDuration === d.value ? "#6366f1" : "#e8eaed"}`, background: form.projectDuration === d.value ? "#eef2ff" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all .15s" }}>
                <span style={{ fontSize: 28 }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: form.projectDuration === d.value ? "#4f46e5" : "#111827" }}>{d.label}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 10:
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {COMMUNICATION.map(c => (
              <div key={c.value} onClick={() => setForm(f => ({ ...f, communication: c.value }))}
                style={{ padding: "20px 16px", borderRadius: 12, border: `2px solid ${form.communication === c.value ? "#6366f1" : "#e8eaed"}`, background: form.communication === c.value ? "#eef2ff" : "#fff", cursor: "pointer", textAlign: "center", transition: "all .15s" }}>
                <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: form.communication === c.value ? "#4f46e5" : "#374151" }}>{c.label}</span>
              </div>
            ))}
          </div>
        );

      case 11:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { key: "github", label: "GitHub", placeholder: "https://github.com/teu-username", icon: "🐙" },
              { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/teu-perfil", icon: "💼" },
              { key: "portfolio", label: "Portfolio/Site", placeholder: "https://teu-site.com", icon: "🌐" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span>{f.icon}</span> {f.label} <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span>
                </label>
                <input
                  type="url"
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "2px solid #e8eaed", fontSize: 14, color: "#111827", outline: "none", fontFamily: "inherit" }}
                />
              </div>
            ))}
          </div>
        );

      case 12:
        return (
          <div>
            <textarea
              placeholder="Ex: Developer full-stack com 3 anos de experiencia em React e Node.js, focado em criar solucoes digitais para o mercado mocambicano."
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value.slice(0, 200) }))}
              rows={5}
              style={{ width: "100%", padding: "16px", borderRadius: 12, border: "2px solid #e8eaed", fontSize: 14, color: "#111827", outline: "none", fontFamily: "inherit", resize: "none", lineHeight: 1.6 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Minimo 10 caracteres</span>
              <span style={{ fontSize: 12, color: form.bio.length > 180 ? "#ef4444" : "#9ca3af" }}>{form.bio.length}/200</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const titles = [
    "Adiciona a tua foto",
    "Qual e a tua area principal?",
    "Qual e o teu nivel?",
    "Quais sao as tuas skills?",
    "Quantos anos de experiencia?",
    "Qual e o teu objectivo?",
    "Qual e a tua disponibilidade?",
    "Qual e a tua taxa por hora?",
    "Que tipo de projectos preferes?",
    "Como preferes comunicar?",
    "Tens portfolio ou links?",
    "Descreve-te em 1 frase",
  ];

  const subtitles = [
    "Uma boa foto aumenta as tuas hipoteses de ser contratado",
    "Isto define o teu perfil na plataforma",
    "Ajuda os clientes a escolher o freelancer certo",
    "Escolhe as tecnologias e ferramentas que dominas",
    "Quantos anos trabalhas nesta area?",
    "O que te trouxe ao Freelamz?",
    "Quantas horas por semana tens disponivel?",
    "Quanto cobras por hora de trabalho?",
    "Que tipo de projectos se adapta melhor a ti?",
    "Como queres que os clientes te contactem?",
    "Mostra o teu trabalho anterior (opcional)",
    "Esta frase aparece no teu cartao de freelancer",
  ];

  if (userRole === "client") {
    const clientCanNext = () => {
      if (clientStep === 1) return true;
      if (clientStep === 2) return !!clientForm.intent;
      if (clientStep === 3) return clientForm.categories.length > 0;
      if (clientStep === 4) return !!clientForm.budget;
      if (clientStep === 5) return clientForm.bio.length >= 5;
      return true;
    };
    const toggleCategory = (value: string) => {
      setClientForm(f => ({
        ...f,
        categories: f.categories.includes(value) ? f.categories.filter(c => c !== value) : [...f.categories, value],
      }));
    };
    return (
      <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "Inter,-apple-system,sans-serif" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e8eaed", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Freel<span style={{ color: "#6366f1" }}>amz</span></span>
          <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>Passo {clientStep} de 5</span>
        </div>
        <div style={{ maxWidth: 460, margin: "48px auto", padding: "0 20px" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #e8eaed" }}>
            {clientStep === 1 && (
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>A tua foto de perfil</h2>
                <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Ajuda os freelancers a confiar em ti</p>
                <div style={{ width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "4px solid #e8eaed", cursor: "pointer" }}
                  onClick={() => document.getElementById("client-avatar-input")?.click()}>
                  {avatarPreview
                    ? <img src={avatarPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: 42 }}>📷</span>}
                </div>
                <input id="client-avatar-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleClientAvatar} />
              </div>
            )}
            {clientStep === 2 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>O que procuras?</h2>
                <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Isto ajuda-nos a mostrar-te os freelancers certos</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {CLIENT_INTENT.map(o => (
                    <div key={o.value} onClick={() => setClientForm(f => ({ ...f, intent: o.value }))}
                      style={{ padding: "16px 18px", borderRadius: 12, border: `2px solid ${clientForm.intent === o.value ? "#6366f1" : "#e8eaed"}`, background: clientForm.intent === o.value ? "#eef2ff" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontSize: 26 }}>{o.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: clientForm.intent === o.value ? "#4f46e5" : "#111827" }}>{o.label}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{o.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {clientStep === 3 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Que tipo de serviço procuras?</h2>
                <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>Escolhe uma ou mais areas (podes mudar depois)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {AREAS.map(a => (
                    <div key={a.value} onClick={() => toggleCategory(a.value)}
                      style={{ padding: "14px 12px", borderRadius: 10, border: `2px solid ${clientForm.categories.includes(a.value) ? "#6366f1" : "#e8eaed"}`, background: clientForm.categories.includes(a.value) ? "#eef2ff" : "#fff", cursor: "pointer", textAlign: "center" }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{a.icon}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: clientForm.categories.includes(a.value) ? "#4f46e5" : "#111827" }}>{a.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {clientStep === 4 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Qual e o teu orçamento habitual?</h2>
                <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Ajuda-nos a mostrar-te pacotes dentro do teu alcance</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {BUDGET_RANGES.map(o => (
                    <div key={o.value} onClick={() => setClientForm(f => ({ ...f, budget: o.value }))}
                      style={{ padding: "16px 18px", borderRadius: 12, border: `2px solid ${clientForm.budget === o.value ? "#6366f1" : "#e8eaed"}`, background: clientForm.budget === o.value ? "#eef2ff" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontSize: 26 }}>{o.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: clientForm.budget === o.value ? "#4f46e5" : "#111827" }}>{o.label}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{o.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {clientStep === 5 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Conta-nos sobre o teu negócio</h2>
                <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>Vai aparecer no teu perfil de cliente</p>
                <textarea
                  value={clientForm.bio}
                  onChange={(e) => setClientForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Ex: Tenho um restaurante em Maputo e preciso de ajuda com marketing digital..."
                  style={{ width: "100%", padding: 12, border: "1px solid #e4e5e7", borderRadius: 8, minHeight: 100, fontSize: 14, resize: "vertical", fontFamily: "inherit" }}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              {clientStep > 1 && (
                <button onClick={() => setClientStep(s => s - 1)} style={{ padding: "12px 20px", borderRadius: 8, border: "1px solid #e4e5e7", background: "#fff", fontWeight: 600, cursor: "pointer" }}>Voltar</button>
              )}
              <button
                onClick={() => clientStep < 5 ? setClientStep(s => s + 1) : handleClientFinish()}
                disabled={!clientCanNext() || loading}
                style={{ flex: 1, padding: "12px 20px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontWeight: 700, cursor: "pointer", opacity: (!clientCanNext() || loading) ? 0.5 : 1 }}
              >
                {loading ? "A concluir..." : clientStep < 5 ? "Continuar" : "Concluir e explorar serviços"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "Inter,-apple-system,sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8eaed", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Freel<span style={{ color: "#6366f1" }}>amz</span></span>
        <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>Passo {step} de 12</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: "#e8eaed" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", transition: "width .4s ease", borderRadius: "0 4px 4px 0" }} />
      </div>

      {/* Steps indicator */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8eaed", padding: "12px 24px", overflowX: "auto", display: "flex", gap: 6 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: i + 1 < step ? "#6366f1" : i + 1 === step ? "#6366f1" : "#e8eaed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: i + 1 <= step ? "#fff" : "#9ca3af", fontWeight: 700 }}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            {i < 11 && <div style={{ width: 20, height: 2, background: i + 1 < step ? "#6366f1" : "#e8eaed" }} />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8, letterSpacing: "-0.5px" }}>{titles[step - 1]}</h1>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>{subtitles[step - 1]}</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e8eaed", marginBottom: 24 }}>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{ flex: 1, padding: "14px", borderRadius: 12, border: "2px solid #e8eaed", background: "#fff", fontSize: 15, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
              Voltar
            </button>
          )}
          {step < 12 ? (
            <button onClick={() => canNext() && setStep(s => s + 1)}
              style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: canNext() ? "#6366f1" : "#e8eaed", fontSize: 15, fontWeight: 700, color: canNext() ? "#fff" : "#9ca3af", cursor: canNext() ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all .15s" }}>
              Continuar
            </button>
          ) : (
            <button onClick={handleFinish} disabled={!canNext() || loading}
              style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none", background: canNext() && !loading ? "#6366f1" : "#e8eaed", fontSize: 15, fontWeight: 700, color: canNext() && !loading ? "#fff" : "#9ca3af", cursor: canNext() && !loading ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
              {loading ? "A guardar..." : "Concluir perfil 🚀"}
            </button>
          )}
        </div>

        {step === 1 && (
          <button onClick={() => setStep(2)} style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 12, border: "none", background: "none", fontSize: 14, color: "#9ca3af", cursor: "pointer", fontFamily: "inherit" }}>
            Saltar por agora
          </button>
        )}
      </div>
    </div>
  );
}