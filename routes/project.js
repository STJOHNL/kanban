const express = require('express')
const router = express.Router()
const projectController = require('../controllers/project')
const { ensureAuth } = require('../middleware/auth')

router.post('/create', ensureAuth, projectController.createProject)
router.put('/edit/:id', ensureAuth, projectController.editProject)

module.exports = router