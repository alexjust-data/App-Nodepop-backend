const express = require('express');
const router = express.Router();
const Ad = require('../../models/Ad');
const upload = require('../../lib/uploadConfigure');
const jwtAuthMiddleware = require('../../lib/jwtAuthMiddleware');

// GET /api/ads
// Devuelve una lista de anuncios con filtros, paginación y ordenación
router.get('/', jwtAuthMiddleware, async (req, res, next) => {
  try {
    const usuarioIdLogado = req.usuarioLogadoAPI;
    const { name, tags, venta, price, skip, limit, sort, fields } = req.query;

    const filter = { owner: usuarioIdLogado };
    if (name) {
      filter.name = new RegExp('^' + name, 'i');
    }
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }
    if (venta !== undefined) {
      filter.venta = venta === 'true';
    }
    if (price) {
      const priceRange = price.split('-');
      if (priceRange.length === 2) {
        const [minPrice, maxPrice] = priceRange.map(parseFloat);
        filter.price = { $gte: minPrice, $lte: maxPrice };
      } else {
        filter.price = parseFloat(priceRange[0]);
      }
    }

    // const ads = await Ad.lista(filter, parseInt(skip), parseInt(limit), sort, fields);
    const ads = await Ad.find(filter)
      .populate('owner', 'email') 
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort(sort)
      .select(fields);

    res.json({ results: ads });
  } catch (err) {
    next(err);
  }
});

// GET /api/ads/(:id)
// Devuelve un anuncio específico
router.get('/:id', jwtAuthMiddleware, async (req, res, next) => {
  try {
    const id = req.params.id;
    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(404).send('Anuncio no encontrado');
    }
    res.json({ result: ad });
  } catch (err) {
    next(err);
  }
});

// POST /api/ads
// Crea un nuevo anuncio
router.post('/', jwtAuthMiddleware, upload.single('img'), async (req, res, next) => {
  try {
    let adData = req.body;
    console.log("adData ---> ", adData);  // ojo <---- quítalo luego

    const usuarioIdLogado = req.usuarioLogadoAPI;
    console.log("req.file ---> ", req.file); // ojo <---- quítalo luego

    // Verificar si el usuario está logueado
    if (!usuarioIdLogado) {
      return res.status(401).send('Usuario no autenticado');
    }

    // Crear el objeto del anuncio con los datos del formulario y la imagen subida
    let ad = new Ad({
      name: req.body.name,
      option: req.body.option,
      price: req.body.price,
      tags: req.body.tags.split(','), // Asegúrate de que tags es un array
      img: req.file.filename,
      owner: usuarioIdLogado // Asignar el id del usuario logueado como owner
    });

    // la persistimos en la BD
    await ad.save();

    // Ahora, poblamos el campo 'owner' antes de enviar la respuesta
    // Ten en cuenta que necesitas reemplazar 'User' con el nombre de tu modelo de usuario real si es diferente.
    const adGuardado = await Ad.findById(ad._id).populate('owner', 'email');

    res.json({ result: adGuardado });

  } catch (err) {
    next(err);
  }
});


// DELETE /api/ads/(:id)
// Elimina un anuncio
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    await Ad.deleteOne({ _id: id });

    res.json();
  } catch (err) {
    next(err);
  }
});

module.exports = router;



