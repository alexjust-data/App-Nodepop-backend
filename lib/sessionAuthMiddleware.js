// modulo que exporta un middleware que controla si estamos logados o no

module.exports = (req, res, next) => {
  console.log('sessionAuthMiddleware', req.session);
  // si el cliente que hace la petición, no tiene en su sesión la variable usuarioLogado
  // le redirigimos al login porque no le conocemos
  if (!req.session.usuarioLogado) {
    console.log('Redirigiendo al login, sesión no encontrada');
    res.redirect('/login');
    return;
  }
  console.log('Usuario logado, procediendo');
  next();
}