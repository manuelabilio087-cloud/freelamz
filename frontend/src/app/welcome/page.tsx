"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Welcome() {
  const router = useRouter();

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
        .container { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; }
        .container h1 { font-size: 32px; font-weight: 700; color: #404145; margin-bottom: 12px; text-align: center; }
        .container p { color: #74767e; font-size: 16px; margin-bottom: 48px; text-align: center; }
        .cards { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
        .card { width: 280px; border: 2px solid #e4e5e7; border-radius: 12px; padding: 40px 32px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .card:hover { border-color: #1dbf73; box-shadow: 0 4px 20px rgba(29,191,115,0.15); transform: translateY(-4px); }
        .card-icon { font-size: 56px; margin-bottom: 20px; }
        .card h2 { font-size: 20px; font-weight: 700; color: #404145; margin-bottom: 10px; }
        .card p { font-size: 14px; color: #74767e; line-height: 1.6; }
        .card-btn { margin-top: 24px; padding: 12px 24px; border-radius: 4px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; width: 100%; }
        .card-btn-client { background: #404145; color: #fff; }
        .card-btn-freelancer { background: #1dbf73; color: #fff; }
        @media (max-width: 600px) { .cards { flex-direction: column; align-items: center; } .card { width: 100%; max-width: 320px; } }
      `}</style>
      <div className="page">
        <div className="topbar">
          <button className="back-btn" onClick={() => router.back()}>← Voltar</button>
          <Link href="/" className="logo">Freelamz<span>.</span></Link>
          <div></div>
        </div>
        <div className="container">
          <h1>Bem-vindo ao Freelamz! 🎉</h1>
          <p>Como queres usar a plataforma?</p>
          <div className="cards">
            <div className="card" onClick={() => router.push("/client-dashboard")}>
              <div className="card-icon">🏢</div>
              <h2>Quero contratar</h2>
              <p>Encontra freelancers talentosos para os teus projectos e faz o teu negocio crescer.</p>
              <button className="card-btn card-btn-client">Sou Cliente →</button>
            </div>
            <div className="card" onClick={() => router.push("/onboarding")}>
              <div className="card-icon">💼</div>
              <h2>Quero trabalhar</h2>
              <p>Oferece os teus servicos, encontra clientes e ganha dinheiro com as tuas habilidades.</p>
              <button className="card-btn card-btn-freelancer">Sou Freelancer →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}