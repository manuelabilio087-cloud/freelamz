"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    experience: "",
    skills: [] as string[],
    availability: "",
    goal: "",
  });

  const skills = ["Desenvolvimento Web", "Design Grafico", "Marketing Digital", "Redacao", "Video", "Musica", "Traducao", "Fotografia", "IA", "Negocios"];

  const toggleSkill = (skill: string) => {
    setAnswers(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #fff; }
        .page { min-height: 100vh; display: flex; flex-direction: column; }
        .topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 1px solid #e4e5e7; }
        .logo { font-size: 24px; font-weight: 700; color: #000; text-decoration: none; }
        .logo span { color: #1dbf73; }
        .back-btn { display: flex; align-items: center; gap: 8px; color: #404145; font-size: 14px; cursor: pointer; background: none; border: none; }
        .progress { height: 4px; background: #e4e5e7; }
        .progress-bar { height: 100%; background: #1dbf73; transition: width 0.3s; }
        .container { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; }
        .box { width: 100%; max-width: 560px; }
        .step-label { font-size: 13px; color: #74767e; margin-bottom: 8px; }
        .box h1 { font-size: 28px; font-weight: 700; color: #404145; margin-bottom: 8px; }
        .box p { color: #74767e; font-size: 14px; margin-bottom: 32px; }
        .options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .option { border: 2px solid #e4e5e7; border-radius: 8px; padding: 16px 20px; cursor: pointer; display: flex; align-items: center; gap: 14px; transition: all 0.2s; font-size: 15px; color: #404145; }
        .option:hover { border-color: #1dbf73; }
        .option.selected { border-color: #1dbf73; background: #f0fdf8; }
        .option-icon { font-size: 24px; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px; }
        .skill-tag { border: 2px solid #e4e5e7; border-radius: 20px; padding: 8px 16px; cursor: pointer; font-size: 13px; font-weight: 500; color: #404145; transition: all 0.2s; }
        .skill-tag:hover { border-color: #1dbf73; }
        .skill-tag.selected { border-color: #1dbf73; background: #1dbf73; color: #fff; }
        .btn-next { width: 100%; padding: 14px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; }
        .btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 600px) { .topbar { padding: 16px; } .container { padding: 24px 16px; } }
      `}</style>
      <div className="page">
        <div className="topbar">
          <button className="back-btn" onClick={() => step > 1 ? setStep(step - 1) : router.back()}>← Voltar</button>
          <Link href="/" className="logo">Freelamz<span>.</span></Link>
          <span style={{fontSize:"13px", color:"#74767e"}}>{step}/4</span>
        </div>

        <div className="progress">
          <div className="progress-bar" style={{width: `${(step/4)*100}%`}}></div>
        </div>

        <div className="container">
          <div className="box">

            {step === 1 && (
              <>
                <p className="step-label">Passo 1 de 4</p>
                <h1>Qual e a tua experiencia?</h1>
                <p>Diz-nos o teu nivel para te ajudar melhor.</p>
                <div className="options">
                  {[
                    {icon:"🌱", label:"Iniciante", desc:"Estou a comecar a minha carreira freelance"},
                    {icon:"⚡", label:"Intermedio", desc:"Ja tenho alguma experiencia com clientes"},
                    {icon:"🏆", label:"Experiente", desc:"Tenho muita experiencia e clientes fixos"},
                  ].map((o, i) => (
                    <div key={i} className={`option ${answers.experience === o.label ? "selected" : ""}`} onClick={() => setAnswers({...answers, experience: o.label})}>
                      <span className="option-icon">{o.icon}</span>
                      <div>
                        <div style={{fontWeight:"600"}}>{o.label}</div>
                        <div style={{fontSize:"13px", color:"#74767e"}}>{o.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-next" disabled={!answers.experience} onClick={() => setStep(2)}>Continuar →</button>
              </>
            )}

            {step === 2 && (
              <>
                <p className="step-label">Passo 2 de 4</p>
                <h1>Quais sao as tuas habilidades?</h1>
                <p>Escolhe todas as areas em que podes trabalhar.</p>
                <div className="skills-grid">
                  {skills.map((s, i) => (
                    <div key={i} className={`skill-tag ${answers.skills.includes(s) ? "selected" : ""}`} onClick={() => toggleSkill(s)}>{s}</div>
                  ))}
                </div>
                <button className="btn-next" disabled={answers.skills.length === 0} onClick={() => setStep(3)}>Continuar →</button>
              </>
            )}

            {step === 3 && (
              <>
                <p className="step-label">Passo 3 de 4</p>
                <h1>Qual e a tua disponibilidade?</h1>
                <p>Quantas horas por semana podes trabalhar?</p>
                <div className="options">
                  {[
                    {icon:"🕐", label:"Menos de 10h/semana", desc:"Trabalho ocasional"},
                    {icon:"🕓", label:"10 a 30h/semana", desc:"Trabalho a tempo parcial"},
                    {icon:"🕗", label:"Mais de 30h/semana", desc:"Trabalho a tempo completo"},
                  ].map((o, i) => (
                    <div key={i} className={`option ${answers.availability === o.label ? "selected" : ""}`} onClick={() => setAnswers({...answers, availability: o.label})}>
                      <span className="option-icon">{o.icon}</span>
                      <div>
                        <div style={{fontWeight:"600"}}>{o.label}</div>
                        <div style={{fontSize:"13px", color:"#74767e"}}>{o.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-next" disabled={!answers.availability} onClick={() => setStep(4)}>Continuar →</button>
              </>
            )}

            {step === 4 && (
              <>
                <p className="step-label">Passo 4 de 4</p>
                <h1>Qual e o teu principal objetivo?</h1>
                <p>Isso ajuda-nos a personalizar a tua experiencia.</p>
                <div className="options">
                  {[
                    {icon:"💰", label:"Ganhar dinheiro extra", desc:"Complementar o meu rendimento actual"},
                    {icon:"🚀", label:"Trabalho a tempo completo", desc:"Quero viver do freelancing"},
                    {icon:"🌍", label:"Expandir o meu negocio", desc:"Tenho uma empresa e quero mais clientes"},
                  ].map((o, i) => (
                    <div key={i} className={`option ${answers.goal === o.label ? "selected" : ""}`} onClick={() => setAnswers({...answers, goal: o.label})}>
                      <span className="option-icon">{o.icon}</span>
                      <div>
                        <div style={{fontWeight:"600"}}>{o.label}</div>
                        <div style={{fontSize:"13px", color:"#74767e"}}>{o.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-next" disabled={!answers.goal} onClick={() => router.push("/profile-setup")}>
                  Completar perfil →
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}