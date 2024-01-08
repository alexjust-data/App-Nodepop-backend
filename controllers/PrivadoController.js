const { Usuario, Ad } = require('../models');
const createError = require('http-errors');

class PrivadoController {
  async index(req, res, next) {

    try {
      // obtener el id del usuario de la sesión
      const usuarioId = req.session.usuarioLogado;
      console.log('Usuario Id:', usuarioId);


      // buscar el usuario en la BD
      const usuario = await Usuario.findById(usuarioId);

      if (!usuario) {
        next(createError(500, 'usuario no encontrado'))
        return;
      }

      // cargar lista de anuncios que pertenecen al usuario
      const ads = await Ad.find({ owner: usuarioId }); 
      console.log('lista de anuncios : ', ads);

      res.render('privado', {
        email: usuario.email,
        ads 
      });

    } catch (err) {
      next(err);
    }
  }
}

module.exports = PrivadoController;