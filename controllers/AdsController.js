const Ad = require('../models/Ad');

class AdsController {
    new(req, res, next) {
      res.render('ad-new');
    };

    async postNewAd(req, res, next) {
        try {
            const usuarioId = req.session.usuarioLogado;
            
            const { name, option, price, tags } = req.body;
            const img = req.file.filename; // Asumiendo que 'img' es el nombre del campo en el formulario
            const ad = new Ad({ name, option, price, tags, img, owner: usuarioId });
            await ad.save();
      
            res.redirect('/privado'); // lo mandamos a la lista de ads
      
          } catch (error) {
            // Manejo de errores con más detalle
            console.error("Error al publicar un nuevo anuncio: ", error);
            res.status(500).send("Ocurrió un error al publicar el anuncio");
            next(error);
        }
    }



    async deleteAd(req, res, next) {
        try {
        const usuarioId = req.session.usuarioLogado;
        const adId = req.params.adId;

        // validar que el ad que queremos borrar es propiedad del usuario!!!!
        const ad = await Ad.findOne({ _id: adId });

        // verificar que existe
        if (!ad) {
            console.warn(`WARNING - el usuario ${usuarioId} intentó eliminar un ad inexistente (${adId})`);
            next(createError(404, 'Not found'));
            return;
        }

        // ad.owner viene de la base de datos y es un ObjectId
        if (ad.owner.toString() !== usuarioId) {
            console.warn(`WARNING - el usuario ${usuarioId} intentó eliminar un ad (${adId}) propiedad de otro usuario (${ad.owner})`);
            next(createError(401, 'No autorizado'));
            return;
        }

        await Ad.deleteOne({ _id: adId }); 

        res.redirect('/privado');

        } catch (error) {
        next(error);
        }
    }
}


module.exports = AdsController;