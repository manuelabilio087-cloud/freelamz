import type { Metadata } from "next";
import Link from "next/link";

const API_URL = "https://freelamz-production.up.railway.app/api";

export const metadata: Metadata = {
  title: "Freelancers em Moçambique — Freelamz",
  description: "Encontra os melhores freelancers em Moçambique. Design, programação, marketing, redação e muito mais no Freelamz.",
  openGraph: {
    title: "Freelancers em Moçambique — Freelamz",
    description: "Contrata freelancers profissionais em Moçambique.",
  },
};

async function getFreelancers() {
  try {
    const res = await fetch(`${API_URL}/users/freelancers`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function FreelancersPage() {
  const freelancers = await getFreelancers();

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, sans-serif; background: #f5f6fa; color: #1a1d27; }
        a { text-decoration: none; color: inherit; }
        
        .logo { font-size: 22px; font-weight: 700; }
        .logo span { color: #6366f1; }
        .hero { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 64px 24px; text-align: center; color: #fff; }
        .hero h1 { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
        .hero p { font-size: 17px; opacity: 0.85; max-width: 500px; margin: 0 auto; }
        .container { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .card { background: #fff; border-radius: 16px; border: 1px solid #e8eaf0; padding: 28px; transition: box-shadow 0.2s, transform 0.2s; }
        .card:hover { box-shadow: 0 8px 32px rgba(99,102,241,0.10); transform: translateY(-2px); }
        .card-top { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; font-weight: 700; flex-shrink: 0; overflow: hidden; }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }
        .card-name { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
        .card-location { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 4px; }
        .verified { display: inline-flex; align-items: center; gap: 4px; background: #ecfdf5; color: #10b981; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-left: 6px; }
        .card-bio { font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 44px; }
        .skills { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
        .skill { padding: 4px 10px; background: #eef2ff; color: #6366f1; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .btn-view { display: block; text-align: center; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 11px; border-radius: 10px; font-weight: 600; font-size: 14px; transition: opacity 0.2s; }
        .btn-view:hover { opacity: 0.9; }
        .empty { text-align: center; padding: 80px 24px; color: #6b7280; grid-column: 1 / -1; }
        .section-label { font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 20px; }
        @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; }  .hero h1 { font-size: 26px; } }
      `}</style>

      

      <div className="hero">
        <h1>Freelancers em Moçambique</h1>
        <p>Encontra profissionais talentosos para o teu projecto. Design, programação, marketing e muito mais.</p>
      </div>

      <div className="container">
        <div className="section-label">{freelancers.length} freelancer{freelancers.length !== 1 ? "s" : ""} disponíve{freelancers.length !== 1 ? "is" : "l"}</div>
        <div className="grid">
          {freelancers.length === 0 ? (
            <div className="empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e8eaf0" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <p>Ainda não há freelancers registados.</p>
            </div>
          ) : (
            freelancers.map((f: any) => {
              const skills = Array.isArray(f.skills)
                ? f.skills
                : typeof f.skills === "string"
                  ? (() => { try { return JSON.parse(f.skills); } catch { return []; } })()
                  : [];
              return (
                <div key={f.id} className="card">
                  <div className="card-top">
                    <div className="avatar">
                      {f.avatar ? <img src={f.avatar} alt={f.name} /> : f.name?.[0]}
                    </div>
                    <div>
                      <div className="card-name">
                        {f.name}
                        {f.verified && (
                          <span className="verified">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Verificado
                          </span>
                        )}
                      </div>
                      {f.location && (
                        <div className="card-location">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {f.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="card-bio">{f.bio || "Freelancer profissional em Moçambique."}</p>
                  {skills.length > 0 && (
                    <div className="skills">
                      {skills.slice(0, 3).map((s: string, i: number) => (
                        <span key={i} className="skill">{s}</span>
                      ))}
                      {skills.length > 3 && <span className="skill">+{skills.length - 3}</span>}
                    </div>
                  )}
                  <Link href={`/freelancer/${f.id}`} className="btn-view">Ver perfil</Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
