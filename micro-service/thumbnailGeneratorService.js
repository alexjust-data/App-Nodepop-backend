const cote = require('cote');
const Jimp = require('jimp');
const path = require('path');

// Configuración del microservicio
const thumbnailResponder = new cote.Responder({ name: 'Thumbnail Generator Service' });

// Dentro de thumbnailGeneratorService.js
thumbnailResponder.on('generate-thumbnail', (req, done) => {
  console.log('Solicitud recibida para generar thumbnail:', req); // Log de la solicitud recibida

  console.log('Generando thumbnail para:', req.originalImagePath); 

  const { originalImagePath, thumbnailPath } = req;

  Jimp.read(originalImagePath)
    .then(image => {
      console.log('Imagen leída exitosamente, generando thumbnail...'); // Log después de leer la imagen
      return image.resize(100, 100).writeAsync(thumbnailPath);
    })
    .then(() => {
      console.log('Thumbnail generado exitosamente:', thumbnailPath); // Log cuando el thumbnail se ha generado
      done(null, { status: 'Completed', thumbnailPath });
    })
    .catch(err => {
      console.error('Error al generar thumbnail:', err); // Log si ocurre un error al generar el thumbnail
      done(err);
    });
});

console.log('Thumbnail Generator Service is running');

