import Link from "next/link";

const projects = [
  { id: 1, title: "Design de Logo", description: "Preciso de um logo para a minha empresa", budget: "5000 MZN", category: "Design" },
  { id: 2, title: "Website E-commerce", description: "Loja online para vender produtos", budget: "25000 MZN", category: "Desenvolvimento" },
  { id: 3, title: "Traducao PT-EN", description: "Traduzir 20 paginas de um documento", budget: "8000 MZN", category: "Traducao" },
];

export default function Projects() {
  return (
    <main className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Projetos Disponiveis</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-semibold">{project.budget}</span>
                <span className="text-gray-500 text-sm">{project.category}</span>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
