const express = require('express')
const router = express.Router()
const companyController = require('../controllers/company')
const { ensureAuth } = require('../middleware/auth')

router.get('/list', ensureAuth, companyController.getCompanies)
router.get('/create', ensureAuth, companyController.getCreateCompany)
router.post('/create', ensureAuth, companyController.createCompany)
router.get('/edit/:id', ensureAuth, companyController.getEditCompany)
router.put('/edit/:id', ensureAuth, companyController.editCompany)

module.exports = router