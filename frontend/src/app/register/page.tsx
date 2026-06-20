"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao registar");
        return;
      }

      login(data.token, data.user);
      router.push("/welcome");
    } catch (err) {
      setError("Erro de conexao com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex">
        <div className="hidden md:flex w-1/2 bg-green-700 items-center justify-center p-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">O sucesso comeca aqui.</h2>
            <ul className="space-y-3 text-lg">
              <li>✓ Mais de 700 categorias</li>
              <li>✓ Trabalho de qualidade feito mais rapido</li>
              <li>✓ Acesso a talentos em todo Mocambique</li>
            </ul>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-2xl font-bold mb-2">Crie a sua conta.</h1>
          <p className="text-gray-600 mb-6">
            Ja tem uma conta? <Link href="/login" className="text-green-600 hover:underline font-medium">Entre aqui.</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="O seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="********"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de conta</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
              >
                <option value="freelancer">Freelancer</option>
                <option value="client">Cliente</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "A registar..." : "Criar conta"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Ao se cadastrar, voce concorda com os Termos de Servico do Freelamz.
          </p>
        </div>
      </div>
    </main>
  );
}
