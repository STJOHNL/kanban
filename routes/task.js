const express = require('express')
const router = express.Router()
const taskController = require('../controllers/task')
const { ensureAuth } = require('../middleware/auth')

router.post('/create', ensureAuth, taskController.createTask)
router.put('/edit/:id', ensureAuth, taskController.editTask)

module.exports = router