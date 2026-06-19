"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setUser({ name: username || "Cliente", role: "client" });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">A carregar...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo, {user.name}</h1>
          <p className="text-gray-600 mb-8">Encontre os melhores freelancers para os seus projetos</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Publicar Projeto */}
            <Link href="/projects/new" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition block">
              <div className="text-3xl mb-3">➕</div>
              <h3 className="font-bold mb-2">Publicar um novo projeto</h3>
              <p className="text-gray-600 text-sm">Descreva o que precisa e receba propostas de freelancers qualificados</p>
            </Link>
            
            {/* Card 2 - Meus Projetos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-bold mb-2">Meus projetos</h3>
              <p className="text-gray-600 text-sm">Acompanhe o progresso dos seus projetos em andamento</p>
            </div>
            
            {/* Card 3 - Mensagens */}
            <Link href="/messages" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition block">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold mb-2">Mensagens</h3>
              <p className="text-gray-600 text-sm">Converse com freelancers sobre seus projetos</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Projetos Ativos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Projetos em andamento</h2>
          
          <div className="bg-white rounded-xl border p-8 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-medium mb-2">Nenhum projeto ativo</h3>
            <p className="text-gray-600 mb-4">Publique seu primeiro projeto e encontre freelancers talentosos</p>
            <Link href="/projects/new" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700">
              Publicar Projeto
            </Link>
          </div>
        </div>
      </section>

      {/* Freelancers Recomendados */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Freelancers recomendados</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "João M.", skill: "Desenvolvimento Web", rating: 4.9, jobs: 127, image: "👨‍💻" },
              { name: "Maria S.", skill: "Design Gráfico", rating: 4.8, jobs: 89, image: "👩‍🎨" },
              { name: "Pedro A.", skill: "Marketing Digital", rating: 4.7, jobs: 56, image: "👨‍💼" },
              { name: "Ana L.", skill: "Tradução", rating: 5.0, jobs: 203, image: "👩‍🏫" },
            ].map((freelancer, i) => (
              <div key={i} className="bg-white rounded-xl border p-6 hover:shadow-md transition">
                <div className="text-4xl mb-3 text-center">{freelancer.image}</div>
                <h3 className="font-bold text-center mb-1">{freelancer.name}</h3>
                <p className="text-gray-600 text-sm text-center mb-3">{freelancer.skill}</p>
                <div className="flex justify-center items-center gap-2 mb-3">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{freelancer.rating}</span>
                  <span className="text-gray-400 text-sm">({freelancer.jobs} trabalhos)</span>
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                  Ver Perfil
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}