const mongoose = require('mongoose')

// .on hereda, emite eventos
mongoose.connection.on('error', err => {
  console.log('Error de conexion', err)
})

const connection = mongoose.connection
mongoose.Promise = global.Promise // usar promesas nativas de JavaScript

connection.on('error', err => {
  console.error('Error de conexión:', err)
  process.exit(1)
})

connection.once('open', () => {
  console.info('Conectado a MongoDB en', mongoose.connection.name)
})

mongoose.connect('mongodb://127.0.0.1:3002/nodepop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports = connection
