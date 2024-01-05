const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// creamos esquema
const usuarioSchema = mongoose.Schema({
    email: { type: String, unique: true},
    password: String
  });

// método estático que hace un hash de una password
usuarioSchema.statics.hashPassword = function(passwordEnClaro) {
  return bcrypt.hash(passwordEnClaro, 7);
}

// método de instancia que comprueba la password de un usuario
usuarioSchema.methods.comparePassword = function(passwordEnClaro) {
  return bcrypt.compare(passwordEnClaro, this.password)
}
  
// creamos el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);
  
// exportamos el modelo
module.exports = Usuario;