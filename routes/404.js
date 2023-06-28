const express = require('express')
const router = express.Router()
const noJoyController = require('../controllers/404')

// Do not add any private routes
router.use('*', noJoyController.get404)

module.exports = router