import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  { name: "Programacao e Tecnologia", icon: "??", color: "bg-green-800" },
  { name: "Design Grafico", icon: "??", color: "bg-orange-700" },
  { name: "Marketing Digital", icon: "??", color: "bg-yellow-600" },
  { name: "Redacao e Traducao", icon: "??", color: "bg-blue-700" },
  { name: "Video e Animacao", icon: "??", color: "bg-purple-700" },
  { name: "Servicos de IA", icon: "??", color: "bg-indigo-700" },
  { name: "Musica e Audio", icon: "??", color: "bg-pink-700" },
  { name: "Negocios", icon: "??", color: "bg-teal-700" },
];

const popularServices = [
  { title: "Desenvolvimento de Websites", image: "??", color: "bg-green-800" },
  { title: "Edicao de video", image: "??", color: "bg-orange-700" },
  { title: "Desenvolvimento de Software", image: "??", color: "bg-yellow-700" },
  { title: "Publicacao de livros", image: "??", color: "bg-teal-700" },
  { title: "Arquitetura e Design de Interiores", image: "??", color: "bg-pink-700" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-gray-900/90" />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Nossos freelancers<br />darao continuidade ao<br />trabalho.
          </h1>
          <div className="max-w-2xl">
            <div className="flex items-center bg-white rounded-lg overflow-hidden">
              <input 
                type="text" 
                placeholder="Pesquise qualquer servico..."
                className="flex-1 px-4 py-3 text-gray-800 focus:outline-none"
              />
              <button className="bg-black text-white px-6 py-3 hover:bg-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Quick Tags */}
          <div className="flex flex-wrap gap-3 mt-6">
            {["Desenvolvimento de Websites", "Arquitetura e Design de Interiores", "Videos UGC", "Edicao de video", "Publicacao de livros"].map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm hover:bg-white/30 cursor-pointer transition">
                {tag} ?
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8">
          <span className="text-gray-500 text-sm font-medium">Aprovado por:</span>
          <div className="flex gap-8 text-gray-400 font-bold text-lg">
            <span>Meta</span>
            <span>Google</span>
            <span>NETFLIX</span>
            <span>P&G</span>
            <span>PayPal</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {categories.map((cat) => (
              <div key={cat.name} className="flex-shrink-0 w-40 text-center group cursor-pointer">
                <div className={`${cat.color} text-white h-32 rounded-xl flex items-center justify-center text-4xl mb-3 group-hover:opacity-90 transition`}>
                  {cat.icon}
                </div>
                <p className="text-sm font-medium text-gray-700">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Servicos populares</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {popularServices.map((service) => (
              <div key={service.title} className="flex-shrink-0 w-64 cursor-pointer group">
                <div className={`${service.color} h-48 rounded-xl p-6 flex flex-col justify-between group-hover:opacity-90 transition`}>
                  <h3 className="text-white font-bold text-lg leading-tight">{service.title}</h3>
                  <div className="text-6xl text-center opacity-80">{service.image}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para comecar?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">Junta-te a centenas de mocambicanos que ja usam o Freelamz para trabalhar e contratar.</p>
          <Link href="/register" className="inline-block bg-green-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-green-700 transition text-lg">
            Criar Conta Gratis
          </Link>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
