"use client";
import { useState } from "react";
import StarRating from "./StarRating";

const API_URL = "https://freelamz-production.up.railway.app/api";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancerId: number;
  freelancerName: string;
  projectId?: number;
  projectTitle?: string;
  onSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, freelancerId, freelancerName, projectId, projectTitle, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const submit = async () => {
    if (rating === 0) { setError("Seleciona uma avaliacao de 1 a 5 estrelas."); return; }
    setLoading(true); setError(""); setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ freelancer_id: freelancerId, project_id: projectId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Erro ao enviar avaliacao."); }
      else { setSuccess(true); setRating(0); setComment(""); setTimeout(() => { onClose(); onSuccess && onSuccess(); }, 1500); }
    } catch { setError("Erro de conexao."); }
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(17,24,39,0.55)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
      animation: "fadeIn 0.2s ease",
    }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)scale(0.97)}to{opacity:1;transform:translateY(0)scale(1)}}
      `}</style>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1.5px solid #e8eaed",
        width: "100%",
        maxWidth: "480px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.18)",
        animation: "slideUp 0.25s ease",
      }}>
        <div style={{ padding: "24px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#111827", letterSpacing: "-0.3px" }}>Avaliar freelancer</h2>
            <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>{freelancerName} {projectTitle ? `· ${projectTitle}` : ""}</p>
          </div>
          <button onClick={onClose} style={{
            width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e8eaed",
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#9ca3af", transition: "all 0.15s",
          }} onMouseEnter={e => e.currentTarget.style.color="#374151"} onMouseLeave={e => e.currentTarget.style.color="#9ca3af"}>
            <i className="ti ti-x" style={{ fontSize: "18px" }} aria-hidden="true"></i>
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%", background: "#ecfdf5",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              }}>
                <i className="ti ti-circle-check" style={{ fontSize: "32px", color: "#059669" }} aria-hidden="true"></i>
              </div>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#059669" }}>Avaliacao enviada!</p>
              <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>Obrigado pelo teu feedback.</p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "10px" }}>Como foi a tua experiencia?</p>
                <StarRating value={rating} onChange={setRating} size={36} />
                <div style={{ marginTop: "8px", fontSize: "12px", fontWeight: 600, color: "#f59e0b", height: "18px" }}>
                  {rating === 1 && "Pessimo"}
                  {rating === 2 && "Ruim"}
                  {rating === 3 && "Razoavel"}
                  {rating === 4 && "Bom"}
                  {rating === 5 && "Excelente"}
                </div>
              </div>

              {error && (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px",
                  padding: "10px 14px", fontSize: "13px", color: "#dc2626", marginBottom: "14px",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <i className="ti ti-alert-circle" style={{ fontSize: "16px", flexShrink: 0 }} aria-hidden="true"></i>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                  Comentario (opcional)
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Descreve a experiencia de trabalho com este freelancer..."
                  style={{
                    width: "100%", padding: "12px 14px", border: "1.5px solid #e8eaed", borderRadius: "10px",
                    fontSize: "14px", fontFamily: "inherit", color: "#111827", outline: "none",
                    resize: "vertical", minHeight: "100px", lineHeight: 1.6,
                    transition: "border 0.15s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                  onBlur={e => e.currentTarget.style.borderColor = "#e8eaed"}
                />
              </div>

              <button
                onClick={submit}
                disabled={loading || rating === 0}
                style={{
                  width: "100%", padding: "13px", background: rating === 0 ? "#e5e7eb" : "#6366f1", color: "#fff",
                  border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700,
                  cursor: rating === 0 ? "not-allowed" : "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "opacity 0.15s",
                }}
              >
                <i className="ti ti-send" style={{ fontSize: "17px" }} aria-hidden="true"></i>
                {loading ? "A enviar..." : "Enviar avaliacao"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}