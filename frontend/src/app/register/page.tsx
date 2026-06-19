"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex">
        <div className="hidden md:flex w-1/2 bg-green-700 items-center justify-center p-8 relative">
          <div className="text-white z-10">
            <h2 className="text-3xl font-bold mb-4">O sucesso comeca aqui.</h2>
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-2">
                <span className="text-green-300">?</span> Mais de 700 categorias
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">?</span> Trabalho de qualidade feito mais rapido
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">?</span> Acesso a talentos em todo Mocambique
              </li>
            </ul>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-green-800/50 h-48 rounded-t-full mx-4"></div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-2xl font-bold mb-2">Crie a sua conta.</h1>
          <p className="text-gray-600 mb-6">
            Ja tem uma conta? <Link href="/login" className="text-green-600 hover:underline font-medium">Entre aqui.</Link>
          </p>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 mb-3 hover:bg-gray-50 transition">
            <span className="text-xl">G</span>
            <span className="font-medium">Continuar com o Google</span>
          </button>

          <button 
            onClick={() => router.push("/profile-setup")}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 mb-3 hover:bg-gray-50 transition"
          >
            <span className="text-xl">?</span>
            <span className="font-medium">Continuar com o e-mail</span>
          </button>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="flex gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50">
              <span>??</span> Maca
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50">
              <span className="text-blue-600">f</span> Facebook
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Ao se cadastrar, voce concorda com os <Link href="#" className="text-green-600 hover:underline">Termos de Servico</Link> do Freelamz.
          </p>
        </div>
      </div>
    </main>
  );
}
