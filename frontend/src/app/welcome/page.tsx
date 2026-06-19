"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Welcome() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);
const handleNext = () => {
  if (selected === "client") {
    router.push("/client-dashboard");  // Cliente vai para dashboard de cliente
  } else if (selected === "freelancer") {
    router.push("/dashboard");  // Freelancer vai para dashboard normal
  }
};
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          {username ? `${username}, sua conta foi criada!` : "Sua conta foi criada!"}
        </h1>
        <p className="text-gray-500 text-center mb-8">O que te traz ao Freelancer MZ?</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelected("client")}
            className={`p-6 rounded-xl border-2 text-left transition ${
              selected === "client"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-300"
            }`}
          >
            <div className="text-3xl mb-2">💼</div>
            <h3 className="font-bold">Sou Cliente</h3>
            <p className="text-sm text-gray-500">Quero contratar freelancers</p>
          </button>

          <button
            onClick={() => setSelected("freelancer")}
            className={`p-6 rounded-xl border-2 text-left transition ${
              selected === "freelancer"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-300"
            }`}
          >
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-bold">Sou Freelancer</h3>
            <p className="text-sm text-gray-500">Quero encontrar trabalho</p>
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-3 rounded-xl font-bold ${
            selected
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Proximo
        </button>
      </div>
    </div>
  );
}