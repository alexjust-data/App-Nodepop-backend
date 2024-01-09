const mongoose = require('mongoose')

const adSchema = new mongoose.Schema({
  name: String,
  option: Boolean, // true: se vende, false: se busca
  price: Number,
  img: String,
  thumbnail: String, // Ruta de la miniatura de la imagen
  tags: [String],
  owner: { ref: 'Usuario', type: mongoose.Schema.Types.ObjectId }
})

// método ESTATICO
adSchema.statics.lista = function (filtro, skip, limit, sort, fields) {
  const query = Ad.find(filtro) // devuelve un objeto del tipo query que es un thenable
  query.skip(skip) // http:
  query.limit(limit) // http:  query.sort(sort); // http:
  query.sort(sort);
  query.select(fields)

  return query.exec() // este si que devuelve la promesa.
}

const Ad = mongoose.model('Ad', adSchema)

module.exports = Ad
