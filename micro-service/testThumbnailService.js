// testThumbnailService.js
const cote = require('cote');
const path = require('path');

// Configura un emisor de solicitudes
const requester = new cote.Requester({ name: 'Test Thumbnail Requester' });

// Define las rutas de las imágenes
const originalImagePath = '/Users/alex/Desktop/KEEPKODING/Practica/App-Nodepop-backend/public/img/1.png';
const thumbnailPath = '/Users/alex/Desktop/KEEPKODING/Practica/App-Nodepop-backend/public/img/thumbnails/test_thumbnail6.png';

// Envía un mensaje al servicio de thumbnails
requester.send({
    type: 'generate-thumbnail',
    originalImagePath: originalImagePath,
    thumbnailPath: thumbnailPath
}, (err, response) => {
    if (err) {
        console.error('Error al generar thumbnail:', err);
    } else {
        console.log('Respuesta del servicio de thumbnails:', response);
    }
});
