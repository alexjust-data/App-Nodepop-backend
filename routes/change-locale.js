const express = require('express');
const router = express.Router();

// GET /change-locale/[locale]
router.get('/:locale', (req, res, next) => {

  const locale = req.params.locale;

  // respuesta pone una cookie con el nuevo idioma
  res.cookie('nodeapp-locale', locale, {
    maxAge: 1000 * 60 * 60 * 24 * 30 // 30 días OPCION AÑADIDA
  })

  // responder con una redirección a la misma página de la que venía
  res.redirect(req.get('referer'));
});

module.exports = router;