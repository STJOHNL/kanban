const User = require('../models/User')
const Company = require('../models/Company')

module.exports = {
    getCompanies: async (req, res) => {
        try {
            const companies = await Company.find()
            res.render('companies', {
                companies
            })
        } catch (error) {
            console.log(error)
        }
    },
    getCreateCompany: async (req, res) => {
        try {
            res.render('createCompany')
        } catch (error) {
            console.log(error)
        }
    },
    createCompany: async (req, res) => {
        try {
            const company = await Company.create({
                name: req.body.name
            })

            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
    },
    getEditCompany: async (req, res) => {
        try {
            const company = await Company.findById(req.params.id)
            res.render('editCompany', {
                company
            })
        } catch (error) {
            console.log(error)
        }
    },
    editCompany: async (req, res) => {
        try {
            const company = await Company.findByIdAndUpdate(req.params.id, {
                name: req.body.name
            })
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
    }
}