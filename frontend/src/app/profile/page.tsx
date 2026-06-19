"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setUser({ name: "Manuel", email: "manuel@email.com", role: "freelancer", bio: "Desenvolvedor web", skills: "React, Node.js" });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">A carregar...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Tipo:</strong> {user.role}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <p><strong>Skills:</strong> {user.skills}</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
