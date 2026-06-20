"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";

const API_URL = "https://freelamz-production.up.railway.app/api";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao fazer login");
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
        <div className="hidden md:flex w-1/2 bg-green-800 items-center justify-center p-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">Bem-vindo de volta!</h2>
            <p className="text-green-100">Entre na sua conta para continuar.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-6">Entrar</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "A entrar..." : "Entrar"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Nao tem conta? <Link href="/register" className="text-green-600 hover:underline">Registar</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
