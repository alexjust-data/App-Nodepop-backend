'use strict'

require('dotenv').config();

const readLine = require('node:readline')
const connection = require('./lib/connectMongoose') // conect to database
const { Usuario, Ad } = require('./models');
//const initData = require('./ads.json') // load files with intial data

main().catch(err => console.log('There was a mistake --> ', err))

async function main () {

  // I wait for it to connect to the database
  await new Promise(resolve => connection.once('open', resolve))

  const borrar = await pregunta(
    '\nAre you sure you want to delete the data and load initial data?? yes/no --> '
  )
  if (!borrar) { process.exit() }

  await initUsuarios(); // inicializar la colección de usuarios
  await initAds() // initialize the ad collection, defined below
  connection.close()
}


// define function
async function initUsuarios() {
  
  // elimante users
  const deleted = await Usuario.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} usuarios.`);

  // crear
  const inserted = await Usuario.insertMany([
    { email: 'admin@example.com', password: await Usuario.hashPassword('1234')},
    { email: 'usuario1@example.com', password: await Usuario.hashPassword('1234')},
  ]);
  console.log(`Creados ${inserted.length} usuarios.`)
}


async function initAds () {
  const deleted = await Ad.deleteMany() // delete all documents from the Ad collection
  console.log(`Eliminates ---> ${deleted.deletedCount} ads.`)

  const [ adminUser, usuario1User ] = await Promise.all([
    Usuario.findOne({ email: 'admin@example.com'}),
    Usuario.findOne({ email: 'usuario1@example.com' })
  ])

  // crear ads iniciales
  const Adinserted = await Ad.insertMany([
    { 
      "name": "Bicicleta", 
      "option": true, 
      "price": 230.15, 
      "img": "1.png", 
      "tags": ["lifestyle", "motor"],
      owner: usuario1User._id
    },
    { 
      "name": "iPhone 3GS",
      "option": false,
      "price": 50.00,
      "img": "2.png",
      "tags": ["lifestyle", "mobile"],
      owner: usuario1User._id
    },
    { 
      "name": "Portátil HP",
      "option": true,
      "price": 599.99,
      "img": "3.png",
      "tags": ["work", "mobile"],
      owner: usuario1User._id
    },
    { 
      "name": "Caracol", 
      "option": true, 
      "price": 230.15, 
      "img": "4.png", 
      "tags": ["lifestyle"],
      owner: adminUser._id
    },
    { 
      "name": "Postal familiar",
      "option": false,
      "price": 50.00,
      "img": "5.png",
      "tags": ["lifestyle"],
      owner: adminUser._id
    },
    { 
      "name": "Postal familiar",
      "option": true,
      "price": 599.99,
      "img": "6.jpeg",
      "tags": ["work", "mobile"],
      owner: adminUser._id
    }
  ]);
  console.log(`Creados ${Adinserted.length} anuncios.`);

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
