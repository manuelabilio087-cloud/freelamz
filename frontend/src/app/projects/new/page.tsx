"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NewProject() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, budget: parseFloat(budget), category }),
      });
      const data = await res.json();
      if (data.id) {
        setMessage("Projeto publicado com sucesso!");
        setTimeout(() => router.push("/projects"), 1500);
      } else {
        setMessage(data.message || "Erro ao publicar");
      }
    } catch (err) {
      setMessage("Erro de conexao");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Publicar Novo Projeto</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titulo</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descricao</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg h-32" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Orcamento (MZN)</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Escolher...</option>
              <option value="Design">Design Grafico</option>
              <option value="Desenvolvimento">Desenvolvimento Web</option>
              <option value="Traducao">Traducao</option>
              <option value="Marketing">Marketing Digital</option>
              <option value="Contabilidade">Contabilidade</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">
            Publicar Projeto
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}
