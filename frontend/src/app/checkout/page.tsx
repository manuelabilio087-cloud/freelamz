"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://freelamz-production.up.railway.app/api";

interface CheckoutData {
  gig: { id: number; title: string };
  selectedPackage: { id: number; title: string; price: string };
}

export default function Checkout() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [requirements, setRequirements] = useState("");
  const [extras, setExtras] = useState<{ name: string; price: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("checkout_gig");
    if (data) {
      setCheckoutData(JSON.parse(data));
    } else {
      router.push("/search/gigs");
    }
  }, [router]);

  const toggleExtra = (extra: { name: string; price: number }) => {
    setExtras((prev) => {
      const exists = prev.find((e) => e.name === extra.name);
      if (exists) return prev.filter((e) => e.name !== extra.name);
      return [...prev, extra];
    });
  };

  const calculateTotal = () => {
    if (!checkoutData) return 0;
    let total = parseFloat(checkoutData.selectedPackage.price);
    extras.forEach((e) => total += e.price);
    return total;
  };

  const handleConfirm = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gig_id: checkoutData?.gig.id,
          package_id: checkoutData?.selectedPackage.id,
          extras: extras,
          requirements: requirements,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("checkout_gig");
        router.push("/orders");
      } else {
        alert(data.message || "Erro ao criar pedido");
      }
    } catch (err) {
      alert("Erro de conexao");
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Carregando...</div>;

  const availableExtras = [
    { name: "Entrega rapida (+1 dia)", price: 500 },
    { name: "Revisoes ilimitadas", price: 300 },
    { name: "Codigo fonte incluido", price: 400 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .btn-green { background: #1dbf73; color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-size: 16px; }
        .btn-green:hover { background: #19a463; }
        .btn-green:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-outline { background: #fff; color: #404145; padding: 10px 20px; border-radius: 6px; font-weight: 600; border: 1px solid #e4e5e7; cursor: pointer; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 24px; }
        .extra-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid #e4e5e7; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
        .extra-item:hover { border-color: #1dbf73; }
        .extra-item.selected { border-color: #1dbf73; background: #f0fdf4; }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <Link href={`/gig/${checkoutData.gig.id}`} style={{ color: "#1dbf73", textDecoration: "none", fontSize: "14px" }}>← Voltar ao servico</Link>
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#404145", marginBottom: "24px" }}>Checkout</h1>

        <div className="card" style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#404145", marginBottom: "12px" }}>Resumo do pedido</h2>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f1f1" }}>
            <span style={{ color: "#404145" }}>{checkoutData.gig.title}</span>
            <span style={{ fontWeight: "600" }}>{checkoutData.selectedPackage.title}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f1f1" }}>
            <span style={{ color: "#404145" }}>Pacote</span>
            <span style={{ fontWeight: "600" }}>{checkoutData.selectedPackage.price} MT</span>
          </div>
          {extras.map((extra, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f1f1" }}>
              <span style={{ color: "#404145" }}>{extra.name}</span>
              <span style={{ fontWeight: "600" }}>+{extra.price} MT</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 0", marginTop: "8px" }}>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "#404145" }}>Total</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "#1dbf73" }}>{calculateTotal()} MT</span>
          </div>
          <p style={{ fontSize: "12px", color: "#74767e", marginTop: "8px" }}>Taxa de servico: 5.5% + 3 MT em pedidos menores que 100 MT</p>
        </div>

        <div className="card" style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#404145", marginBottom: "12px" }}>Extras</h2>
          {availableExtras.map((extra, i) => (
            <div key={i} className={`extra-item ${extras.find((e) => e.name === extra.name) ? "selected" : ""}`} onClick={() => toggleExtra(extra)}>
              <div>
                <p style={{ fontWeight: "600", color: "#404145" }}>{extra.name}</p>
              </div>
              <span style={{ fontWeight: "700", color: "#1dbf73" }}>+{extra.price} MT</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#404145", marginBottom: "12px" }}>Requisitos do projeto</h2>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Descreva o que precisa, detalhes, referencias, etc..."
            style={{ width: "100%", padding: "12px", border: "1px solid #e4e5e7", borderRadius: "8px", minHeight: "120px", fontSize: "14px", resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={handleConfirm} className="btn-green" disabled={loading} style={{ flex: 1 }}>
            {loading ? "A processar..." : `Confirmar e pagar (${calculateTotal()} MT)`}
          </button>
          <Link href="/search/gigs" className="btn-outline" style={{ textDecoration: "none" }}>Cancelar</Link>
        </div>
      </div>
    </div>
  );
}