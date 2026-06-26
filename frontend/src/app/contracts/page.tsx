"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Contracts() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/contracts/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setContracts(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  const viewContract = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/contracts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSelectedContract(data);
    } catch {}
  };

  const signContract = async (id: number) => {
    if (!confirm("Tens a certeza que queres assinar este contrato?")) return;
    setSigning(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/contracts/${id}/sign`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadContracts();
        if (selectedContract?.id === id) viewContract(id);
      }
    } catch {}
    setSigning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#ecfdf5', color: '#10b981', label: 'Activo' };
      case 'pending': return { bg: '#fffbeb', color: '#f59e0b', label: 'Pendente' };
      case 'partially_signed': return { bg: '#eef2ff', color: '#6366f1', label: 'Parcialmente Assinado' };
      case 'completed': return { bg: '#f5f6fa', color: '#6b7280', label: 'Concluido' };
      default: return { bg: '#f5f6fa', color: '#6b7280', label: status };
    }
  };

  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #f5f6fa; color: #1a1d27; }
        a { text-decoration: none; color: inherit; }
        .navbar { background: #fff; border-bottom: 1px solid #e8eaf0; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 22px; font-weight: 700; }
        .logo span { color: #6366f1; }
        .container { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .page-title { font-size: 24px; font-weight: 700; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 10px 20px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; transition: opacity 0.2s; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-outline { background: #fff; color: #6366f1; padding: 10px 20px; border-radius: 10px; font-weight: 600; border: 1.5px solid #6366f1; cursor: pointer; font-size: 14px; transition: all 0.2s; }
        .btn-outline:hover { background: #eef2ff; }
        .btn-success { background: #10b981; color: #fff; padding: 10px 20px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; transition: opacity 0.2s; }
        .btn-success:hover { opacity: 0.9; }
        .btn-success:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .contracts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .contracts-list { background: #fff; border-radius: 16px; border: 1px solid #e8eaf0; overflow: hidden; }
        .list-header { padding: 20px 24px; border-bottom: 1px solid #e8eaf0; font-weight: 700; font-size: 16px; }
        .contract-item { padding: 16px 24px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.15s; display: flex; justify-content: space-between; align-items: center; }
        .contract-item:hover { background: #f9f9f9; }
        .contract-item.active { background: #eef2ff; border-left: 3px solid #6366f1; }
        .contract-title { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
        .contract-meta { font-size: 12px; color: #6b7280; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        
        .contract-detail { background: #fff; border-radius: 16px; border: 1px solid #e8eaf0; padding: 28px; }
        .detail-header { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #e8eaf0; }
        .detail-title { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
        .detail-meta { display: flex; gap: 16px; font-size: 14px; color: #6b7280; }
        
        .terms-box { background: #f5f6fa; border-radius: 12px; padding: 20px; margin-bottom: 24px; font-size: 14px; line-height: 1.7; color: #404145; }
        
        .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .signature-card { border: 1.5px solid #e8eaf0; border-radius: 12px; padding: 16px; text-align: center; }
        .signature-card.signed { border-color: #10b981; background: #ecfdf5; }
        .signature-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
        
        .milestones { margin-bottom: 24px; }
        .milestone-item { display: flex; align-items: center; gap: 12px; padding: 14px; background: #f5f6fa; border-radius: 10px; margin-bottom: 10px; }
        .milestone-check { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #e8eaf0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .milestone-check.done { background: #10b981; border-color: #10b981; color: #fff; }
        .milestone-info { flex: 1; }
        .milestone-title { font-weight: 600; font-size: 14px; }
        .milestone-amount { font-size: 13px; color: #6366f1; font-weight: 600; }
        
        .empty { text-align: center; padding: 48px; color: #6b7280; }
        .loading { text-align: center; padding: 40px; color: #6b7280; }
        
        @media (max-width: 768px) {
          .contracts-grid { grid-template-columns: 1fr; }
          .signatures { grid-template-columns: 1fr; }
          .navbar { padding: 0 16px; }
          .container { padding: 20px 16px; }
        }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="logo">Freelamz<span>.</span></Link>
        <div style={{display:"flex",alignItems:"center",gap:"20px",fontSize:"14px"}}>
          <Link href="/projects" style={{color:"#6b7280"}}>Projectos</Link>
          <Link href="/messages" style={{color:"#6b7280"}}>Mensagens</Link>
          <Link href={isClient ? "/client-dashboard" : "/dashboard"} style={{color:"#6b7280"}}>Dashboard</Link>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Meus Contratos</h1>
          {isClient && (
            <Link href="/projects"><button className="btn-primary">+ Novo Contrato</button></Link>
          )}
        </div>

        <div className="contracts-grid">
          {/* Lista de Contratos */}
          <div className="contracts-list">
            <div className="list-header">Contratos ({contracts.length})</div>
            {loading ? (
              <div className="loading">A carregar...</div>
            ) : contracts.length === 0 ? (
              <div className="empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e8eaf0" strokeWidth="1.5" style={{margin:"0 auto 12px",display:"block"}}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>Ainda nao tens contratos.</p>
                {isClient && <p style={{marginTop:"8px"}}>Cria um projecto para gerar um contrato.</p>}
              </div>
            ) : (
              contracts.map((c, i) => {
                const status = getStatusColor(c.status);
                return (
                  <div key={i} className={`contract-item ${selectedContract?.id === c.id ? "active" : ""}`} onClick={() => viewContract(c.id)}>
                    <div>
                      <div className="contract-title">{c.project_title}</div>
                      <div className="contract-meta">
                        {isClient ? `Freelancer: ${c.freelancer_name}` : `Cliente: ${c.client_name}`} · {new Date(c.created_at).toLocaleDateString("pt-PT")}
                      </div>
                    </div>
                    <span className="badge" style={{background:status.bg,color:status.color}}>{status.label}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Detalhe do Contrato */}
          <div>
            {!selectedContract ? (
              <div className="contracts-list">
                <div className="empty">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e8eaf0" strokeWidth="1.5" style={{margin:"0 auto 16px",display:"block"}}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <p>Selecciona um contrato para ver os detalhes</p>
                </div>
              </div>
            ) : (
              <div className="contract-detail">
                <div className="detail-header">
                  <div className="detail-title">{selectedContract.project_title}</div>
                  <div className="detail-meta">
                    <span>Orçamento: <strong>{selectedContract.project_budget ? `${Number(selectedContract.project_budget).toLocaleString()} MT` : "A negociar"}</strong></span>
                    <span>·</span>
                    <span>Criado em: {new Date(selectedContract.created_at).toLocaleDateString("pt-PT")}</span>
                  </div>
                </div>

                {/* Termos */}
                <div style={{marginBottom:"8px",fontWeight:"600",fontSize:"14px"}}>Termos do Contrato</div>
                <div className="terms-box">{selectedContract.terms}</div>

                {/* Assinaturas */}
                <div style={{marginBottom:"8px",fontWeight:"600",fontSize:"14px"}}>Assinaturas</div>
                <div className="signatures">
                  <div className={`signature-card ${selectedContract.client_signed ? "signed" : ""}`}>
                    <div className="signature-icon" style={{background: selectedContract.client_signed ? "#10b981" : "#e8eaf0", color: selectedContract.client_signed ? "#fff" : "#6b7280"}}>
                      {selectedContract.client_signed ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      )}
                    </div>
                    <div style={{fontWeight:"600",fontSize:"14px"}}>{selectedContract.client_name}</div>
                    <div style={{fontSize:"12px",color:"#6b7280"}}>Cliente</div>
                    {selectedContract.client_signed && (
                      <div style={{fontSize:"12px",color:"#10b981",marginTop:"6px"}}>Assinado em {new Date(selectedContract.client_signed_at).toLocaleDateString("pt-PT")}</div>
                    )}
                  </div>

                  <div className={`signature-card ${selectedContract.freelancer_signed ? "signed" : ""}`}>
                    <div className="signature-icon" style={{background: selectedContract.freelancer_signed ? "#10b981" : "#e8eaf0", color: selectedContract.freelancer_signed ? "#fff" : "#6b7280"}}>
                      {selectedContract.freelancer_signed ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      )}
                    </div>
                    <div style={{fontWeight:"600",fontSize:"14px"}}>{selectedContract.freelancer_name}</div>
                    <div style={{fontSize:"12px",color:"#6b7280"}}>Freelancer</div>
                    {selectedContract.freelancer_signed && (
                      <div style={{fontSize:"12px",color:"#10b981",marginTop:"6px"}}>Assinado em {new Date(selectedContract.freelancer_signed_at).toLocaleDateString("pt-PT")}</div>
                    )}
                  </div>
                </div>

                {/* Milestones */}
                {selectedContract.milestones && selectedContract.milestones.length > 0 && (
                  <div className="milestones">
                    <div style={{marginBottom:"12px",fontWeight:"600",fontSize:"14px"}}>Milestones</div>
                    {selectedContract.milestones.map((m: any, i: number) => (
                      <div key={i} className="milestone-item">
                        <div className={`milestone-check ${m.status === 'completed' ? 'done' : ''}`}>
                          {m.status === 'completed' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <div className="milestone-info">
                          <div className="milestone-title">{m.title}</div>
                          <div className="milestone-amount">{m.amount ? `${Number(m.amount).toLocaleString()} MT` : ""}</div>
                        </div>
                        <span className="badge" style={{
                          background: m.status === 'completed' ? '#ecfdf5' : m.status === 'in_progress' ? '#fffbeb' : '#f5f6fa',
                          color: m.status === 'completed' ? '#10b981' : m.status === 'in_progress' ? '#f59e0b' : '#6b7280'
                        }}>
                          {m.status === 'completed' ? 'Concluido' : m.status === 'in_progress' ? 'Em andamento' : 'Pendente'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botão de Assinar */}
                <div style={{display:"flex",gap:"12px"}}>
                  {isClient && !selectedContract.client_signed && selectedContract.status !== 'active' && (
                    <button className="btn-success" onClick={() => signContract(selectedContract.id)} disabled={signing}>
                      {signing ? "A processar..." : "Assinar como Cliente"}
                    </button>
                  )}
                  {isFreelancer && !selectedContract.freelancer_signed && selectedContract.status !== 'active' && (
                    <button className="btn-success" onClick={() => signContract(selectedContract.id)} disabled={signing}>
                      {signing ? "A processar..." : "Assinar como Freelancer"}
                    </button>
                  )}
                  {selectedContract.status === 'active' && (
                    <div style={{background:"#ecfdf5",color:"#10b981",padding:"12px 20px",borderRadius:"10px",fontWeight:"600",display:"flex",alignItems:"center",gap:"8px"}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      Contrato Activo! Ambos assinaram.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}