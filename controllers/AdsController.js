const Ad = require('../models/Ad');
const path = require('path');
const cote = require('cote');
const requester = new cote.Requester({ name: 'Ad Controller Requester' });


class AdsController {
    new(req, res, next) {
      res.render('ad-new');
    };

    async postNewAd(req, res, next) {
        try {
            console.log('Datos del anuncio recibidos en postNewAd:', req.body); // Log de los datos recibidos
            console.log('Archivo recibido en postNewAd:', req.file); // Log del archivo recibido

            const usuarioId = req.session.usuarioLogado;
            const { name, option, price, tags } = req.body;
            const img = req.file.filename; // Asumiendo que 'img' es el nombre del campo en el formulario
            const ad = new Ad({ name, option, price, tags, img, owner: usuarioId });
            await ad.save();

            // Enviar la ruta de la imagen al servicio de thumbnails
            const originalImagePath = path.join(__dirname, '..', 'public', 'img', img);
            const thumbnailPath = path.join(__dirname, '..', 'public', 'img', 'thumbnails', img);

            console.log('Enviando mensaje a cote para generar thumbnail:', {
                originalImagePath,
                thumbnailPath
            });

            requester.send({
                type: 'generate-thumbnail',
                originalImagePath: originalImagePath,
                thumbnailPath: thumbnailPath
            }, (err, res) => {
                if (err) {
                    console.error('Error recibido de cote:', err); // Log si hay un error en la respuesta de cote
                  } else {
                    console.log('Thumbnail generado:', response.thumbnailPath); // Log de la respuesta exitosa de cote
                  }
            });
            console.log('Mensaje enviado a cote para generar thumbnail');

            res.redirect('/privado'); // lo mandamos a la lista de ads
        } catch (error) {
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