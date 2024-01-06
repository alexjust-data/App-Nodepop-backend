
var createError = require('http-errors');
const Ad = require('../models/Ad');

class AdsController {
  // Método para mostrar la vista de creación de un nuevo anuncio
  newAd(req, res, next) {
    res.render('ads-new');
  }

  // Método para manejar la publicación de un nuevo anuncio
  async postNewAd(req, res, next) {
    try {
      const usuarioId = req.session.usuarioLogado;
      const { name, option, price, tags, img } = req.body;
      const ad = new Ad({
        owner: usuarioId,
        name,
        option,
        price,
        tags: tags.split(',').map(tag => tag.trim()), // Asumiendo que los tags se ingresan separados por comas
        img, // Asumiendo que la imagen se gestiona de alguna manera
      });
      await ad.save();

      res.redirect('/privado');

    } catch (error) {
      next(error);
    }
  }

  // Método para eliminar un anuncio
  async deleteAd(req, res, next) {
    try {
      const usuarioId = req.session.usuarioLogado;
      const adId = req.params.adId;
      const ad = await Ad.findOne({ _id: adId });

      if (!ad) {
        console.warn(`WARNING - el usuario ${usuarioId} intentó eliminar un anuncio inexistente (${adId})`);
        next(createError(404, 'Not found'));
        return;
      }

      if (ad.owner.toString() !== usuarioId) {
        console.warn(`WARNING - el usuario ${usuarioId} intentó eliminar un anuncio (${adId}) propiedad de otro usuario (${ad.owner})`);
        next(createError(401, 'No autorizado'));
        return;
      }

      await Ad.deleteOne({ _id: adId });
      res.redirect('/privado');
    } catch (error) {
      next(error);
    }
  }

  // Método para actualizar un anuncio 
  async updateAd(req, res, next) {
    try {
      const adId = req.params.adId;
      const update = req.body;

      const adUpdated = await Ad.findByIdAndUpdate(adId, update, { new: true });
      if (!adUpdated) {
        return res.status(404).send('Anuncio no encontrado');
      }
      res.redirect('/privado');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdsController;
