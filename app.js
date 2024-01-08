// Requerimientos de módulos
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const upload = require('./lib/uploadConfigure');

// Importación de middleware y controladores
const swaggerMiddleware = require('./lib/swaggerMiddleware');
const basicAuthMiddleware = require('./lib/basicAuthMiddleware');
const sessionAuthMiddleware = require('./lib/sessionAuthMiddleware');
const jwtAuthMiddleware = require('./lib/jwtAuthMiddleware');
const i18n = require('./lib/i18nConfigure');
const LoginControllers = require('./controllers/LoginControllers');
const PrivadoController = require('./controllers/PrivadoController');
const AdsControllers = require('./controllers/AdsController');
const adsRoutes = require('./routes/api/ads');


// Conexión a la base de datos
require('./lib/connectMongoose');


// Inicialización de la aplicación Express
const app = express();


// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares básicos
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Rutas
app.use(i18n.init);
app.use(session({
  name: 'nodeapp-session', // nombre de la cookie
  secret: 'as98987asd98ashiujkasas768tasdgyy', // a mano o busca secure passport generator
  saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 2 // 2d - expiración de la sesión por inactividad
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI})
}));
console.log('Sesión configurada');
// hacemos que el objeto session esté disponible al renderizar las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/admin', basicAuthMiddleware, require('./routes/admin')); // Rutas protegidas
app.use('/change-locale', require('./routes/change-locale'));

// Rutas del website
const privadoController = new PrivadoController();
const loginController = new LoginControllers();
const adsController = new AdsControllers();

app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);

// Rutas del website : Zona privada del usuario
app.get('/privado', sessionAuthMiddleware, privadoController.index);

app.get('/ad-new', sessionAuthMiddleware, adsController.new); // Para mostrar la página de creación de anuncios
app.post('/ad-new', sessionAuthMiddleware, upload.single('img'), adsController.postNewAd); // Para manejar la publicación de un nuevo anuncio
app.get('/ads-delete/:adId', sessionAuthMiddleware, adsController.deleteAd);



// Rutas de la API
app.use('/api-doc', swaggerMiddleware);
app.use('/api/ads', adsRoutes);
app.post('/api/authenticate', loginController.postJWT);

// Manejo de errores 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function (err, req, res, next) {
  // Configurar variables locales, proporcionando solo el error en desarrollo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizar la página de error
  res.status(err.status || 500);
  res.render('error');
});

// Exportación del módulo app
module.exports = app;

