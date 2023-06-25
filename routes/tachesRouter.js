const express = require('express')
const taches_controller  = require('../controllers/taches.controller')
const tachesRouter = express.Router()

tachesRouter.get('/', taches_controller.findAll)
tachesRouter.post('/', taches_controller.createTache)

module.exports = tachesRouter