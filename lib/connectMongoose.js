const mongoose = require('mongoose');

mongoose.connection.on('error', err => {
  console.error('Error de conexión:', err);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  console.log('Conectado a MongoDB en', mongoose.connection.name);
});

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI);

module.exports = mongoose.connection;

