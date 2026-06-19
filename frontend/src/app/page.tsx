import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Encontra os Melhores Freelancers em Mocambique
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Conecta com talentos locais em design, desenvolvimento, traducao e muito mais. 
            A primeira plataforma 100% mocambicana.
          </p>
          <div className="space-x-4 space-y-4 md:space-y-0">
            <Link href="/register" className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
              Quero Trabalhar
            </Link>
            <Link href="/register" className="inline-block bg-blue-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-400 transition shadow-lg border-2 border-blue-400">
              Quero Contratar
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Como Funciona</h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">Simples, rapido e seguro. Em 3 passos encontras o que precisas.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Publica o Projeto</h3>
              <p className="text-gray-600">Descreve o que precisas, define o orcamento e prazo.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Recebe Propostas</h3>
              <p className="text-gray-600">Freelancers qualificados enviam propostas em minutos.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Contrata e Paga</h3>
              <p className="text-gray-600">Escolhe o melhor, trabalha e paga com seguranca.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para comecar?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">Junta-te a centenas de mocambicanos que ja usam o Freelamz.</p>
          <Link href="/register" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
            Criar Conta Gratis
          </Link>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
