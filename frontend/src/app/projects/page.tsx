"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  client_name: string;
  created_at: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projetos Disponiveis</h1>
          <Link href="/projects/new" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            + Novo Projeto
          </Link>
        </div>
        
        {loading ? (
          <p className="text-center text-gray-600">A carregar...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum projeto ainda.</p>
            <Link href="/projects/new" className="text-blue-600 hover:underline mt-2 inline-block">
              Seja o primeiro a publicar!
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-600 font-semibold">{project.budget} MZN</span>
                  <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">{project.category}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">Por: {project.client_name}</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Enviar Proposta
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
