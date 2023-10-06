const express = require('express')
const router = express.Router()
const Ad = require('../models/Ad')

router.get('/', async (req, res, next) => {
  try {
    const filterByName = req.query.name
    const skip = req.query.skip
    const limit = req.query.limit
    const sort = req.query.sort
    const fields = req.query.fields
    const filterByTags = req.query.tags
    const filterByType = req.query.venta
    const filterByPrice = req.query.price

    const filter = {}

    if (filterByTags) {
      filter.tags = { $in: filterByTags.split(',') }
    }

    if (filterByType !== undefined) {
      filter.venta = filterByType === 'true'
    }

    if (filterByName) {
      filter.name = new RegExp('^' + filterByName, 'i')
    }

    if (filterByPrice) {
      const priceRange = filterByPrice.split('-')

      if (priceRange.length === 2) {
        const [minPrice, maxPrice] = priceRange.map(parseFloat)
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
          filter.price = { $gte: minPrice, $lte: maxPrice }
        } else if (!isNaN(minPrice)) {
          filter.price = { $gte: minPrice }
        } else if (!isNaN(maxPrice)) {
          filter.price = { $lte: maxPrice }
        }
      } else if (priceRange.length === 1) {
        const singlePrice = parseFloat(priceRange[0])
        if (!isNaN(singlePrice)) {
          filter.price = singlePrice
        }
      }
    }

    const ads = await Ad.lista(filter, skip, limit, sort, fields)

    if (req.originalUrl.startsWith('/api/')) {
      // If the request comes from the API, respond with JSON
      res.json({ results: ads })
    } else {
      // If the request comes from the management interface, render the view
      res.render('index', { ads })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
