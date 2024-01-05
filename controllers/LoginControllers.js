const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class LoginController {

  index(req, res, next) {
    res.locals.error = '';
    res.locals.email = '';
    res.render('login');
  }

  async post(req, res, next) {
    console.log("console.log req.body :", req.body)
    try {
      const { email, password } = req.body;

      // buscar el usuario en la base de datos
      const usuario = await Usuario.findOne({ email: email });
      console.log("console.log usuario :", usuario)

      // si no lo encuentro o la contraseña no coincide --> error
      if (!usuario || !(await usuario.comparePassword(password)) ) {
        res.locals.error = req.__('Invalid credentials');
        res.locals.email = email;
        res.render('login');
        return;
      }

      // si existe y la contraseña coincide --> zona privada
      // apuntar en la sesión del usuario, que está autenticado
      req.session.usuarioLogado = usuario._id;

      // enviar email al usuario
      // usuario.sendEmail('Bienvenido', 'Bienvenido a NodeApp');
      // usuario.sendEmailRabbitMQ('Bienvenido', 'Bienvenido a NodeApp');
      // const result = await usuario.sendEmailCote('Bienvenido', 'Bienvenido a NodeApp');
      // console.log(result);

      res.redirect('/privado');

    } catch (err) {
      next(err);
    }

  }

  logout(req, res, next) {
    req.session.regenerate(err => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/');
    })
  }

  async postJWT(req, res, next) {
    try {
      const { email, password } = req.body;

      // buscar el usuario en la base de datos
      const usuario = await Usuario.findOne({ email: email });

      // si no lo encuentro o la contraseña no coincide --> error
      if (!usuario || !(await usuario.comparePassword(password)) ) {
        res.json({ error: 'Invalid credentials' });
        return;
      }
      
      // si existe y la contraseña coincide --> devuelvo un JWT
      const tokenJWT = await jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
        expiresIn: '2h'
      });
      console.log("si existe y la contraseña coincide --> devuelvo un JWT", tokenJWT)
      res.json({ jwt: tokenJWT });

    } catch (err) {
      next(err);
    }

  }
}

module.exports = LoginController;