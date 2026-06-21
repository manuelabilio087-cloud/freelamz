import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b shadow-sm sticky top-0 bg-white z-50">
        <h1 className="text-2xl font-black text-green-600 tracking-tight">Freelamz</h1>
        <div className="hidden md:flex items-center gap-2 flex-1 mx-8">
          <div className="flex items-center w-full max-w-lg border-2 border-gray-200 rounded-full px-4 py-2 hover:border-green-500 transition">
            <span className="text-gray-400 mr-2">🔍</span>
            <input type="text" placeholder="Pesquisar servicos..." className="outline-none w-full text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-gray-700 font-medium hover:text-green-600 transition">Entrar</Link>
          <Link href="/register" className="px-5 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition shadow-sm">Registar</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-700 to-green-500 text-white py-28 px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/diagmonds.png')"}}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1 rounded-full mb-6">
            🇲🇿 A plataforma #1 de freelancers em Mocambique
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Encontra o talento <br/>
            <span className="text-yellow-300">certo para o teu negocio</span>
          </h2>
          <p className="text-xl mb-10 text-green-100 max-w-2xl mx-auto">
            Milhares de freelancers qualificados prontos para ajudar o teu projecto a crescer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-full font-bold hover:bg-yellow-300 transition text-lg shadow-lg">
              Comecar agora — e gratis!
            </Link>
            <Link href="/projects" className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-green-700 transition text-lg">
              Ver projectos
            </Link>
          </div>
          <div className="flex justify-center gap-8 mt-12 text-green-100 text-sm">
            <div className="text-center">
              <div className="text-3xl font-black text-white">500+</div>
              <div>Freelancers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">1.200+</div>
              <div>Projectos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">98%</div>
              <div>Satisfacao</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-black text-center mb-3">Explora por categoria</h3>
          <p className="text-gray-500 text-center mb-12">Encontra o servico que precisas</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "💻", name: "Desenvolvimento Web", color: "bg-blue-50 hover:bg-blue-100 border-blue-200", iconBg: "bg-blue-100" },
              { icon: "🎨", name: "Design Grafico", color: "bg-pink-50 hover:bg-pink-100 border-pink-200", iconBg: "bg-pink-100" },
              { icon: "📱", name: "App Mobile", color: "bg-purple-50 hover:bg-purple-100 border-purple-200", iconBg: "bg-purple-100" },
              { icon: "📊", name: "Marketing Digital", color: "bg-orange-50 hover:bg-orange-100 border-orange-200", iconBg: "bg-orange-100" },
              { icon: "✍️", name: "Redacao", color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200", iconBg: "bg-yellow-100" },
              { icon: "🎵", name: "Audio e Musica", color: "bg-red-50 hover:bg-red-100 border-red-200", iconBg: "bg-red-100" },
              { icon: "📷", name: "Fotografia", color: "bg-teal-50 hover:bg-teal-100 border-teal-200", iconBg: "bg-teal-100" },
              { icon: "🌐", name: "Traducao", color: "bg-green-50 hover:bg-green-100 border-green-200", iconBg: "bg-green-100" },
            ].map((cat, i) => (
              <div key={i} className={`${cat.color} border-2 rounded-2xl p-6 text-center cursor-pointer transition group`}>
                <div className={`${cat.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition`}>
                  {cat.icon}
                </div>
                <p className="font-bold text-gray-800">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-black text-center mb-3">Como funciona?</h3>
          <p className="text-gray-500 text-center mb-16">Simple, rapido e seguro</p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: "📝", step: "01", title: "Publica o teu projecto", desc: "Descreve o que precisas e define o teu orcamento em minutos" },
              { icon: "🤝", step: "02", title: "Recebe propostas", desc: "Freelancers qualificados enviam propostas com os seus preco e prazo" },
              { icon: "✅", step: "03", title: "Projecto entregue!", desc: "Colabora, revisa e paga so quando estiveres 100% satisfeito" },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="text-6xl mb-4">{item.icon}</div>
                <div className="text-5xl font-black text-green-100 absolute top-0 right-0">{item.step}</div>
                <h4 className="text-xl font-black mb-3">{item.title}</h4>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 bg-gradient-to-r from-green-600 to-green-800 text-white text-center">
        <h3 className="text-4xl font-black mb-4">Pronto para comecar?</h3>
        <p className="text-green-100 mb-10 text-lg max-w-xl mx-auto">Junta-te a comunidade de freelancers e clientes em Mocambique</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register?role=client" className="px-8 py-4 bg-white text-green-700 rounded-full font-bold hover:bg-green-50 text-lg shadow-lg">
            Sou Cliente
          </Link>
          <Link href="/register?role=freelancer" className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-green-700 text-lg">
            Sou Freelancer
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-white mb-1">Freelamz</h2>
            <p className="text-sm">A plataforma freelance de Mocambique</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/login" className="hover:text-white transition">Entrar</Link>
            <Link href="/register" className="hover:text-white transition">Registar</Link>
            <Link href="/projects" className="hover:text-white transition">Projectos</Link>
          </div>
          <p className="text-sm">© 2024 Freelamz. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
