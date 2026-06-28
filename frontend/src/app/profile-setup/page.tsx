"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileSetup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.match(/^[a-zA-Z][a-zA-Z0-9_]*$/)) {
      setError("Seu nome de usuario deve comecar com uma letra e pode incluir numeros e sublinhados.");
      return;
    }
    
    localStorage.setItem("token", "demo_token");
    localStorage.setItem("username", username);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex">
        <div className="hidden md:flex w-1/2 bg-green-800 items-center justify-center p-8 relative">
          <div className="absolute top-8 left-8">
            <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">F</div>
              <span className="font-medium">Faith</span>
              <span className="text-green-500">?</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">J</div>
              <span className="font-medium">Jonthan_coleman</span>
              <span className="text-green-500">?</span>
            </div>
          </div>
          
          <div className="text-white z-10 mt-32">
            <div className="w-64 h-64 bg-green-700/50 rounded-full flex items-center justify-center">
              <span className="text-6xl">??</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <Link href="/register" className="text-gray-600 hover:text-green-600 flex items-center gap-2 mb-6">
            ? Voltar
          </Link>

          <h1 className="text-3xl font-bold mb-4">Crie seu perfil</h1>
          
          <p className="text-gray-600 mb-6">
            Escolha um nome de usuario que seja exclusivo para voce; e assim que voce aparecera para os outros.
          </p>
          
          <p className="text-gray-600 mb-8">
            Voce nao pode alterar seu nome de usuario, entao escolha com sabedoria.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block font-semibold text-gray-800 mb-2">
              Escolha um nome de usuario
            </label>
            
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="john_smith"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
              />
              {error && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xl">!</span>
              )}
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition"
            >
              Criar minha conta
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
