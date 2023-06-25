const express = require('express')
const app_controller  = require('../controllers/app.controller')
const TABLES = require('../constants/TABLES')

// projetcs
const projetRouter = express.Router()
projetRouter.post("/", (req, res, next) => app_controller.createData(req, res, next, TABLES.projets))
projetRouter.get("/", (req, res, next) => app_controller.list(req, res, next, TABLES.projets))
projetRouter.put("/", (req, res, next) => app_controller.updateData(req, res, next, TABLES.projets))
projetRouter.delete("/", (req, res, next) => app_controller.deleteData(req, res, next, TABLES.projets))

//equipes
const equipeRouter = express.Router()
equipeRouter.post("/", (req, res, next) => app_controller.createData(req, res, next, TABLES.equipes))
equipeRouter.get("/", (req, res, next) => app_controller.list(req, res, next, TABLES.equipes))
equipeRouter.put("/", (req, res, next) => app_controller.updateData(req, res, next, TABLES.equipes))
equipeRouter.delete("/", (req, res, next) => app_controller.deleteData(req, res, next, TABLES.equipes))

//equipes
const postesRouter = express.Router()
postesRouter.post("/", (req, res, next) => app_controller.createData(req, res, next, TABLES.postes))
postesRouter.get("/", (req, res, next) => app_controller.list(req, res, next, TABLES.postes))
postesRouter.put("/", (req, res, next) => app_controller.updateData(req, res, next, TABLES.postes))
postesRouter.delete("/", (req, res, next) => app_controller.deleteData(req, res, next, TABLES.postes))

//taches
const tachesRouter = express.Router()
tachesRouter.post("/", (req, res, next) => app_controller.createData(req, res, next, TABLES.taches))
tachesRouter.get("/", (req, res, next) => app_controller.list(req, res, next, TABLES.taches))
tachesRouter.put("/", (req, res, next) => app_controller.updateData(req, res, next, TABLES.taches))
tachesRouter.delete("/", (req, res, next) => app_controller.deleteData(req, res, next, TABLES.taches))

//collaborateurs
const collaborateursRouter = express.Router()
collaborateursRouter.post("/", (req, res, next) => app_controller.createData(req, res, next, TABLES.collaborateurs))
collaborateursRouter.get("/", (req, res, next) => app_controller.list(req, res, next, TABLES.collaborateurs))
collaborateursRouter.put("/", (req, res, next) => app_controller.updateData(req, res, next, TABLES.collaborateurs))
collaborateursRouter.delete("/", (req, res, next) => app_controller.deleteData(req, res, next, TABLES.collaborateurs))

//taches_progression
const taches_progressionRouter = express.Router()
taches_progressionRouter.post("/", (req, res, next) => app_controller.createData(req, res, next, TABLES.taches_progression))
taches_progressionRouter.get("/", (req, res, next) => app_controller.list(req, res, next, TABLES.taches_progression))
taches_progressionRouter.put("/", (req, res, next) => app_controller.updateData(req, res, next, TABLES.taches_progression))
taches_progressionRouter.delete("/", (req, res, next) => app_controller.deleteData(req, res, next, TABLES.taches_progression))

module.exports = {
          projetRouter,
          equipeRouter,
          postesRouter,
          tachesRouter,
          collaborateursRouter,
          taches_progressionRouter
}