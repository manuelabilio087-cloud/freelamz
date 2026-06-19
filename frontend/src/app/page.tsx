import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Encontra Freelancers em Mocambique</h1>
          <p className="text-xl mb-8">A primeira plataforma de freelancing para talentos mocambicanos</p>
          <div className="space-x-4">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">Sou Freelancer</Link>
            <Link href="/register" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold">Sou Cliente</Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Publica o Teu Projeto</h3>
              <p className="text-gray-600">Descreve o que precisas</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Recebe Propostas</h3>
              <p className="text-gray-600">Freelancers qualificados</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Contrata e Paga</h3>
              <p className="text-gray-600">Com seguranca</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
