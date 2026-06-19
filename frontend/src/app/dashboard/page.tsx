"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profileProgress, setProfileProgress] = useState(35);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setUser({ name: username || "Freelancer", role: "freelancer" });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">A carregar...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Bem-vindo ao Freelamz, {user.name}</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Publicar Gig */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-bold mb-2">Publique um serviço (Gig)</h3>
              <p className="text-gray-600 text-sm">Crie um serviço para começar a vender e receber encomendas</p>
            </div>
            
            {/* Card 2 - Encomendas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-bold mb-2">Encomendas ativas</h3>
              <p className="text-gray-600 text-sm">Acompanhe os trabalhos em andamento e prazos</p>
            </div>
            
            {/* Card 3 - Progresso */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="font-bold mb-2">Progresso do perfil</h3>
              <p className="text-gray-600 text-sm">Você completou {profileProgress}% do seu perfil</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${profileProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ganhos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Ganhos</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border">
              <p className="text-gray-600 text-sm mb-1">Ganhos totais</p>
              <p className="text-3xl font-bold text-green-600">0 MZN</p>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <p className="text-gray-600 text-sm mb-1">A receber</p>
              <p className="text-3xl font-bold text-blue-600">0 MZN</p>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <p className="text-gray-600 text-sm mb-1">Disponível para levantamento</p>
              <p className="text-3xl font-bold text-gray-800">0 MZN</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias Populares */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Explore categorias para vender</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Desenvolvimento Web", icon: "💻" },
              { name: "Design Gráfico", icon: "🎨" },
              { name: "Marketing Digital", icon: "📢" },
              { name: "Redação e Tradução", icon: "📝" },
              { name: "Vídeo e Animação", icon: "🎬" },
              { name: "Música e Áudio", icon: "🎵" },
            ].map((cat) => (
              <div key={cat.name} className="bg-white p-4 rounded-xl border hover:shadow-md transition text-center cursor-pointer">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="text-sm font-medium">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Encomendas Recentes */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Encomendas recentes</h2>
          
          <div className="bg-white rounded-xl border p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium mb-2">Nenhuma encomenda ainda</h3>
            <p className="text-gray-600 mb-4">Publique seu primeiro serviço (Gig) para começar a receber encomendas</p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700">
              Criar Gig
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}