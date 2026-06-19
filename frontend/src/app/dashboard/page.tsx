"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    // Aqui vamos buscar o perfil do user depois
    setUser({ name: "Utilizador", role: "freelancer" });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">A carregar...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Freelamz
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Ola, {user.name}</span>
              <button 
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="text-red-600 hover:text-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/projects" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Projetos</h2>
            <p className="text-gray-600">Ver projetos disponiveis</p>
          </Link>
          
          <Link href="/profile" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Perfil</h2>
            <p className="text-gray-600">Editar o teu perfil</p>
          </Link>
          
          <Link href="/messages" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Mensagens</h2>
            <p className="text-gray-600">Ver conversas</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
