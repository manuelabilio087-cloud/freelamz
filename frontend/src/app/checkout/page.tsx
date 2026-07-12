"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

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
  const [step, setStep] = useState<"review" | "payment">("review");
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [paymentError, setPaymentError] = useState("");

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
        setCreatedOrderId(data.order.id);
        setStep("payment");
      } else {
        alert(data.message || "Erro ao criar pedido");
      }
    } catch (err) {
      alert("Erro de conexao");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    const token = localStorage.getItem("token");
    if (!token || !createdOrderId) return;

    setPaymentError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: createdOrderId,
          amount: calculateTotal(),
          mpesa_number: mpesaNumber,
          description: `Pagamento da encomenda #${createdOrderId} - ${checkoutData?.gig.title}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/orders");
      } else {
        setPaymentError(data.message || "Erro ao processar pagamento");
      }
    } catch (err) {
      setPaymentError("Erro de conexao");
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>Carregando...</div>
    </div>
  );

  const availableExtras = [
    { name: "Entrega rapida (+1 dia)", price: 500 },
    { name: "Revisoes ilimitadas", price: 300 },
    { name: "Codigo fonte incluido", price: 400 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7", fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <style>{`
        .btn-green { background: #1dbf73; color: #fff; padding: 14px 32px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-size: 16px; }
        .btn-green:hover { background: #19a463; }
        .btn-green:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-outline { background: #fff; color: #404145; padding: 10px 20px; border-radius: 6px; font-weight: 600; border: 1px solid #e4e5e7; cursor: pointer; }
        .card { background: #fff; border: 1px solid #e4e5e7; border-radius: 12px; padding: 24px; }
        .extra-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid #e4e5e7; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
        .extra-item:hover { border-color: #1dbf73; }
        .extra-item.selected { border-color: #1dbf73; background: #f0fdf4; }
        .checkout-actions { display: flex; gap: 12px; }
        @media (max-width: 640px) {
          .checkout-wrap { padding: 16px !important; }
          .card { padding: 16px !important; }
          .checkout-actions { flex-direction: column-reverse; }
        }
      `}</style>

      <div className="checkout-wrap" style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <Link href={`/gig/${checkoutData.gig.id}`} style={{ color: "#1dbf73", textDecoration: "none", fontSize: "14px" }}>← Voltar ao servico</Link>
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#404145", marginBottom: "24px" }}>Checkout</h1>

        {step === "payment" && (
          <div className="card" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#404145", marginBottom: "4px" }}>Pagar com M-Pesa</h2>
            <p style={{ fontSize: "13px", color: "#74767e", marginBottom: "16px" }}>
              A encomenda foi criada e está reservada. O freelancer só vê o pedido depois de confirmares o pagamento.
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f1f1", marginBottom: "16px" }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#404145" }}>Total a pagar</span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#1dbf73" }}>{calculateTotal()} MT</span>
            </div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#404145", display: "block", marginBottom: "6px" }}>Número M-Pesa</label>
            <input
              type="tel"
              value={mpesaNumber}
              onChange={(e) => setMpesaNumber(e.target.value)}
              placeholder="84xxxxxxx / 85xxxxxxx / 86xxxxxxx / 87xxxxxxx"
              style={{ width: "100%", padding: "12px", border: "1px solid #e4e5e7", borderRadius: "8px", fontSize: "14px", marginBottom: "12px" }}
            />
            {paymentError && (
              <p style={{ color: "#e6392f", fontSize: "13px", marginBottom: "12px" }}>{paymentError}</p>
            )}
            <button onClick={handlePay} className="btn-green" disabled={loading || !mpesaNumber} style={{ width: "100%" }}>
              {loading ? "A confirmar pagamento..." : `Pagar ${calculateTotal()} MT`}
            </button>
          </div>
        )}

        {step === "review" && (
        <>
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

        <div className="checkout-actions">
          <button onClick={handleConfirm} className="btn-green" disabled={loading} style={{ flex: 1 }}>
            {loading ? "A processar..." : `Continuar para pagamento (${calculateTotal()} MT)`}
          </button>
          <Link href="/search/gigs" className="btn-outline" style={{ textDecoration: "none" }}>Cancelar</Link>
        </div>
        </>
        )}
      </div>
    </div>
  );
}