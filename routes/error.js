const express = require('express')
const router = express.Router()
const errorController = require('../controllers/error')

// Do not add any private routes
router.get('/', errorController.getError)
router.use('*', errorController.get404)

module.exports = router