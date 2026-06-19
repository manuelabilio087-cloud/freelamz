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
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-bold mb-2">Publique um resumo do projeto</h3>
              <p className="text-gray-600 text-sm">Receba ofertas personalizadas para as suas necessidades</p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold mb-2">Baixe o aplicativo Freelamz</h3>
              <p className="text-gray-600 text-sm">Mantenha-se produtivo, onde quer que você vá</p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="font-bold mb-2">Progresso do perfil</h3>
              <p className="text-gray-600 text-sm">Você adicionou {profileProgress}% do seu perfil</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${profileProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias Populares */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Explore as categorias populares</h2>
            <Link href="/projects" className="text-green-600 hover:underline">Mostrar tudo</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Conteúdo gerado pelo usuário (UGC)", icon: "🎥" },
              { name: "Design de logotipo", icon: "🎨" },
              { name: "Desenvolvimento de Websites", icon: "💻" },
              { name: "Marketing Digital", icon: "📢" },
              { name: "Redação e Tradução", icon: "📝" },
              { name: "Vídeo e Animação", icon: "🎬" },
            ].map((cat) => (
              <Link href={`/projects?category=${cat.name}`} key={cat.name} className="bg-white p-4 rounded-xl border hover:shadow-md transition text-center">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="text-sm font-medium">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços Recomendados */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Serviços recomendados para você</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Criarei vídeos e anúncios bilíngues", author: "La...", rating: "Mais bem avaliado", image: "🎥" },
              { title: "Serei sua especialista em mídias sociais", author: "Abig...", rating: "Profissional Verificado", image: "📱" },
              { title: "Vou gravar um comercial em vídeo", author: "As...", rating: "Mais bem avaliado", image: "🎬" },
              { title: "Criarei um vídeo de conteúdo cativante", author: "M...", rating: "Mais bem avaliado", image: "🎥" },
            ].map((service, i) => (
              <div key={i} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition">
                <div className="h-40 bg-gray-200 flex items-center justify-center text-6xl">{service.image}</div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm font-medium">{service.author}</span>
                  </div>
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{service.title}</h3>
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">{service.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}