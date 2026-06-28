const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const emailTemplate = (content) => `
  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f5f6fa;padding:24px;">
    <div style="background:#fff;border-radius:16px;padding:32px;">
      <div style="text-align:center;margin-bottom:28px;">
        <h1 style="font-size:24px;font-weight:800;color:#1a1d27;">Freelamz<span style="color:#6366f1;">.</span></h1>
        <p style="color:#6b7280;font-size:13px;margin-top:4px;">A plataforma de freelancers de Moçambique</p>
      </div>
      ${content}
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e8eaf0;text-align:center;color:#8b90a7;font-size:12px;">
        © 2025 Freelamz · Moçambique · <a href="https://freelamz-frontend.vercel.app" style="color:#6366f1;">freelamz.co.mz</a>
      </div>
    </div>
  </div>
`;

// Email de boas-vindas
const sendWelcomeEmail = async (user) => {
  const isFreelancer = user.role === 'freelancer';
  const content = `
    <h2 style="font-size:20px;font-weight:700;color:#1a1d27;margin-bottom:8px;">Bem-vindo ao Freelamz, ${user.name}! 🎉</h2>
    <p style="color:#6b7280;font-size:15px;line-height:1.7;margin-bottom:20px;">
      ${isFreelancer
        ? 'A tua conta de freelancer foi criada com sucesso. Já podes criar o teu perfil e começar a receber propostas de trabalho.'
        : 'A tua conta foi criada com sucesso. Já podes publicar projectos e contratar os melhores freelancers de Moçambique.'
      }
    </p>
    <a href="https://freelamz-frontend.vercel.app/${isFreelancer ? 'dashboard' : 'client-dashboard'}" 
       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px;">
      ${isFreelancer ? 'Ir para o meu perfil' : 'Publicar primeiro projecto'}
    </a>
  `;
  try {
    await transporter.sendMail({
      from: `"Freelamz" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: `Bem-vindo ao Freelamz, ${user.name}! 🎉`,
      html: emailTemplate(content),
    });
    console.log(`Email de boas-vindas enviado para ${user.email}`);
  } catch (err) {
    console.error('Erro ao enviar email de boas-vindas:', err.message);
  }
};

// Email de nova proposta (para o cliente)
const sendProposalEmail = async (client, freelancer, project) => {
  const content = `
    <h2 style="font-size:20px;font-weight:700;color:#1a1d27;margin-bottom:8px;">Nova proposta recebida! 📬</h2>
    <p style="color:#6b7280;font-size:15px;line-height:1.7;margin-bottom:16px;">
      <strong>${freelancer.name}</strong> enviou uma proposta para o teu projecto <strong>"${project.title}"</strong>.
    </p>
    <div style="background:#f5f6fa;border-radius:12px;padding:20px;margin-bottom:20px;">
      <p style="color:#1a1d27;font-size:14px;font-weight:600;margin-bottom:4px;">Freelancer</p>
      <p style="color:#6b7280;font-size:14px;">${freelancer.name}</p>
    </div>
    <a href="https://freelamz-frontend.vercel.app/client-dashboard" 
       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px;">
      Ver proposta
    </a>
  `;
  try {
    await transporter.sendMail({
      from: `"Freelamz" <${process.env.GMAIL_USER}>`,
      to: client.email,
      subject: `Nova proposta de ${freelancer.name} — Freelamz`,
      html: emailTemplate(content),
    });
    console.log(`Email de proposta enviado para ${client.email}`);
  } catch (err) {
    console.error('Erro ao enviar email de proposta:', err.message);
  }
};

// Email de proposta aceite (para o freelancer)
const sendProposalAcceptedEmail = async (freelancer, project) => {
  const content = `
    <h2 style="font-size:20px;font-weight:700;color:#1a1d27;margin-bottom:8px;">A tua proposta foi aceite! 🎉</h2>
    <p style="color:#6b7280;font-size:15px;line-height:1.7;margin-bottom:16px;">
      Parabéns! A tua proposta para o projecto <strong>"${project.title}"</strong> foi aceite.
    </p>
    <div style="background:#ecfdf5;border-radius:12px;padding:20px;margin-bottom:20px;border-left:4px solid #10b981;">
      <p style="color:#10b981;font-size:14px;font-weight:700;">Próximo passo: aguarda o contrato do cliente.</p>
    </div>
    <a href="https://freelamz-frontend.vercel.app/dashboard" 
       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px;">
      Ver dashboard
    </a>
  `;
  try {
    await transporter.sendMail({
      from: `"Freelamz" <${process.env.GMAIL_USER}>`,
      to: freelancer.email,
      subject: `Proposta aceite — ${project.title} 🎉`,
      html: emailTemplate(content),
    });
    console.log(`Email de proposta aceite enviado para ${freelancer.email}`);
  } catch (err) {
    console.error('Erro ao enviar email de proposta aceite:', err.message);
  }
};

// Email de nova mensagem
const sendMessageEmail = async (receiver, sender) => {
  const content = `
    <h2 style="font-size:20px;font-weight:700;color:#1a1d27;margin-bottom:8px;">Nova mensagem de ${sender.name} 💬</h2>
    <p style="color:#6b7280;font-size:15px;line-height:1.7;margin-bottom:20px;">
      Tens uma nova mensagem no Freelamz. Entra na plataforma para responder.
    </p>
    <a href="https://freelamz-frontend.vercel.app/messages" 
       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px;">
      Ver mensagem
    </a>
  `;
  try {
    await transporter.sendMail({
      from: `"Freelamz" <${process.env.GMAIL_USER}>`,
      to: receiver.email,
      subject: `Nova mensagem de ${sender.name} — Freelamz`,
      html: emailTemplate(content),
    });
    console.log(`Email de mensagem enviado para ${receiver.email}`);
  } catch (err) {
    console.error('Erro ao enviar email de mensagem:', err.message);
  }
};

// Email de pagamento recebido
const sendPaymentEmail = async (receiver, amount, projectTitle) => {
  const content = `
    <h2 style="font-size:20px;font-weight:700;color:#1a1d27;margin-bottom:8px;">Pagamento recebido! 💰</h2>
    <p style="color:#6b7280;font-size:15px;line-height:1.7;margin-bottom:16px;">
      Recebeste um pagamento de <strong>${Number(amount).toLocaleString()} MZN</strong> pelo projecto <strong>"${projectTitle}"</strong>.
    </p>
    <div style="background:#ecfdf5;border-radius:12px;padding:20px;margin-bottom:20px;border-left:4px solid #10b981;">
      <p style="color:#10b981;font-size:24px;font-weight:800;">${Number(amount).toLocaleString()} MZN</p>
      <p style="color:#6b7280;font-size:13px;">via M-Pesa</p>
    </div>
    <a href="https://freelamz-frontend.vercel.app/payments" 
       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px;">
      Ver pagamentos
    </a>
  `;
  try {
    await transporter.sendMail({
      from: `"Freelamz" <${process.env.GMAIL_USER}>`,
      to: receiver.email,
      subject: `Pagamento de ${Number(amount).toLocaleString()} MZN recebido! 💰`,
      html: emailTemplate(content),
    });
    console.log(`Email de pagamento enviado para ${receiver.email}`);
  } catch (err) {
    console.error('Erro ao enviar email de pagamento:', err.message);
  }
};

module.exports = { sendWelcomeEmail, sendProposalEmail, sendProposalAcceptedEmail, sendMessageEmail, sendPaymentEmail };