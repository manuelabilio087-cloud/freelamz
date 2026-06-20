import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <h1 className="text-2xl font-bold text-green-600">Freelamz</h1>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-green-600">Entrar</Link>
          <Link href="/register" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Registar</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-24 px-8 text-center">
        <h2 className="text-5xl font-bold mb-6">A plataforma freelance de Mocambique</h2>
        <p className="text-xl mb-10 text-green-100">Encontre freelancers talentosos ou oferede os seus servicos</p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 bg-white text-green-700 rounded-xl font-bold hover:bg-green-50 text-lg">
            Comecar agora
          </Link>
          <Link href="/projects" className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-green-700 text-lg">
            Ver projetos
          </Link>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 px-8">
        <h3 className="text-3xl font-bold text-center mb-12">Categorias populares</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: "💻", name: "Desenvolvimento Web" },
            { icon: "🎨", name: "Design Grafico" },
            { icon: "📱", name: "App Mobile" },
            { icon: "📊", name: "Marketing Digital" },
            { icon: "✍️", name: "Redacao" },
            { icon: "🎵", name: "Audio e Musica" },
            { icon: "📷", name: "Fotografia" },
            { icon: "🌐", name: "Traducao" },
          ].map((cat, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition cursor-pointer border hover:border-green-400">
              <div className="text-4xl mb-3">{cat.icon}</div>
              <p className="font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 px-8 bg-gray-50">
        <h3 className="text-3xl font-bold text-center mb-12">Como funciona</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-5xl mb-4">📝</div>
            <h4 className="text-xl font-bold mb-2">1. Publica o teu projeto</h4>
            <p className="text-gray-600">Descreve o que precisas e define o teu orcamento</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h4 className="text-xl font-bold mb-2">2. Recebe propostas</h4>
            <p className="text-gray-600">Freelancers qualificados enviam as suas propostas</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h4 className="text-xl font-bold mb-2">3. Trabalho feito</h4>
            <p className="text-gray-600">Colabora e paga so quando estiveres satisfeito</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8 text-center bg-green-700 text-white">
        <h3 className="text-3xl font-bold mb-4">Pronto para comecar?</h3>
        <p className="text-green-100 mb-8 text-lg">Junta-te a milhares de freelancers e clientes em Mocambique</p>
        <Link href="/register" className="px-8 py-4 bg-white text-green-700 rounded-xl font-bold hover:bg-green-50 text-lg">
          Criar conta gratis
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 text-center text-gray-500 border-t">
        <p>© 2024 Freelamz - Plataforma Freelance de Mocambique</p>
      </footer>
    </main>
  );
}
