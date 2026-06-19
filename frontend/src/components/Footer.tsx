export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Categorias</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Design Grafico</li>
              <li>Desenvolvimento Web</li>
              <li>Marketing Digital</li>
              <li>Traducao</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Sobre</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Quem Somos</li>
              <li>Como Funciona</li>
              <li>Seguranca</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Suporte</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Centro de Ajuda</li>
              <li>Contacto</li>
              <li>Termos de Servico</li>
              <li>Privacidade</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Comunidade</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Forum</li>
              <li>Eventos</li>
              <li>Parceiros</li>
              <li>Newsletter</li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 flex justify-between items-center">
          <p className="text-gray-600 text-sm">Freelamz - Plataforma Freelance de Mocambique. 2026</p>
          <div className="flex gap-4">
            <span className="text-gray-400">???? MZN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
