const express = require('express')
const router = express.Router()
const mainController = require('../controllers/main')

// Do not add any private routes
router.get('/', mainController.getIndex)
router.get('/ui-elements', mainController.getElements)

module.exports = router