const express = require('express');
const router = express.Router();
const Agente = require('../../models/Agente');
const upload = require('../../lib/uploadConfigure');

/**
 * @openapi
 * /api/agentes:
 *  get:
 *   description: Devuelve una lista de agentes
 *   responses:
 *    200:
 *     description: Devuelve JSON
 */
router.get('/', async (req, res, next) => {
  try {

    // escribimos en el log el id del usuario logado en el API con JWT
    const usuarioIdLogado = req.usuarioLogadoAPI;

    // filtros
    // http://127.0.0.1:3000/api/agentes?name=Jones
    const filterByName = req.query.name;
    const filtreByAge = req.query.age;
    // paginación
    // http://127.0.0.1:3000/api/agentes?skip=2&limit=2
    const skip = req.query.skip;
    const limit = req.query.limit;
    // ordenación
    // http://127.0.0.1:3000/api/agentes?sort=-age%20name
    const sort = req.query.sort;
    // field selection
    // http://localhost:3000/api/agentes?fields=name%20-_id%20address
    const fields = req.query.fields;

    const filtro = {};

    if (filterByName) {
      filtro.name = filterByName;
    }

    if (filtreByAge) {
      filtro.age = filtreByAge;
    }

    filtro.owner = usuarioIdLogado;

    const agentes = await Agente.lista(filtro, skip, limit, sort, fields);

    // probamos un método de instancia
    // agentes.forEach(agente => {
    //   agente.saluda();
    // })

    res.json({ results: agentes })

  } catch (err) {
    next(err);
  }
});

// GET /api/agentes/(_id)
// Devuelve un agente
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const agente = await Agente.findById(id);

    res.json({ result: agente });
  } catch (err) {
    next(err);
  }
});

// PUT /api/agentes/(_id)
// Actualiza un agente
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const agenteActualizado = await Agente.findByIdAndUpdate(id, data, { new: true });

    res.json({ result: agenteActualizado });

  } catch (err) {
    next(err);
  }
});

// POST /api/agentes
// Crea un agente
router.post('/', upload.single('avatar') , async (req, res, next) => {
  try {
    const agenteData = req.body;
    const usuarioIdLogado = req.usuarioLogadoAPI;

    console.log(req.file);

    // creamos una instancia de agente en memoria
    const agente = new Agente(agenteData);
    agente.avatar = req.file.filename;
    agente.owner = usuarioIdLogado;

    // la persistimos en la BD
    const agenteGuardado = await agente.save();

    // llamais a un microservicio (con Cote / RabbirMQ)

    res.json({ result: agenteGuardado });

  } catch (err) {
    next(err);
  }
});

// DELETE /api/agentes/(_id)
// Elimina un agente
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    await Agente.deleteOne({ _id: id });

    res.json();
  } catch (err) {
    next(err);
  }
})


module.exports = router;