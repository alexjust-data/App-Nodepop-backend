'use strict'

const readLine = require('node:readline')

const connection = require('./lib/connectMongoose') // conect to database
const Ad = require('./models/Ad') // load the model
const initData = require('./ads.json') // load files with intial data

main().catch(err => console.log('There was a mistake --> ', err))

async function main () {
  // I wait for it to connect to the database
  await new Promise(resolve => connection.once('open', resolve))

  const borrar = await pregunta(
    '\nAre you sure you want to delete the data and load initial data?? yes/no --> '
  )
  if (!borrar) { process.exit() }

  await initAds() // initialize the ad collection, defined below

  connection.close()
}

async function initAds () {
  const deleted = await Ad.deleteMany() // delete all documents from the Ad collection
  console.log(`Eliminates ${deleted.deletedCount} ads.`)

  try {
    // create initial ads
    const adsToInsert = initData.anuncios.map(ad => ({
      name: ad.name,
      option: ad.option,
      price: ad.price,
      img: ad.img,
      tags: ad.tags
    }))
    const inserted = await Ad.insertMany(adsToInsert)
    console.log(`Creates ${inserted.length} ads.`)
  } catch (error) {
    console.log('Error loading ads:', error)
  }
}

/**
  'scripts': {
  'start': 'node ./bin/www',
  'dev': 'cross-env DEBUG=nodeapp:* nodemon ./bin/www',
  'init-db': 'node init-db.js' <---- añado esta linea
  },

  voy a terminal y arranco $ node init-db.js
 */

/**
 * Are you sure you want to delete the data and load initial data?? yes/no
 * requires a library for the user to write, readline
 */

function pregunta (texto) {
  return new Promise((resolve, reject) => {
    // conectar readline con la consola
    const ifc = readLine.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    ifc.question(texto, respuesta => {
      ifc.close()
      resolve(respuesta.toLowerCase() === 'yes')
    })
  })
}
