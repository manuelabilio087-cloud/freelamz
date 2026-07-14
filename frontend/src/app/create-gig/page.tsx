"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "https://freelamz-production.up.railway.app/api";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function CreateGig() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [gig, setGig] = useState({
    title: "",
    categoryId: "",
    categoryName: "",
    description: "",
    tags: "",
    image: "",
    price: "",
    delivery: "",
    revisions: "1",
    packageDescription: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setCheckingAuth(false);

    fetch(`${API_URL}/categories`)
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/gigs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: gig.title,
          category: gig.categoryName,
          category_id: gig.categoryId || null,
          description: gig.description,
          image: gig.image || null,
          tags: gig.tags,
          packages: [
            {
              type: "standard",
              title: "Pacote Standard",
              description: gig.packageDescription || gig.description.slice(0, 140),
              price: Number(gig.price),
              delivery_days: Number(gig.delivery),
              revisions: Number(gig.revisions),
              features: gig.tags,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Erro ao publicar o servico.");
        setLoading(false);
        return;
      }
      router.push(`/gig/${data.gig.id}`);
    } catch {
      setError("Erro de ligacao ao servidor. Tenta novamente.");
      setLoading(false);
    }
  };

  if (checkingAuth) return null;

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #fff; }
        .page { min-height: 100vh; display: flex; flex-direction: column; }
        .topbar { display: flex; align-items: center; justify-content: space-between; padding: 20px 32px; border-bottom: 1px solid #e4e5e7; }
        .logo { font-size: 24px; font-weight: 700; color: #000; text-decoration: none; }
        .logo span { color: #1dbf73; }
        .back-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #404145; }
        .progress { height: 4px; background: #e4e5e7; }
        .progress-bar { height: 100%; background: #1dbf73; transition: width 0.3s; }
        .container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .box { width: 100%; max-width: 560px; }
        .step-label { font-size: 13px; color: #74767e; margin-bottom: 8px; }
        .box h1 { font-size: 28px; font-weight: 700; color: #404145; margin-bottom: 8px; }
        .box p { color: #74767e; font-size: 14px; margin-bottom: 28px; }
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #404145; margin-bottom: 6px; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 4px; font-size: 14px; outline: none; color: #404145; font-family: inherit; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: #1dbf73; }
        .form-group textarea { resize: vertical; min-height: 120px; }
        .cat-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
        .cat-tag { border: 2px solid #e4e5e7; border-radius: 20px; padding: 8px 16px; cursor: pointer; font-size: 13px; font-weight: 500; color: #404145; transition: all 0.2s; }
        .cat-tag:hover { border-color: #1dbf73; }
        .cat-tag.selected { border-color: #1dbf73; background: #1dbf73; color: #fff; }
        .price-row { display: flex; gap: 16px; }
        .price-row .form-group { flex: 1; }
        .btn-next { width: 100%; padding: 14px; background: #1dbf73; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; }
        .btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
        .err-box { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 10px 14px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; }
        @media (max-width: 600px) { .topbar { padding: 16px; } .price-row { flex-direction: column; } }
      `}</style>
      <div className="page">
        <div className="topbar">
          <button className="back-btn" onClick={() => step > 1 ? setStep(step - 1) : router.back()}>← Voltar</button>
          <Link href="/" className="logo">Freelamz<span>.</span></Link>
          <span style={{fontSize:"13px", color:"#74767e"}}>{step}/4</span>
        </div>
        <div className="progress">
          <div className="progress-bar" style={{width:`${(step/4)*100}%`}}></div>
        </div>
        <div className="container">
          <div className="box">

            {error && <div className="err-box">{error}</div>}

            {step === 1 && (
              <>
                <p className="step-label">Passo 1 de 4</p>
                <h1>Cria o teu Servico</h1>
                <p>Da um titulo claro e escolhe a categoria certa.</p>
                <div className="form-group">
                  <label>Titulo do Servico</label>
                  <input type="text" placeholder="Ex: Vou criar o teu website profissional" value={gig.title} onChange={e => setGig({...gig, title: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Categoria</label>
                </div>
                <div className="cat-grid">
                  {(categories.length > 0 ? categories : []).map((c) => (
                    <div key={c.id} className={`cat-tag ${gig.categoryId === String(c.id) ? "selected" : ""}`} onClick={() => setGig({...gig, categoryId: String(c.id), categoryName: c.name})}>{c.name}</div>
                  ))}
                  {categories.length === 0 && <span style={{ fontSize: 13, color: "#9ca3af" }}>A carregar categorias...</span>}
                </div>
                <button className="btn-next" disabled={!gig.title || !gig.categoryId} onClick={() => setStep(2)}>Continuar →</button>
              </>
            )}

            {step === 2 && (
              <>
                <p className="step-label">Passo 2 de 4</p>
                <h1>Descreve o teu servico</h1>
                <p>Explica o que vais entregar ao cliente.</p>
                <div className="form-group">
                  <label>Descricao</label>
                  <textarea placeholder="Descreve em detalhe o que vais fazer, o que esta incluido e o que o cliente pode esperar..." value={gig.description} onChange={e => setGig({...gig, description: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tags / palavras-chave (opcional)</label>
                  <input type="text" placeholder="Ex: react, logotipo, wordpress" value={gig.tags} onChange={e => setGig({...gig, tags: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Imagem de capa - URL (opcional)</label>
                  <input type="text" placeholder="https://..." value={gig.image} onChange={e => setGig({...gig, image: e.target.value})} />
                </div>
                <button className="btn-next" disabled={gig.description.length < 20} onClick={() => setStep(3)}>Continuar →</button>
              </>
            )}

            {step === 3 && (
              <>
                <p className="step-label">Passo 3 de 4</p>
                <h1>Define o teu pacote</h1>
                <p>Quanto cobras e o que esta incluido?</p>
                <div className="form-group">
                  <label>O que este pacote inclui</label>
                  <textarea placeholder="Ex: 1 pagina, 2 revisoes, entrega do codigo fonte..." value={gig.packageDescription} onChange={e => setGig({...gig, packageDescription: e.target.value})} />
                </div>
                <button className="btn-next" disabled={gig.packageDescription.length < 10} onClick={() => setStep(4)}>Continuar →</button>
              </>
            )}

            {step === 4 && (
              <>
                <p className="step-label">Passo 4 de 4</p>
                <h1>Preco e prazo</h1>
                <p>Ultimo passo antes de publicares.</p>
                <div className="price-row">
                  <div className="form-group">
                    <label>Preco (MT)</label>
                    <input type="number" placeholder="Ex: 2500" value={gig.price} onChange={e => setGig({...gig, price: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Prazo de entrega</label>
                    <select value={gig.delivery} onChange={e => setGig({...gig, delivery: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      <option value="1">1 dia</option>
                      <option value="3">3 dias</option>
                      <option value="7">7 dias</option>
                      <option value="14">14 dias</option>
                      <option value="30">30 dias</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Revisoes incluidas</label>
                  <select value={gig.revisions} onChange={e => setGig({...gig, revisions: e.target.value})}>
                    <option value="0">Sem revisoes</option>
                    <option value="1">1 revisao</option>
                    <option value="2">2 revisoes</option>
                    <option value="3">3 revisoes</option>
                    <option value="99">Revisoes ilimitadas</option>
                  </select>
                </div>
                <button className="btn-next" disabled={!gig.price || !gig.delivery || loading} onClick={handleSubmit}>
                  {loading ? "A publicar..." : "Publicar Servico →"}
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
