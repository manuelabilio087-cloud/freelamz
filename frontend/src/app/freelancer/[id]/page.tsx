import type { Metadata } from "next";

const API_URL = "https://freelamz-production.up.railway.app/api";

// SEO dinâmico por freelancer
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/users/freelancer/${params.id}`, { cache: "no-store" });
    const freelancer = await res.json();
    return {
      title: `${freelancer.name} — Freelancer no Freelamz`,
      description: freelancer.bio || `${freelancer.name} é freelancer em Moçambique. Contrata agora no Freelamz.`,
      openGraph: {
        title: `${freelancer.name} — Freelamz`,
        description: freelancer.bio || `Freelancer em Moçambique`,
        images: freelancer.avatar ? [freelancer.avatar] : [],
      },
    };
  } catch {
    return { title: "Freelancer — Freelamz" };
  }
}

async function getFreelancer(id: string) {
  try {
    const res = await fetch(`${API_URL}/users/freelancer/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getReviews(id: string) {
  try {
    const res = await fetch(`${API_URL}/reviews/user/${id}`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function FreelancerProfile({ params }: { params: { id: string } }) {
  const freelancer = await getFreelancer(params.id);
  const reviews = await getReviews(params.id);

  if (!freelancer) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Freelancer não encontrado</h2>
          <a href="/projects" style={{ color: "#6366f1", textDecoration: "none" }}>← Ver projectos</a>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const skills = Array.isArray(freelancer.skills)
    ? freelancer.skills
    : typeof freelancer.skills === "string"
      ? JSON.parse(freelancer.skills || "[]")
      : [];

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #f5f6fa; color: #1a1d27; }
        a { text-decoration: none; color: inherit; }
        .navbar { background: #fff; border-bottom: 1px solid #e8eaf0; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .logo { font-size: 22px; font-weight: 700; }
        .logo span { color: #6366f1; }
        .container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
        .profile-header { background: #fff; border-radius: 20px; border: 1px solid #e8eaf0; padding: 40px; margin-bottom: 24px; display: flex; gap: 32px; align-items: flex-start; }
        .avatar { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 42px; font-weight: 700; flex-shrink: 0; overflow: hidden; }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .profile-info { flex: 1; }
        .profile-name { font-size: 28px; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
        .verified-badge { display: inline-flex; align-items: center; gap: 4px; background: #ecfdf5; color: #10b981; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .profile-bio { font-size: 15px; color: #6b7280; line-height: 1.7; margin-bottom: 20px; }
        .profile-meta { display: flex; gap: 24px; font-size: 14px; color: #6b7280; margin-bottom: 20px; flex-wrap: wrap; }
        .meta-item { display: flex; align-items: center; gap: 6px; }
        .skills-wrap { display: flex; gap: 8px; flex-wrap: wrap; }
        .skill-tag { padding: 6px 14px; background: #eef2ff; color: #6366f1; border-radius: 20px; font-size: 13px; font-weight: 600; }
        .btn-hire { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 14px 28px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; font-size: 15px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; margin-top: 20px; }
        .btn-hire:hover { opacity: 0.9; }

        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-box { background: #fff; border-radius: 14px; border: 1px solid #e8eaf0; padding: 20px; text-align: center; }
        .stat-value { font-size: 28px; font-weight: 700; color: #6366f1; }
        .stat-label { font-size: 13px; color: #6b7280; margin-top: 4px; }

        .section { background: #fff; border-radius: 16px; border: 1px solid #e8eaf0; padding: 28px; margin-bottom: 24px; }
        .section-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
        .review-item { padding: 20px 0; border-bottom: 1px solid #f0f0f0; }
        .review-item:last-child { border-bottom: none; padding-bottom: 0; }
        .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .reviewer-name { font-weight: 600; font-size: 14px; }
        .stars { display: flex; gap: 2px; }
        .review-text { font-size: 14px; color: #6b7280; line-height: 1.6; }
        .review-date { font-size: 12px; color: #b5b6b9; margin-top: 6px; }
        .empty-reviews { text-align: center; padding: 32px; color: #6b7280; font-size: 14px; }

        @media (max-width: 768px) {
          .profile-header { flex-direction: column; align-items: center; text-align: center; padding: 24px; }
          .skills-wrap { justify-content: center; }
          .profile-meta { justify-content: center; }
          .stats-row { grid-template-columns: 1fr; }
          .navbar { padding: 0 16px; }
          .container { padding: 20px 16px; }
        }
      `}</style>

      <nav className="navbar">
        <a href="/" className="logo">Freelamz<span>.</span></a>
        <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "#6b7280" }}>
          <a href="/projects">Projectos</a>
          <a href="/login">Entrar</a>
        </div>
      </nav>

      <div className="container">
        {/* Header do Perfil */}
        <div className="profile-header">
          <div className="avatar">
            {freelancer.avatar
              ? <img src={freelancer.avatar} alt={freelancer.name} />
              : freelancer.name?.[0]
            }
          </div>
          <div className="profile-info">
            <div className="profile-name">
              {freelancer.name}
              {freelancer.verified && (
                <span className="verified-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Verificado
                </span>
              )}
            </div>

            {avgRating && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                <div className="stars">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= Math.round(Number(avgRating)) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <span style={{ fontWeight: "700", fontSize: "15px" }}>{avgRating}</span>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>({reviews.length} avaliações)</span>
              </div>
            )}

            <p className="profile-bio">{freelancer.bio || "Freelancer profissional em Moçambique."}</p>

            <div className="profile-meta">
              {freelancer.location && (
                <div className="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {freelancer.location}
                </div>
              )}
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                Freelancer
              </div>
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Membro desde {new Date(freelancer.created_at).toLocaleDateString("pt-PT", { month: "long", year: "numeric" })}
              </div>
            </div>

            {skills.length > 0 && (
              <div className="skills-wrap">
                {skills.map((s: string, i: number) => (
                  <span key={i} className="skill-tag">{s}</span>
                ))}
              </div>
            )}

            <a href={`/messages`} className="btn-hire">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Contratar / Contactar
            </a>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-value">{reviews.length}</div>
            <div className="stat-label">Avaliações</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{avgRating || "—"}</div>
            <div className="stat-label">Nota média</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{skills.length}</div>
            <div className="stat-label">Skills</div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="section">
          <div className="section-title">Avaliações ({reviews.length})</div>
          {reviews.length === 0 ? (
            <div className="empty-reviews">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e8eaf0" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Ainda não tem avaliações.
            </div>
          ) : (
            reviews.map((r: any, i: number) => (
              <div key={i} className="review-item">
                <div className="review-header">
                  <div className="reviewer-name">{r.reviewer_name || "Cliente"}</div>
                  <div className="stars">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= r.rating ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="review-text">{r.comment}</p>
                <div className="review-date">{new Date(r.created_at).toLocaleDateString("pt-PT")}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}