"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Messages() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setUser({ name: "Manuel" });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">A carregar...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mensagens</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">Nenhuma mensagem ainda.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
