import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Freelamz
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/projects" className="text-gray-700 hover:text-blue-600">
                Projetos
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Entrar
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Registar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Encontra Freelancers em Mocambique
          </h1>
          <p className="text-xl mb-8">
            A primeira plataforma de freelancing para talentos mocambicanos
          </p>
          <div className="space-x-4">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Sou Freelancer
            </Link>
            <Link href="/register" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400">
              Sou Cliente
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Publica o Teu Projeto</h3>
              <p className="text-gray-600">Descreve o que precisas e define o orcamento</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Recebe Propostas</h3>
              <p className="text-gray-600">Freelancers qualificados enviam propostas</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Contrata e Paga</h3>
              <p className="text-gray-600">Escolhe o melhor e paga com seguranca</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
