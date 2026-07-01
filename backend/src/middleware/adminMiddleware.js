// Middleware que garante que a rota so pode ser usada por um administrador.
// Deve ser usado sempre DEPOIS do authMiddleware (que preenche req.user a partir do token).
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.is_admin !== true) {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

module.exports = adminMiddleware;
