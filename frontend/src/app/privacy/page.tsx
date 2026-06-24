export default function Privacy() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Inter, sans-serif", padding: "60px 24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#404145", marginBottom: "32px" }}>Politica de Privacidade</h1>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", color: "#404145", lineHeight: "1.7" }}>
          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>1. Informacoes que Recolhemos</h2>
            <p>Recolhemos informacoes que voce nos fornece diretamente ao registar-se, criar perfis, publicar servicos ou enviar propostas. Isso inclui nome, email, numero de telefone, informacoes de pagamento e conteudo que publica.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>2. Como Utilizamos as Informacoes</h2>
            <p>Utilizamos as suas informacoes para:</p>
            <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
              <li>Fornecer e melhorar a plataforma Freelamz</li>
              <li>Processar transacoes e pagamentos</li>
              <li>Comunicar actualizacoes e promocoes</li>
              <li>Prevenir fraude e garantir seguranca</li>
              <li>Cumprir obrigacoes legais</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>3. Partilha de Informacoes</h2>
            <p>Nao vendemos as suas informacoes pessoais a terceiros. Partilhamos dados apenas com:</p>
            <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
              <li>Prestadores de servicos que nos auxiliam (ex: hospedagem, pagamentos)</li>
              <li>Autoridades legais quando exigido por lei</li>
              <li>Outros utilizadores da plataforma (apenas informacoes do perfil publico)</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>4. Seguranca dos Dados</h2>
            <p>Implementamos medidas de seguranca tecnicas e organizacionais para proteger os seus dados. No entanto, nenhum sistema e 100% seguro. Utilize senhas fortes e nao partilhe a sua conta.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>5. Cookies</h2>
            <p>Utilizamos cookies para melhorar a experiencia do utilizador, analisar trafego e personalizar conteudo. Pode desactivar cookies nas configuracoes do seu navegador, mas isso pode afectar a funcionalidade da plataforma.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>6. Os seus Direitos</h2>
            <p>Voce tem direito a:</p>
            <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
              <li>Acceder aos seus dados pessoais</li>
              <li>Corrigir informacoes incorrectas</li>
              <li>Solicitar a eliminacao da conta e dados</li>
              <li>Optar por nao receber comunicacoes de marketing</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>7. Retencao de Dados</h2>
            <p>Mantemos os seus dados enquanto a sua conta estiver activa ou conforme necessario para prestar servicos. Após eliminacao da conta, os dados serao removidos dentro de 30 dias, excepto quando a lei exigir retencao.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>8. Alteracoes a esta Politica</h2>
            <p>Podemos actualizar esta politica periodicamente. Notificaremos alteracoes significativas por email ou atraves da plataforma.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "12px" }}>9. Contacto</h2>
            <p>Para questoes sobre privacidade, contacte-nos: <strong>privacidade@freelamz.com</strong></p>
          </section>

          <p style={{ marginTop: "32px", color: "#74767e", fontSize: "14px" }}>Ultima atualizacao: 24 de Junho de 2026</p>
        </div>
      </div>
    </div>
  );
}