const express = require('express')
const auth_users_routes = require('./auth_users.routes')
const authRouter = express.Router()

authRouter.use('/users', auth_users_routes)

module.exports = authRouter