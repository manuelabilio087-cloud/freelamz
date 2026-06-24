"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function NewProject() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [project, setProject] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const categories = ["Desenvolvimento Web","Design Grafico","Marketing Digital","Redacao e Traducao","Video e Animacao","Musica e Audio","Servicos de IA","Negocios","Outro"];

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: project.title, description: project.description, budget: project.budget, category: project.category }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erro ao publicar"); return; }
      router.push("/projects");
    } catch {
      setError("Erro de conexao com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #fff !important; }
        body { font-family: Inter, sans-serif; color: #404145; }
        a { text-decoration: none; color: inherit; }
        .topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 1px solid #e4e5e7; background: #fff; }
        .logo { font-size: 22px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .back-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #404145; display: flex; align-items: center; gap: 6px; }
        .progress { height: 4px; background: #e4e5e7; }
        .progress-bar { height: 100%; background: #1dbf73; transition: width 0.3s; }
        .container { max-width: 680px; margin: 0 auto; padding: 48px 24px; }
        .step-label { font-size: 13px; color: #74767e; margin-bottom: 8px; }
        h1 { font-size: 28px; font-weight: 700; color: #404145; margin-bottom: 8px; }
        .subtitle { font-size: 14px; color: #74767e; margin-bottom: 32px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #404145; margin-bottom: 6px; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 14px; outline: none; color: #404145; font-family: inherit; background: #fff; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: #1dbf73; }
        .form-group textarea { resize: vertical; min-height: 140px; }
        .hint { font-size: 12px; color: #74767e; margin-top: 4px; }
        .cat-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
        .cat-tag { border: 2px solid #e4e5e7; border-radius: 8px; padding: 10px 16px; cursor: pointer; font-size: 13px; font-weight: 500; color: #404145; transition: all 0.2s; }
        .cat-tag:hover { border-color: #1dbf73; }
        .cat-tag.selected { border-color: #1dbf73; background: #e8faf0; color: #1dbf73; }
        .price-row { display: flex; gap: 16px; }
        .price-row .form-group { flex: 1; }
        .btn-next { width: 100%; padding: 14px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 8px; }
        .btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
        .error { color: #e53e3e; font-size: 13px; margin-bottom: 12px; }
        .preview-box { background: #f9f9f9; border: 1px solid #e4e5e7; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
        .preview-box h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
        .preview-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e4e5e7; font-size: 14px; }
        .preview-row:last-child { border-bottom: none; }
        .preview-label { color: #74767e; }
        .preview-value { font-weight: 500; color: #404145; }
        @media (max-width: 600px) {
          .topbar { padding: 16px; }
          .container { padding: 32px 16px; }
          .price-row { flex-direction: column; }
        }
      `}</style>

      <div className="topbar">
        <button className="back-btn" onClick={() => step > 1 ? setStep(step-1) : router.back()}>← Voltar</button>
        <Link href="/" className="logo">Freelamz<span>.</span></Link>
        <span style={{fontSize:"13px",color:"#74767e"}}>{step}/3</span>
      </div>

      <div className="progress">
        <div className="progress-bar" style={{width:`${(step/3)*100}%`}}></div>
      </div>

      <div className="container">

        {step === 1 && (
          <>
            <p className="step-label">Passo 1 de 3</p>
            <h1>Descreve o teu projecto</h1>
            <p className="subtitle">Quanto mais detalhes deres, melhores propostas vais receber.</p>

            <div className="form-group">
              <label>Titulo do projecto</label>
              <input type="text" placeholder="Ex: Preciso de um website para o meu restaurante" value={project.title} onChange={e => setProject({...project, title: e.target.value})} />
              <p className="hint">Seja especifico e claro</p>
            </div>

            <div className="form-group">
              <label>Categoria</label>
            </div>
            <div className="cat-grid">
              {categories.map((c,i) => (
                <div key={i} className={`cat-tag ${project.category === c ? "selected" : ""}`} onClick={() => setProject({...project, category: c})}>{c}</div>
              ))}
            </div>

            <button className="btn-next" disabled={!project.title || !project.category} onClick={() => setStep(2)}>Continuar →</button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="step-label">Passo 2 de 3</p>
            <h1>Mais detalhes</h1>
            <p className="subtitle">Descreve o que precisas e define o orcamento.</p>

            <div className="form-group">
              <label>Descricao completa</label>
              <textarea placeholder="Descreve em detalhe o que precisas, incluindo requisitos especificos, estilo, funcionalidades, etc..." value={project.description} onChange={e => setProject({...project, description: e.target.value})} />
              <p className="hint">Minimo 50 caracteres. Actualmente: {project.description.length}</p>
            </div>

            <div className="price-row">
              <div className="form-group">
                <label>Orcamento (MZN)</label>
                <input type="number" placeholder="Ex: 5000" value={project.budget} onChange={e => setProject({...project, budget: e.target.value})} />
                <p className="hint">Valor que estás disposto a pagar</p>
              </div>
              <div className="form-group">
                <label>Prazo desejado</label>
                <select value={project.deadline} onChange={e => setProject({...project, deadline: e.target.value})}>
                  <option value="">Seleccionar...</option>
                  <option value="urgente">Urgente (1-3 dias)</option>
                  <option value="curto">Curto (1-2 semanas)</option>
                  <option value="medio">Medio (1 mes)</option>
                  <option value="longo">Longo (mais de 1 mes)</option>
                  <option value="flexivel">Flexivel</option>
                </select>
              </div>
            </div>

            <button className="btn-next" disabled={project.description.length < 20 || !project.budget} onClick={() => setStep(3)}>Continuar →</button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="step-label">Passo 3 de 3</p>
            <h1>Confirma e publica</h1>
            <p className="subtitle">Revê os detalhes antes de publicar.</p>

            <div className="preview-box">
              <h3>Resumo do projecto</h3>
              <div className="preview-row">
                <span className="preview-label">Titulo</span>
                <span className="preview-value">{project.title}</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Categoria</span>
                <span className="preview-value">{project.category}</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Orcamento</span>
                <span className="preview-value">{Number(project.budget).toLocaleString()} MT</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Prazo</span>
                <span className="preview-value">{project.deadline || "Flexivel"}</span>
              </div>
            </div>

            {error && <p className="error">{error}</p>}

            <button className="btn-next" disabled={loading} onClick={handleSubmit}>
              {loading ? "A publicar..." : "🚀 Publicar Projecto"}
            </button>
          </>
        )}

      </div>
    </>
  );
}