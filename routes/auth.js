const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

// Do not add any private routes
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/sign-out', authController.signout)
router.get('/sign-up', authController.getSignUp)
router.post('/sign-up', authController.signUp)
router.get('/recover', authController.getRecover)
router.post('/recover', authController.recover)
router.get('/reset/:token', authController.reset)
router.post('/reset/:token', authController.resetPassword)

module.exports = router