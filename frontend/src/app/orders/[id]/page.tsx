"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

interface OrderExtra { id: number; name: string; price: string; }
interface Delivery { id: number; message: string; files: string[]; created_at: string; }
interface RevisionRequest { id: number; message: string; created_at: string; }
interface OrderDetail {
  id: number;
  gig_id: number;
  gig_title: string;
  gig_image: string;
  package_type: string;
  package_title: string;
  package_description: string;
  delivery_days: number;
  revisions: number;
  client_id: number;
  freelancer_id: number;
  client_name: string;
  client_avatar?: string;
  freelancer_name: string;
  freelancer_avatar?: string;
  total_amount: string;
  requirements: string;
  delivery_date: string;
  status: string;
  revisions_used: number;
  revisions_allowed: number;
  delivered_at?: string;
  auto_complete_at?: string;
  created_at: string;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending_payment: { label: "Aguarda pagamento", color: "#9a3412", bg: "#ffedd5" },
  pending: { label: "Pendente", color: "#92400e", bg: "#fef3c7" },
  in_progress: { label: "Em progresso", color: "#3730a3", bg: "#e0e7ff" },
  delivered: { label: "Entregue - aguarda revisao", color: "#0369a1", bg: "#e0f2fe" },
  revision_requested: { label: "Revisao solicitada", color: "#9a3412", bg: "#ffedd5" },
  completed: { label: "Concluido", color: "#15803d", bg: "#dcfce7" },
  cancelled: { label: "Cancelado", color: "#991b1b", bg: "#fee2e2" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [extras, setExtras] = useState<OrderExtra[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [revisionRequests, setRevisionRequests] = useState<RevisionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const [deliverMessage, setDeliverMessage] = useState("");
  const [deliverFiles, setDeliverFiles] = useState("");
  const [revisionMessage, setRevisionMessage] = useState("");
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try { setUserId(JSON.parse(savedUser).id); } catch { /* ignore */ }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Nao foi possivel carregar a encomenda.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrder(data.order);
      setExtras(data.extras || []);
      setDeliveries(data.deliveries || []);
      setRevisionRequests(data.revision_requests || []);
    } catch (err) {
      console.error(err);
      setError("Erro ao ligar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleDeliver = async () => {
    if (!deliverMessage.trim() && !deliverFiles.trim()) {
      setActionMsg("Adiciona uma mensagem ou pelo menos um link de ficheiro.");
      return;
    }
    setSubmitting(true);
    setActionMsg("");
    try {
      const files = deliverFiles.split(",").map((f) => f.trim()).filter(Boolean);
      const res = await fetch(`${API_URL}/orders/${orderId}/deliver`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ message: deliverMessage, files }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDeliverMessage("");
      setDeliverFiles("");
      await fetchOrder();
    } catch (err: any) {
      setActionMsg(err.message || "Erro ao entregar trabalho.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionMessage.trim()) {
      setActionMsg("Descreve o que precisa ser revisto.");
      return;
    }
    setSubmitting(true);
    setActionMsg("");
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/request-revision`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ message: revisionMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRevisionMessage("");
      setShowRevisionForm(false);
      await fetchOrder();
    } catch (err: any) {
      setActionMsg(err.message || "Erro ao pedir revisao.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async () => {
    if (!confirm("Confirmas que estas satisfeito e queres aceitar a entrega? O pagamento sera liberado ao freelancer.")) return;
    setSubmitting(true);
    setActionMsg("");
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/accept`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await fetchOrder();
    } catch (err: any) {
      setActionMsg(err.message || "Erro ao aceitar entrega.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (status === "cancelled" && !confirm("Tens a certeza que queres cancelar esta encomenda?")) return;
    setSubmitting(true);
    setActionMsg("");
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await fetchOrder();
    } catch (err: any) {
      setActionMsg(err.message || "Erro ao actualizar estado.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "60px", color: "#74767e", fontFamily: "Inter, sans-serif" }}>Carregando...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
        <Navbar />
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 24px", textAlign: "center", fontFamily: "Inter, sans-serif" }}>
          <p style={{ color: "#991b1b", marginBottom: "16px" }}>{error || "Encomenda nao encontrada."}</p>
          <Link href="/orders" style={{ color: "#1dbf73", fontWeight: 600, textDecoration: "none" }}>Voltar as encomendas</Link>
        </div>
      </div>
    );
  }

  const isClient = userId === order.client_id;
  const isFreelancer = userId === order.freelancer_id;
  const meta = STATUS_META[order.status] || { label: order.status, color: "#404145", bg: "#f3f4f6" };
  const canDeliver = isFreelancer && ["in_progress", "revision_requested"].includes(order.status);
  const canAccept = isClient && order.status === "delivered";
  const canRequestRevision = isClient && order.status === "delivered" && order.revisions_used < order.revisions_allowed;
  const canCancel = (isClient || isFreelancer) && ["pending_payment", "in_progress"].includes(order.status);
  const awaitingPayment = isClient && order.status === "pending_payment";

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 20px; }
        .btn-green { background: #1dbf73; color: #fff; padding: 11px 20px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; font-size: 14px; }
        .btn-green:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-outline { background: #fff; color: #404145; padding: 11px 20px; border-radius: 6px; font-weight: 600; border: 1px solid #c5c6c9; cursor: pointer; font-size: 14px; }
        .btn-danger { background: #fff; color: #d92d20; padding: 11px 20px; border-radius: 6px; font-weight: 600; border: 1px solid #fda29b; cursor: pointer; font-size: 14px; }
        .input-field { width: 100%; padding: 10px 14px; border: 1px solid #e4e5e7; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit; }
        .input-field:focus { border-color: #1dbf73; }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "24px" }}>
        <Link href="/orders" style={{ color: "#74767e", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "16px" }}>&larr; Voltar as encomendas</Link>

        <div className="card" style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#404145", marginBottom: "4px" }}>{order.gig_title}</h1>
              <p style={{ fontSize: "13px", color: "#74767e" }}>Encomenda #{order.id} &middot; {order.package_title || order.package_type}</p>
            </div>
            <span style={{ background: meta.bg, color: meta.color, padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
              {meta.label}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", paddingTop: "16px", borderTop: "1px solid #e4e5e7" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "4px" }}>Cliente</p>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#404145" }}>{order.client_name}</p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "4px" }}>Freelancer</p>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#404145" }}>{order.freelancer_name}</p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "4px" }}>Total</p>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#404145" }}>{order.total_amount} MT</p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "4px" }}>Prazo de entrega</p>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#404145" }}>{new Date(order.delivery_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "4px" }}>Revisoes</p>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#404145" }}>{order.revisions_used} / {order.revisions_allowed}</p>
            </div>
          </div>

          <div style={{ paddingTop: "16px", marginTop: "16px", borderTop: "1px solid #e4e5e7" }}>
            <Link
              href={`/messages?userId=${isClient ? order.freelancer_id : order.client_id}`}
              className="btn-outline"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Mensagem para {isClient ? order.freelancer_name : order.client_name}
            </Link>
          </div>

          {extras.length > 0 && (
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e4e5e7" }}>
              <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "8px" }}>Extras</p>
              {extras.map((ex) => (
                <div key={ex.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#404145", marginBottom: "4px" }}>
                  <span>{ex.name}</span><span>{ex.price} MT</span>
                </div>
              ))}
            </div>
          )}

          {order.requirements && (
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e4e5e7" }}>
              <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "6px" }}>Requisitos do cliente</p>
              <p style={{ fontSize: "14px", color: "#404145", whiteSpace: "pre-wrap" }}>{order.requirements}</p>
            </div>
          )}
        </div>

        {order.status === "delivered" && order.auto_complete_at && (
          <div className="card" style={{ marginBottom: "20px", background: "#e0f2fe", border: "1px solid #bae6fd" }}>
            <p style={{ fontSize: "13px", color: "#0369a1" }}>
              O cliente tem ate <strong>{new Date(order.auto_complete_at).toLocaleDateString()}</strong> para aceitar ou pedir revisao. Depois disso a encomenda completa-se automaticamente.
            </p>
          </div>
        )}

        {deliveries.length > 0 && (
          <div className="card" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#404145", marginBottom: "12px" }}>Entregas</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {deliveries.map((d) => (
                <div key={d.id} style={{ borderLeft: "3px solid #1dbf73", paddingLeft: "14px" }}>
                  <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "4px" }}>{new Date(d.created_at).toLocaleString()}</p>
                  {d.message && <p style={{ fontSize: "14px", color: "#404145", marginBottom: "6px", whiteSpace: "pre-wrap" }}>{d.message}</p>}
                  {d.files && d.files.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {d.files.map((f, i) => (
                        <a key={i} href={f} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", color: "#1dbf73", wordBreak: "break-all" }}>{f}</a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {revisionRequests.length > 0 && (
          <div className="card" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#404145", marginBottom: "12px" }}>Pedidos de revisao</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {revisionRequests.map((r) => (
                <div key={r.id} style={{ borderLeft: "3px solid #f5a623", paddingLeft: "14px" }}>
                  <p style={{ fontSize: "12px", color: "#74767e", marginBottom: "4px" }}>{new Date(r.created_at).toLocaleString()}</p>
                  <p style={{ fontSize: "14px", color: "#404145", whiteSpace: "pre-wrap" }}>{r.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {actionMsg && (
          <div className="card" style={{ marginBottom: "20px", background: "#fee2e2", border: "1px solid #fecaca" }}>
            <p style={{ fontSize: "13px", color: "#991b1b" }}>{actionMsg}</p>
          </div>
        )}

        {canDeliver && (
          <div className="card" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#404145", marginBottom: "12px" }}>Entregar trabalho</h2>
            <textarea
              className="input-field"
              placeholder="Mensagem para o cliente..."
              rows={4}
              value={deliverMessage}
              onChange={(e) => setDeliverMessage(e.target.value)}
              style={{ marginBottom: "10px", resize: "vertical" }}
            />
            <input
              className="input-field"
              placeholder="Links de ficheiros (separados por virgula) - ex: Google Drive"
              value={deliverFiles}
              onChange={(e) => setDeliverFiles(e.target.value)}
              style={{ marginBottom: "12px" }}
            />
            <button className="btn-green" onClick={handleDeliver} disabled={submitting}>
              {submitting ? "A enviar..." : "Enviar entrega"}
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {canAccept && (
            <button className="btn-green" onClick={handleAccept} disabled={submitting}>
              Aceitar entrega e liberar pagamento
            </button>
          )}
          {canRequestRevision && !showRevisionForm && (
            <button className="btn-outline" onClick={() => setShowRevisionForm(true)} disabled={submitting}>
              Pedir revisao
            </button>
          )}
          {awaitingPayment && (
            <Link href={`/checkout?orderId=${order.id}`} className="btn-green" style={{ textDecoration: "none" }}>
              Pagar agora
            </Link>
          )}
          {canCancel && (
            <button className="btn-danger" onClick={() => handleStatusChange("cancelled")} disabled={submitting}>
              Cancelar encomenda
            </button>
          )}
        </div>

        {showRevisionForm && (
          <div className="card" style={{ marginTop: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#404145", marginBottom: "12px" }}>Pedir revisao</h2>
            <textarea
              className="input-field"
              placeholder="Descreve o que precisa ser ajustado..."
              rows={4}
              value={revisionMessage}
              onChange={(e) => setRevisionMessage(e.target.value)}
              style={{ marginBottom: "12px", resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-green" onClick={handleRequestRevision} disabled={submitting}>
                {submitting ? "A enviar..." : "Enviar pedido"}
              </button>
              <button className="btn-outline" onClick={() => setShowRevisionForm(false)} disabled={submitting}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
