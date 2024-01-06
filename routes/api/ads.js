const express = require('express');
const router = express.Router();
const Ad = require('../../models/Ad');
const upload = require('../../lib/uploadConfigure');
const jwtAuthMiddleware = require('../../lib/jwtAuthMiddleware');
const sessionAuthMiddleware = require('../../lib/sessionAuthMiddleware');

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
router.post('/', sessionAuthMiddleware, upload.single('image'), async (req, res, next) => {
  try {
    let adData = req.body;
    const usuarioIdLogado = req.usuarioLogadoAPI;

    let ad = new Ad({
      ...adData,
      img: req.file.filename,
      owner: usuarioIdLogado
    });

    ad = await ad.save();
    res.status(201).json({ result: ad });
  } catch (err) {
    next(err);
  }
});

// PUT /api/ads/(:id)
// Actualiza un anuncio
router.put('/:id', jwtAuthMiddleware, async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;

    const adUpdated = await Ad.findByIdAndUpdate(id, update, { new: true });
    if (!adUpdated) {
      return res.status(404).send('Anuncio no encontrado');
    }
    res.json({ result: adUpdated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/ads/(:id)
// Elimina un anuncio
router.delete('/:id', jwtAuthMiddleware, async (req, res, next) => {
  try {
    const id = req.params.id;
    const adDeleted = await Ad.findByIdAndDelete(id);
    if (!adDeleted) {
      return res.status(404).send('Anuncio no encontrado');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;



// const express = require('express')
// const router = express.Router()
// const Ad = require('../../models/Ad')
// const adsController = require('../../controllers/AdsController');
// const upload = require('../../lib/uploadConfigure');
// const jwtAuthMiddleware = require('../../lib/jwtAuthMiddleware');



// // GET Ads API
// // ADS CONTROLLER
// // Returns a list of Ads

// /** API DOCUMENTATION
//  * @openapi
//  * /api/ads:
//  *   get:
//  *     description: Returns a list of ads
//  *     responses:
//  *       200:
//  *         description: Returns JSON
//  */

// router.get('/', async (req, res, next) => {
//   try {

//     // escribimos en el log el id del usuario logado en el API con JWT
//     const usuarioIdLogado = req.usuarioLogadoAPI;

//     // Filters
//     // http://127.0.0.1:3000/api/ads?name=Bicicleta
//     const filterByName = req.query.name
//     // Pagination
//     // http://127.0.0.1:3000/api/ads?skip=2&limit=7
//     const skip = req.query.skip
//     const limit = req.query.limit
//     // Sorting
//     // http://127.0.0.1:3000/api/ads?sort=-price%20name
//     const sort = req.query.sort
//     // Field Selection
//     // http://localhost:3000/api/ads?fields=name%20-_id%20option
//     const fields = req.query.fields
//     // Filters
//     // http://127.0.0.1:3000/api/ads?tags=lifestyle,motor
//     const filterByTags = req.query.tags
//     // http://127.0.0.1:3000/api/ads?venta=true
//     const filterByType = req.query.venta
//     /**
//          * Para buscar anuncios con un precio entre 10 y 100:
//          * http://127.0.0.1:3000/api/ads?price=10-100
//          * http://127.0.0.1:3000/api/ads?price=10-
//          * http://127.0.0.1:3000/api/ads?price=-100
//          * http://127.0.0.1:3000/api/ads?price=100
//          */
//     const filterByPrice = req.query.price

//     const filter = {}

//     if (filterByTags) {
//       filter.tags = { $in: filterByTags.split(',') } // Si los tags se pasan como una lista separada por comas en la URL
//     }

//     if (filterByType !== undefined) {
//       filter.venta = filterByType === 'true' // Convierte la cadena en un valor booleano
//     }

//     if (filterByName) { // General rule: when creating a filter, add an index to the model [Ads.js]
//       filter.name = filterByName
//       filter.name = new RegExp('^' + filterByName, 'i') // Búsqueda insensible a mayúsculas y minúsculas
//     }

//     if (filterByPrice) {
//       const priceRange = filterByPrice.split('-')

//       if (priceRange.length === 2) {
//         const [minPrice, maxPrice] = priceRange.map(parseFloat)
//         if (!isNaN(minPrice) && !isNaN(maxPrice)) {
//           // Búsqueda de rango de precio
//           filter.price = { $gte: minPrice, $lte: maxPrice }
//         } else if (!isNaN(minPrice)) {
//           // Precio mínimo
//           filter.price = { $gte: minPrice }
//         } else if (!isNaN(maxPrice)) {
//           // Precio máximo
//           filter.price = { $lte: maxPrice }
//         }
//       } else if (priceRange.length === 1) {
//         const singlePrice = parseFloat(priceRange[0])
//         if (!isNaN(singlePrice)) {
//           // Precio igual
//           filter.price = singlePrice
//         }
//       }
//     }

//     filter.owner = usuarioIdLogado;

//     const ads = await Ad.lista(filter, skip, limit, sort, fields)

//     res.json({ results: ads })
//   } catch (err) {
//     next(err)
//     console.error(err)
//   }
// })


// // GET /api/ads
// // Devuelve una lista de anuncios
// router.get('/', jwtAuthMiddleware, async (req, res, next) => {
//   try {
//     // Aplicar filtros, paginación y ordenación como en agentes
//     const filtro = { owner: req.usuarioLogadoAPI }; // Asumiendo que cada anuncio tiene un 'owner'
//     // Aplica aquí lógica adicional para filtros y paginación

//     const ads = await Ad.lista(filtro);
//     res.json({ results: ads });
//   } catch (err) {
//     next(err);
//   }
// });

// // GET /api/ads/(_id)
// // Devuelve un anuncio
// router.get('/:id', jwtAuthMiddleware, async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const ad = await Ad.findById(id);
//     res.json({ result: ad });
//   } catch (err) {
//     next(err);
//   }
// });

// // PUT /api/ads/(_id)
// // Actualiza un anuncio
// router.put('/:id', jwtAuthMiddleware, async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const data = req.body;
//     const adActualizado = await Ad.findByIdAndUpdate(id, data, { new: true });
//     res.json({ result: adActualizado });
//   } catch (err) {
//     next(err);
//   }
// });

// // POST /api/ads
// // Crea un anuncio
// router.post('/', jwtAuthMiddleware, upload.single('img'), async (req, res, next) => {
//   try {
//     const adData = req.body;
//     const usuarioIdLogado = req.usuarioLogadoAPI;

//     // creamos una instancia de anuncio en memoria
//     const ad = new Ad(adData);
//     ad.img = req.file.filename;
//     ad.owner = usuarioIdLogado;

//     // la persistimos en la BD
//     const adGuardado = await ad.save();
//     res.json({ result: adGuardado });
//   } catch (err) {
//     next(err);
//   }
// });

// // DELETE /api/ads/(_id)
// // Elimina un anuncio
// router.delete('/:id', jwtAuthMiddleware, async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     await Ad.deleteOne({ _id: id });
//     res.json();
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;
