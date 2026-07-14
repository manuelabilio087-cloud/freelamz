"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const API_URL = "https://freelamz-production.up.railway.app/api";

interface Order {
  id: number;
  gig_title: string;
  gig_image: string;
  client_name: string;
  freelancer_name: string;
  total_amount: string;
  delivery_date: string;
  status: string;
  client_id: number;
  freelancer_id: number;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#1dbf73";
      case "in_progress": return "#f5a623";
      case "pending_payment": return "#e6392f";
      case "pending": return "#74767e";
      default: return "#74767e";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Concluido";
      case "in_progress": return "Em progresso";
      case "pending_payment": return "Aguarda pagamento";
      case "pending": return "Pendente";
      default: return status;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <style>{`
        .btn-green { background: #1dbf73; color: #fff; padding: 10px 20px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 20px; }
        @media (max-width: 640px) {
          .orders-wrap { padding: 16px !important; }
          .card { padding: 14px !important; }
        }
      `}</style>

      <div className="orders-wrap" style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#404145", marginBottom: "24px" }}>Meus pedidos</h1>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Carregando...</div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#74767e", marginBottom: "16px" }}>Ainda nao tem pedidos.</p>
            <Link href="/search/gigs" className="btn-green" style={{ textDecoration: "none", display: "inline-block" }}>Explorar servicos</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #1dbf73, #0a8c55)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0 }}>
                    💼
                  </div>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#404145" }}>{order.gig_title}</h3>
                      <span style={{ background: getStatusColor(order.status), color: "#fff", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#74767e", marginBottom: "8px" }}>
                      {order.client_id === order.freelancer_id ? "Freelancer: " : "Cliente: "}
                      {order.client_id === order.freelancer_id ? order.freelancer_name : order.client_name}
                    </p>
                    <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#74767e" }}>
                      <span>Total: <strong style={{ color: "#404145" }}>{order.total_amount} MT</strong></span>
                      <span>Entrega: <strong style={{ color: "#404145" }}>{new Date(order.delivery_date).toLocaleDateString()}</strong></span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Link href={`/orders/${order.id}`} className="btn-green" style={{ textDecoration: "none", fontSize: "13px" }}>Ver detalhes</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}