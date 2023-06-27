const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { ensureAuth } = require('../middleware/auth')

router.get('/', authController.getLogin)
// router.post('/login', authController.postLogin)
// router.get('/logout', authController.logout)
// router.get('/recover', authController.getRecover)
// router.post('/recover', authController.recover)
// router.get('/reset/:token', authController.reset)
// router.post('/reset/:token', authController.resetPassword)

module.exports = router