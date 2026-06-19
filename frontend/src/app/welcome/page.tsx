"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeModal() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleNext = () => {
    if (selected === "client") {
      router.push("/dashboard");
    } else if (selected === "freelancer") {
      router.push("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-green-600 to-green-700" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-5xl text-center mb-4"
          >
            🎉
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2"
          >
            {username ? `${username}, sua conta foi criada!` : "Sua conta foi criada!"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 text-center mb-8 text-lg"
          >
            O que te traz ao Freelancer MZ?
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected("client")}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${selected === "client" ? "border-green-500 bg-green-50 shadow-lg shadow-green-100" : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"}`}
            >
              <div className="text-4xl mb-3">💼</div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Sou Cliente</h3>
              <p className="text-sm text-gray-500">Quero contratar freelancers para os meus projetos</p>
              {selected === "client" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected("freelancer")}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${selected === "freelancer" ? "border-green-500 bg-green-50 shadow-lg shadow-green-100" : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"}`}
            >
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Sou Freelancer</h3>
              <p className="text-sm text-gray-500">Quero encontrar trabalho e oferecer os meus servicos</p>
              {selected === "freelancer" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          </div>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleNext}
            disabled={!selected}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${selected ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:from-green-500 hover:to-green-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            Proximo
          </motion.button>
          <p className="text-center text-gray-400 text-sm mt-4">
            Podes alterar isto mais tarde nas configuracoes
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}