const createError = require('http-errors');
const jwt = require('jsonwebtoken');

// modulo que exporta un middleware
module.exports = async (req, res, next) => {
  try {
    // recoger el jwtToken de la cabecera, o del body, o de la query string
    const jwtToken = req.get('Authorization') || req.body.jwt || req.query.jwt;

    // Log para ver qué token se ha recibido
    console.log('Authorization Header:', jwtToken);

    // comprobar que mandado un jwtToken
    if (!jwtToken) {
      console.log('No se encontró el token JWT o está mal formateado');
      next(createError(401, 'no token provided'));
      return;
    }

    // comprobaremos que el token en válido
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.log('Error al decodificar el token JWT:', err.message);
        next(createError(401, 'invalid token'));
        return;
      }
      // Log para ver la información del payload decodificado
      console.log('Usuario JWT decodificado:', payload);

      // apuntamos el usuario logado en la request
      req.usuarioLogadoAPI = payload._id;
      // dejamos pasar al siguiente middleware
      next();
    })
  } catch (error) {
    next(error);
  }
};
