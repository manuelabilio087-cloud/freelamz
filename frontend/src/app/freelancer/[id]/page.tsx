"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function FreelancerProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [freelancer, setFreelancer] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    fetchFreelancer();
    fetchReviews();
  }, [id]);

  const fetchFreelancer = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`);
      const data = await res.json();
      setFreelancer(data);
    } catch {}
    setLoading(false);
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews/user/${id}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {}
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + Number(r.rating), 0) / reviews.length).toFixed(1)
    : null;

  const skills = freelancer?.skills
    ? (Array.isArray(freelancer.skills)
        ? freelancer.skills
        : (() => { try { return JSON.parse(freelancer.skills); } catch { return []; } })())
    : [];

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px", fontFamily: "Inter, sans-serif", color: "#6b7280" }}>
      A carregar perfil...
    </div>
  );

  if (!freelancer) return (
    <div style={{ textAlign: "center", padding: "80px", fontFamily: "Inter, sans-serif", color: "#6b7280" }}>
      Freelancer nao encontrado.
    </div>
  );

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #f5f6fa; color: #1a1d27; }
        a { text-decoration: none; color: inherit; }
        .container { max-width: 860px; margin: 0 auto; padding: 32px 24px; }
        .back { display: inline-flex; align-items: center; gap: 6px; color: #6b7280; font-size: 14px; margin-bottom: 24px; cursor: pointer; }
        .back:hover { color: #6366f1; }
        .card { background: #fff; border-radius: 20px; border: 1px solid #e8eaf0; padding: 36px; margin-bottom: 24px; }

        .profile-top { display: flex; align-items: flex-start; gap: 24px; margin-bottom: 24px; }
        .avatar { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 34px; font-weight: 700; flex-shrink: 0; overflow: hidden; }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .profile-name { font-size: 24px; font-weight: 800; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
        .verified-badge { display: inline-flex; align-items: center; gap: 4px; background: #ecfdf5; color: #10b981; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .pro-badge { display: inline-flex; align-items: center; gap: 4px; background: #eef2ff; color: #6366f1; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .profile-meta { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 8px; }
        .meta-item { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #6b7280; }
        .rating-big { display: flex; align-items: center; gap: 6px; font-size: 20px; font-weight: 800; color: #f59e0b; }
        .bio { font-size: 15px; color: #4b5563; line-height: 1.8; }
        .divider { border: none; border-top: 1px solid #e8eaf0; margin: 24px 0; }

        .skills { display: flex; gap: 8px; flex-wrap: wrap; }
        .skill { padding: 6px 14px; background: #eef2ff; color: #6366f1; border-radius: 20px; font-size: 13px; font-weight: 600; }

        .section-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
        .review-card { padding: 20px 0; border-bottom: 1px solid #f0f0f0; }
        .review-card:last-child { border-bottom: none; }
        .review-top { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .review-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .review-name { font-size: 14px; font-weight: 600; }
        .review-date { font-size: 12px; color: #9ca3af; }
        .stars { display: flex; gap: 2px; }
        .review-comment { font-size: 14px; color: #4b5563; line-height: 1.6; margin-top: 8px; }
        .empty-reviews { text-align: center; padding: 40px; color: #6b7280; font-size: 14px; }

        .btn-contact { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; border: none; margin-top: 16px; }
        .btn-contact:hover { opacity: 0.9; }

        @media (max-width: 640px) {
          .container { padding: 20px 16px; }
          .card { padding: 24px; }
          .profile-top { flex-direction: column; align-items: center; text-align: center; }
          .profile-meta { justify-content: center; }
          .profile-name { justify-content: center; }
        }
      `}</style>

      <div className="container">
        <div className="back" onClick={() => router.push("/freelancers")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar aos freelancers
        </div>

        {/* Perfil principal */}
        <div className="card">
          <div className="profile-top">
            <div className="avatar">
              {freelancer.avatar
                ? <img src={freelancer.avatar} alt={freelancer.name} />
                : freelancer.name?.[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div className="profile-name">
                {freelancer.name}
                {freelancer.verified && (
                  <span className="verified-badge">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Verificado
                  </span>
                )}
                {freelancer.plan === "pro" && (
                  <span className="pro-badge">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Pro
                  </span>
                )}
              </div>

              <div className="profile-meta">
                {avgRating && (
                  <div className="rating-big">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {avgRating}
                    <span style={{ fontSize: "13px", fontWeight: "400", color: "#6b7280" }}>({reviews.length} avaliações)</span>
                  </div>
                )}
                {freelancer.location && (
                  <div className="meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {freelancer.location}
                  </div>
                )}
                <div className="meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Membro desde {new Date(freelancer.created_at || Date.now()).toLocaleDateString("pt-PT", { month: "long", year: "numeric" })}
                </div>
              </div>

              {user && user.id !== freelancer.id && (
                <button className="btn-contact" onClick={() => router.push(`/messages?to=${freelancer.id}`)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Enviar mensagem
                </button>
              )}
            </div>
          </div>

          {freelancer.bio && (
            <>
              <hr className="divider" />
              <p className="bio">{freelancer.bio}</p>
            </>
          )}

          {skills.length > 0 && (
            <>
              <hr className="divider" />
              <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "12px" }}>Competências</div>
              <div className="skills">
                {skills.map((s: string, i: number) => (
                  <span key={i} className="skill">{s}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Avaliações */}
        <div className="card">
          <div className="section-title">
            Avaliações {reviews.length > 0 && `(${reviews.length})`}
          </div>
          {reviews.length === 0 ? (
            <div className="empty-reviews">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e8eaf0" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Ainda sem avaliações.
            </div>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-top">
                  <div className="review-avatar">{r.reviewer_name?.[0] || "C"}</div>
                  <div>
                    <div className="review-name">{r.reviewer_name || "Cliente"}</div>
                    <div className="review-date">{new Date(r.created_at).toLocaleDateString("pt-PT")}</div>
                  </div>
                  <div className="stars" style={{ marginLeft: "auto" }}>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= r.rating ? "#f59e0b" : "#e8eaf0"} stroke={s <= r.rating ? "#f59e0b" : "#e8eaf0"} strokeWidth="1">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                {r.comment && <p className="review-comment">{r.comment}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}