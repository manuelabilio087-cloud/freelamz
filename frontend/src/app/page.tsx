import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm" style={{height:"80px"}}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="flex flex-col gap-1 p-2">
              <span className="w-5 h-0.5 bg-gray-700"></span>
              <span className="w-5 h-0.5 bg-gray-700"></span>
              <span className="w-5 h-0.5 bg-gray-700"></span>
            </button>
            <Link href="/" className="text-2xl font-black text-green-600">Freelamz</Link>
          </div>
          <div className="hidden md:flex items-center border border-gray-200 rounded-full px-4 py-2 shadow-sm w-80 bg-white">
            <input type="text" placeholder="Que tipo de servico voce procura?" className="outline-none text-sm flex-1 text-gray-600" />
            <button className="text-gray-500 hover:text-green-600">🔍</button>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-700 font-medium">
            <button className="hover:text-green-600">Explorar ▼</button>
            <button className="hover:text-green-600">Categorias ▼</button>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/register?role=freelancer" className="text-sm text-gray-700 hover:text-green-600 hidden md:block">Torne-se Freelancer</Link>
            <Link href="/login" className="text-sm text-gray-700 font-medium px-4 py-2 hover:text-green-600">Entrar</Link>
            <Link href="/register" className="text-sm bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition hover:scale-105">Cadastrar-se</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex items-center" style={{height:"100vh", marginTop:"0"}}>
        <div className="absolute inset-0" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}></div>
        <div className="absolute inset-0" style={{background: "rgba(0,0,0,0.45)"}}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20">
          <h1 className="text-white font-light leading-tight mb-8" style={{fontSize:"82px", fontWeight:"300", maxWidth:"700px"}}>
            Nossos freelancers darao continuidade ao seu trabalho.
          </h1>
          <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-2xl" style={{maxWidth:"900px", height:"70px"}}>
            <span className="px-5 text-gray-400 text-xl">🔍</span>
            <input type="text" placeholder="Pesquise qualquer servico..." className="flex-1 outline-none text-gray-800 text-lg" />
            <button className="bg-black text-white px-8 h-full font-semibold text-lg hover:bg-gray-800 transition">Buscar</button>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            {["Desenvolvimento de Websites →", "Design Grafico →", "Videos UGC →", "Edicao de Video →", "Marketing Digital →"].map((tag, i) => (
              <button key={i} className="border border-white text-white text-sm px-4 py-2 rounded-full hover:bg-white hover:text-gray-900 transition">
                {tag}
              </button>
            ))}
          </div>
          <div className="flex gap-8 mt-12 text-white opacity-80">
            <div className="text-sm">Aprovado por: <span className="font-bold ml-2">Meta · Google · Netflix · PayPal · Payoneer</span></div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-10">Categorias Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "💻", name: "Programacao e Tecnologia" },
              { icon: "🎨", name: "Design Grafico" },
              { icon: "📊", name: "Marketing Digital" },
              { icon: "✍️", name: "Redacao e Traducao" },
              { icon: "🎬", name: "Video e Animacao" },
              { icon: "🤖", name: "Servicos de IA" },
              { icon: "🎵", name: "Musica e Audio" },
              { icon: "💼", name: "Negocios" },
            ].map((cat, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 text-center cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300" style={{height:"180px"}}>
                <div className="text-5xl mb-4">{cat.icon}</div>
                <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICOS POPULARES */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-10">Servicos Populares</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Vou criar o teu website profissional", name: "Joao M.", rating: "4.9", reviews: "127", price: "2.500 MT", icon: "💻" },
              { title: "Vou desenhar o teu logo em 24h", name: "Maria S.", rating: "5.0", reviews: "89", price: "1.500 MT", icon: "🎨" },
              { title: "Vou gerir as tuas redes sociais", name: "Pedro A.", rating: "4.8", reviews: "56", price: "3.000 MT", icon: "📱" },
              { title: "Vou traduzir os teus documentos", name: "Ana L.", rating: "4.9", reviews: "203", price: "800 MT", icon: "🌐" },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="h-44 bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                  {s.icon}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-800 mb-3 text-sm leading-snug">{s.title}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-black">{s.name[0]}</div>
                    <span className="text-sm text-gray-600 font-medium">{s.name}</span>
                    <span className="text-yellow-500 text-xs">⭐ {s.rating}</span>
                    <span className="text-gray-400 text-xs">({s.reviews})</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-400">A partir de</span>
                    <span className="font-black text-gray-900">{s.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECAO IA */}
      <section className="py-20 px-8" style={{background:"#F5F7FA"}}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-3">Descubra o poder da Inteligencia Artificial</h2>
          <p className="text-gray-500 mb-10">Freelancers especializados em IA para o teu negocio</p>
          <div className="flex gap-4 flex-wrap">
            {["🤖 Criacao de conteudo", "💬 Chatbots", "⚡ Automacoes", "🧠 Desenvolvimento IA", "🎨 Design com IA"].map((item, i) => (
              <div key={i} className="bg-white rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition cursor-pointer font-medium text-gray-700 border border-gray-100">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA FREELANCERS */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-4xl font-black mb-4">Transforme a sua habilidade em renda.</h2>
            <p className="text-gray-500 mb-8 text-lg">Junta-te a milhares de freelancers em Mocambique e começa a ganhar dinheiro com o que sabes fazer.</p>
            <Link href="/register?role=freelancer" className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition inline-block">
              Comecar a vender
            </Link>
          </div>
          <div className="flex-1 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl h-64 flex items-center justify-center text-8xl">
            🚀
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-10 text-center">O que os nossos clientes dizem</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Carlos M.", company: "TechMoz", comment: "Encontrei um desenvolvedor excelente em menos de 24h. Servico de qualidade e preco justo!", rating: "5" },
              { name: "Fatima A.", company: "DesignPlus", comment: "A plataforma e muito facil de usar. Ja contratei 3 freelancers e todos entregaram no prazo.", rating: "5" },
              { name: "Manuel J.", company: "StartupMZ", comment: "O melhor lugar para encontrar talento mocambicano. Recomendo a todos os empresarios!", rating: "5" },
            ].map((dep, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-yellow-400 mb-4">{"⭐".repeat(5)}</div>
                <p className="text-gray-700 mb-6 italic">"{dep.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-black">{dep.name[0]}</div>
                  <div>
                    <p className="font-bold text-sm">{dep.name}</p>
                    <p className="text-gray-400 text-xs">{dep.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-8" style={{background:"#111111"}}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-black text-white mb-3">Freelamz</h2>
              <p className="text-gray-400 text-sm">A plataforma freelance de Mocambique 🇲🇿</p>
            </div>
            {[
              { title: "Categorias", links: ["Web Design", "Marketing", "Video", "Traducao"] },
              { title: "Sobre", links: ["Quem somos", "Carreiras", "Blog", "Imprensa"] },
              { title: "Suporte", links: ["Centro de ajuda", "Seguranca", "Termos", "Privacidade"] },
              { title: "Comunidade", links: ["Forum", "Eventos", "Podcast", "Instagram"] },
            ].map((col, i) => (
              <div key={i}>
                <h3 className="text-white font-bold mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-gray-400 text-sm hover:text-white transition">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2026 Freelamz. Todos os direitos reservados.</p>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition">Facebook</a>
              <a href="#" className="hover:text-white transition">Instagram</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-white transition">X</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
