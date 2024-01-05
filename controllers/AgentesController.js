var createError = require('http-errors');
const Agente = require('../models/Agente');

class AgentesController {
  new(req, res, next) {
    res.render('agentes-new');
  }

  async postNewAgent(req, res, next) {
    try {
      const usuarioId = req.session.usuarioLogado;
      const { name, age } = req.body;

      const agente = new Agente({
        name,
        age,
        owner: usuarioId
      });
      await agente.save();

      res.redirect('/privado');

    } catch (error) {
      next(error);
    }
  }

  async deleteAgent(req, res, next) {
    try {
      const usuarioId = req.session.usuarioLogado;
      const agenteId = req.params.agenteId;

      // validar que el agente que queremos borrar es propiedad del usuario!!!!
      const agente = await Agente.findOne({ _id: agenteId });

      // verificar que existe
      if (!agente) {
        console.warn(`WARNING - el usuario ${usuarioId} intentó eliminar un agente inexistente (${agenteId})`);
        next(createError(404, 'Not found'));
        return;
      }

      // agente.owner viene de la base de datos y es un ObjectId
      if (agente.owner.toString() !== usuarioId) {
        console.warn(`WARNING - el usuario ${usuarioId} intentó eliminar un agente (${agenteId}) propiedad de otro usuario (${agente.owner})`);
        next(createError(401, 'No autorizado'));
        return;
      }

      await Agente.deleteOne({ _id: agenteId }); 

      res.redirect('/privado');

    } catch (error) {
      next(error);
    }
  }
}

module.exports = AgentesController;