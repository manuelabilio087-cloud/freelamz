import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b shadow-sm sticky top-0 bg-white z-50">
        <h1 className="text-2xl font-black text-green-600 tracking-tight">Freelamz</h1>
        <div className="hidden md:flex items-center gap-2 flex-1 mx-8">
          <div className="flex items-center w-full max-w-lg border-2 border-gray-200 rounded-lg px-4 py-2 hover:border-green-500 transition">
            <span className="text-gray-400 mr-2">🔍</span>
            <input type="text" placeholder="Pesquisar servicos..." className="outline-none w-full text-sm" />
            <button className="bg-green-600 text-white px-4 py-1 rounded-md text-sm font-medium ml-2">Buscar</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-gray-700 font-medium hover:text-green-600 transition">Entrar</Link>
          <Link href="/register" className="px-5 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition">Registar</Link>
        </div>
      </nav>

      {/* Hero com imagem de fundo */}
      <section className="relative text-white py-32 px-8 overflow-hidden" style={{minHeight: "520px"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-transparent z-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}></div>
        <div className="max-w-2xl relative z-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Encontra o talento <br/>
            <span className="text-green-400">certo para o teu negocio</span>
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Milhares de freelancers qualificados em Mocambique
          </p>
          <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-xl max-w-lg">
            <span className="px-4 text-gray-400">🔍</span>
            <input type="text" placeholder="Pesquisar qualquer servico..." className="flex-1 py-4 outline-none text-gray-800" />
            <button className="bg-green-600 text-white px-6 py-4 font-bold hover:bg-green-700 transition">Buscar</button>
          </div>
          <div className="flex gap-4 mt-6 text-sm text-gray-300">
            <span>Popular:</span>
            {["Web Design", "Marketing", "Traducao", "Video"].map((tag, i) => (
              <span key={i} className="border border-gray-400 px-3 py-1 rounded-full hover:border-white cursor-pointer transition">{tag}</span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-6 right-8 z-20 flex gap-8 text-center">
          <div><div className="text-2xl font-black">500+</div><div className="text-xs text-gray-300">Freelancers</div></div>
          <div><div className="text-2xl font-black">1.2k+</div><div className="text-xs text-gray-300">Projectos</div></div>
          <div><div className="text-2xl font-black">98%</div><div className="text-xs text-gray-300">Satisfacao</div></div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 px-8 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <h3 className="text-2xl font-black">Explorar categorias</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "💻", name: "Desenvolvimento Web", color: "bg-blue-600" },
              { icon: "🎨", name: "Design Grafico", color: "bg-pink-600" },
              { icon: "📱", name: "App Mobile", color: "bg-purple-600" },
              { icon: "📊", name: "Marketing Digital", color: "bg-orange-500" },
              { icon: "✍️", name: "Redacao", color: "bg-yellow-600" },
              { icon: "🎵", name: "Audio e Musica", color: "bg-red-600" },
              { icon: "📷", name: "Fotografia", color: "bg-teal-600" },
              { icon: "🌐", name: "Traducao", color: "bg-green-600" },
            ].map((cat, i) => (
              <div key={i} className={`${cat.color} rounded-xl p-6 text-white cursor-pointer hover:opacity-90 transition group`}>
                <div className="text-4xl mb-3">{cat.icon}</div>
                <p className="font-bold">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicos populares */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-black mb-8">Servicos populares</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Vou criar o teu website profissional", name: "Joao M.", rating: "4.9", price: "2.500 MT", tag: "Desenvolvimento Web" },
              { title: "Vou desenhar o teu logo em 24h", name: "Maria S.", rating: "5.0", price: "1.500 MT", tag: "Design Grafico" },
              { title: "Vou gerir as tuas redes sociais", name: "Pedro A.", rating: "4.8", price: "3.000 MT", tag: "Marketing" },
              { title: "Vou traduzir os teus documentos", name: "Ana L.", rating: "4.9", price: "800 MT", tag: "Traducao" },
            ].map((service, i) => (
              <div key={i} className="border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group">
                <div className="h-40 bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-5xl group-hover:scale-105 transition">
                  {["💻", "🎨", "📱", "🌐"][i]}
                </div>
                <div className="p-4">
                  <span className="text-xs text-green-600 font-medium">{service.tag}</span>
                  <p className="font-semibold text-gray-800 mt-1 mb-3 line-clamp-2">{service.title}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {service.name[0]}
                    </div>
                    <span className="text-sm text-gray-600">{service.name}</span>
                    <span className="text-yellow-500 text-xs">⭐ {service.rating}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">A partir de</span>
                    <span className="font-black text-gray-800">{service.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 bg-green-700 text-white text-center">
        <h3 className="text-4xl font-black mb-4">Pronto para comecar?</h3>
        <p className="text-green-100 mb-10 text-lg">Junta-te a comunidade Freelamz hoje mesmo</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="px-8 py-4 bg-white text-green-700 rounded-md font-bold hover:bg-green-50 text-lg shadow-lg">
            Criar conta gratis
          </Link>
          <Link href="/projects" className="px-8 py-4 border-2 border-white text-white rounded-md font-bold hover:bg-green-600 text-lg">
            Ver projectos
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-white mb-1">Freelamz</h2>
            <p className="text-sm">A plataforma freelance de Mocambique 🇲🇿</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/login" className="hover:text-white transition">Entrar</Link>
            <Link href="/register" className="hover:text-white transition">Registar</Link>
            <Link href="/projects" className="hover:text-white transition">Projectos</Link>
          </div>
          <p className="text-sm">© 2024 Freelamz</p>
        </div>
      </footer>
    </main>
  );
}
