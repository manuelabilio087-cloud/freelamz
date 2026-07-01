"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

const StarRating = ({ rating, onRate }: { rating: number; onRate?: (r: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{display:"flex",gap:"4px"}}>
      {[1,2,3,4,5].map(star => (
        <svg
          key={star}
          width="28" height="28" viewBox="0 0 24 24"
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => onRate && setHover(star)}
          onMouseLeave={() => onRate && setHover(0)}
          style={{cursor:onRate?"pointer":"default",transition:"all 0.1s"}}
          fill={(hover||rating)>=star?"#f5c518":"#e4e5e7"}
          stroke={(hover||rating)>=star?"#f5c518":"#e4e5e7"}
          strokeWidth="1"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
};

function ReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const freelancer_id = searchParams.get("freelancer_id");
  const project_id = searchParams.get("project_id");
  const freelancer_name = searchParams.get("name") || "Freelancer";

  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ver");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    loadReviews();
  }, [freelancer_id]);

  const loadReviews = async () => {
    if (!freelancer_id) return;
    try {
      const res = await fetch(`${API_URL}/reviews/freelancer/${freelancer_id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setAvgRating(data.avg_rating || 0);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  };

  const submitReview = async () => {
    if (rating === 0) { setError("Selecciona uma avaliacao de 1 a 5 estrelas"); return; }
    if (!comment.trim()) { setError("Escreve um comentario"); return; }
    setSending(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ freelancer_id: Number(freelancer_id), rating, comment, project_id: Number(project_id) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erro ao enviar avaliacao"); return; }
      setSent(true);
      loadReviews();
      setActiveTab("ver");
    } catch {
      setError("Erro de conexao");
    }
    setSending(false);
  };

  const ratingLabel = (r: number) => {
    if (r >= 4.5) return "Excelente";
    if (r >= 3.5) return "Muito bom";
    if (r >= 2.5) return "Bom";
    if (r >= 1.5) return "Razoavel";
    return "Fraco";
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #f5f5f5 !important; }
        body { font-family: Inter, sans-serif; color: #404145; }
        a { text-decoration: none; color: inherit; }
        
        .logo { font-size: 22px; font-weight: 700; color: #000; }
        .logo span { color: #1dbf73; }
        .container { max-width: 800px; margin: 32px auto; padding: 0 24px; display: flex; flex-direction: column; gap: 24px; }
        .card { background: #fff; border-radius: 16px; border: 1px solid #e4e5e7; padding: 28px; }
        .profile-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .avatar { width: 56px; height: 56px; border-radius: 50%; background: #1dbf73; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; font-weight: 700; flex-shrink: 0; }
        .profile-name { font-size: 20px; font-weight: 700; }
        .profile-sub { font-size: 13px; color: #74767e; }
        .rating-summary { display: flex; align-items: center; gap: 24px; padding: 20px; background: #f9f9f9; border-radius: 12px; margin-bottom: 20px; }
        .big-rating { font-size: 48px; font-weight: 700; color: #404145; }
        .rating-info { flex: 1; }
        .rating-label { font-size: 16px; font-weight: 600; margin-bottom: 4px; margin-top: 8px; }
        .rating-total { font-size: 13px; color: #74767e; }
        .tabs { display: flex; border-bottom: 2px solid #e4e5e7; margin-bottom: 24px; }
        .tab { padding: 12px 20px; font-size: 14px; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; color: #74767e; background: none; border-top: none; border-left: none; border-right: none; }
        .tab.active { color: #1dbf73; border-bottom-color: #1dbf73; }
        .review-item { padding: 20px; border: 1px solid #e4e5e7; border-radius: 12px; margin-bottom: 16px; }
        .review-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .reviewer { display: flex; align-items: center; gap: 10px; }
        .reviewer-avatar { width: 36px; height: 36px; border-radius: 50%; background: #404145; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; }
        .reviewer-name { font-weight: 600; font-size: 14px; }
        .review-date { font-size: 12px; color: #74767e; }
        .review-comment { font-size: 14px; color: #74767e; line-height: 1.6; margin-top: 10px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .form-group textarea { width: 100%; padding: 12px 14px; border: 1px solid #e4e5e7; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit; resize: vertical; min-height: 100px; color: #404145; }
        .form-group textarea:focus { border-color: #1dbf73; }
        .btn-primary { background: #1dbf73; color: #fff; padding: 14px 28px; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; width: 100%; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary:hover { background: #0fa85c; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-msg { color: #e53e3e; font-size: 13px; padding: 10px; background: #fff5f5; border-radius: 6px; border: 1px solid #fed7d7; margin-bottom: 16px; }
        .success-msg { color: #1dbf73; font-size: 14px; padding: 16px; background: #f0fdf8; border-radius: 8px; border: 1px solid #c8f0dc; display: flex; align-items: center; gap: 10px; font-weight: 600; }
        .empty { text-align: center; padding: 48px; color: #74767e; }
        .login-prompt { text-align: center; padding: 24px; color: #74767e; }
        @media (max-width: 768px) {
          
          .container { padding: 0 16px; margin: 20px auto; }
          .rating-summary { flex-direction: column; text-align: center; }
        }
      `}</style>

      <Navbar />

      <div className="container">
        <div className="card">
          <div className="profile-row">
            <div className="avatar">{freelancer_name[0]}</div>
            <div>
              <div className="profile-name">{freelancer_name}</div>
              <div className="profile-sub">Freelancer · Avaliações</div>
            </div>
          </div>

          {!loading && (
            <div className="rating-summary">
              <div className="big-rating">{Number(avgRating).toFixed(1)}</div>
              <div className="rating-info">
                <StarRating rating={Math.round(Number(avgRating))} />
                <div className="rating-label">{avgRating > 0 ? ratingLabel(Number(avgRating)) : "Sem avaliações"}</div>
                <div className="rating-total">{total} avaliação{Number(total) !== 1 ? "ões" : ""}</div>
              </div>
            </div>
          )}

          <div className="tabs">
            <button className={`tab ${activeTab === "ver" ? "active" : ""}`} onClick={() => setActiveTab("ver")}>
              Ver avaliações ({total})
            </button>
            {user && user.role === "client" && (
              <button className={`tab ${activeTab === "avaliar" ? "active" : ""}`} onClick={() => setActiveTab("avaliar")}>
                Avaliar freelancer
              </button>
            )}
          </div>

          {activeTab === "ver" && (
            <>
              {loading ? (
                <div className="empty">A carregar...</div>
              ) : reviews.length === 0 ? (
                <div className="empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e4e5e7" strokeWidth="1.5" style={{margin:"0 auto 12px",display:"block"}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <p>Ainda não há avaliações para este freelancer.</p>
                </div>
              ) : (
                reviews.map((r, i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <div className="reviewer">
                        <div className="reviewer-avatar">{r.client_name?.[0] || "C"}</div>
                        <div>
                          <div className="reviewer-name">{r.client_name}</div>
                          <div className="review-date">{new Date(r.created_at).toLocaleDateString("pt-PT")}</div>
                        </div>
                      </div>
                      <StarRating rating={r.rating} />
                    </div>
                    <p className="review-comment">{r.comment}</p>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "avaliar" && (
            <>
              {sent ? (
                <div className="success-msg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1dbf73" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Avaliação enviada com sucesso!
                </div>
              ) : !user ? (
                <div className="login-prompt">
                  <p style={{marginBottom:"12px"}}>Precisas de estar autenticado para avaliar</p>
                  <Link href="/login"><button className="btn-primary" style={{width:"auto",padding:"10px 24px"}}>Entrar</button></Link>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Classificação</label>
                    <StarRating rating={rating} onRate={setRating} />
                    {rating > 0 && <p style={{fontSize:"13px",color:"#1dbf73",marginTop:"6px",fontWeight:"600"}}>{ratingLabel(rating)}</p>}
                  </div>
                  <div className="form-group">
                    <label>Comentário</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Descreve a tua experiência com este freelancer..." />
                  </div>
                  {error && <div className="error-msg">{error}</div>}
                  <button className="btn-primary" onClick={submitReview} disabled={sending}>
                    {sending ? "A enviar..." : "Enviar avaliação"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function Reviews() {
  return (
    <Suspense fallback={<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>A carregar...</div>}>
      <ReviewsContent />
    </Suspense>
  );
}
