const express = require('express')
const router = express.Router()
const accountController = require('../controllers/account')
const { ensureAuth } = require('../middleware/auth')

router.get('/list', ensureAuth, accountController.getAccounts)
router.get('/:id', ensureAuth, accountController.getAccount)
router.put('/:id', ensureAuth, accountController.editAccount)

module.exports = router