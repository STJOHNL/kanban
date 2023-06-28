const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { ensureAuth } = require('../middleware/auth')

router.get('/', authController.getIndex)
router.get('/login', authController.getLogin)
router.get('/ui-elements', authController.getElements)
router.post('/login', authController.postLogin)
router.get('/log-out', authController.logout)
router.get('/sign-up', authController.getSignUp)
router.post('/sign-up', authController.signUp)
router.get('/recover', authController.getRecover)
router.post('/recover', authController.recover)
router.get('/reset/:token', authController.reset)
router.post('/reset/:token', authController.resetPassword)

module.exports = router