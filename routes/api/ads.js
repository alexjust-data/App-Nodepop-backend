const express = require('express')
const router = express.Router()
const Ad = require('../../models/Ad')

// GET Ads API
// ADS CONTROLLER
// Returns a list of Ads

/** API DOCUMENTATION
 * @openapi
 * /api/ads:
 *   get:
 *     description: Returns a list of ads
 *     responses:
 *       200:
 *         description: Returns JSON
 */

router.get('/', async (req, res, next) => {
  try {
    // Filters
    // http://127.0.0.1:3000/api/ads?name=Bicicleta
    const filterByName = req.query.name

    // Pagination
    // http://127.0.0.1:3000/api/ads?skip=2&limit=7
    const skip = req.query.skip
    const limit = req.query.limit

    // Sorting
    // http://127.0.0.1:3000/api/ads?sort=-price%20name
    const sort = req.query.sort

    // Field Selection
    // http://localhost:3000/api/ads?fields=name%20-_id%20option
    const fields = req.query.fields

    // Filters
    // http://127.0.0.1:3000/api/ads?tags=lifestyle,motor
    const filterByTags = req.query.tags

    // http://127.0.0.1:3000/api/ads?venta=true
    const filterByType = req.query.venta

    /**
         * Para buscar anuncios con un precio entre 10 y 100:
         * http://127.0.0.1:3000/api/ads?price=10-100
         * http://127.0.0.1:3000/api/ads?price=10-
         * http://127.0.0.1:3000/api/ads?price=-100
         * http://127.0.0.1:3000/api/ads?price=100
         */
    const filterByPrice = req.query.price

    const filter = {}

    if (filterByTags) {
      filter.tags = { $in: filterByTags.split(',') } // Si los tags se pasan como una lista separada por comas en la URL
    }

    if (filterByType !== undefined) {
      filter.venta = filterByType === 'true' // Convierte la cadena en un valor booleano
    }

    if (filterByName) { // General rule: when creating a filter, add an index to the model [Ads.js]
      filter.name = filterByName
      filter.name = new RegExp('^' + filterByName, 'i') // Búsqueda insensible a mayúsculas y minúsculas
    }

    if (filterByPrice) {
      const priceRange = filterByPrice.split('-')

      if (priceRange.length === 2) {
        const [minPrice, maxPrice] = priceRange.map(parseFloat)
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
          // Búsqueda de rango de precio
          filter.price = { $gte: minPrice, $lte: maxPrice }
        } else if (!isNaN(minPrice)) {
          // Precio mínimo
          filter.price = { $gte: minPrice }
        } else if (!isNaN(maxPrice)) {
          // Precio máximo
          filter.price = { $lte: maxPrice }
        }
      } else if (priceRange.length === 1) {
        const singlePrice = parseFloat(priceRange[0])
        if (!isNaN(singlePrice)) {
          // Precio igual
          filter.price = singlePrice
        }
      }
    }

    const ads = await Ad.lista(filter, skip, limit, sort, fields)

    res.json({ results: ads })
  } catch (err) {
    next(err)
    console.error(err)
  }
})

module.exports = router
