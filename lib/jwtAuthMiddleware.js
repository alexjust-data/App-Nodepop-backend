var createError = require('http-errors');
const jwt = require('jsonwebtoken');

// modulo que exporta un middleware
module.exports = async (req, res, next) => {
  try {

    // recoger el jwtToken de la cabecera, o del body, o de la query string
    const jwtToken = req.get('Authorization') || req.body.jwt || req.query.jwt;

    // comprobar que mandado un jwtToken
    if (!jwtToken) {
      next(createError(401, 'no token provided'));
      return;
    }

    // comprobaremos que el token en válido
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        next(createError(401, 'invalid token'));
        return;
      }
      // apuntamos el usuario logado en la request
      req.usuarioLogadoAPI = payload._id;
      // dejamos pasar al siguiente middleware
      next();
    })


  } catch (error) {
    next(error);
  }
}