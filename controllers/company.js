const User = require('../models/User')
const Company = require('../models/Company')

module.exports = {
    getCompanies: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            const companies = await Company.find()
            res.render('companies', {
                user,
                companies
            })
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    },
    getCreateCompany: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            res.render('createCompany', {
                user
            })
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    },
    createCompany: async (req, res) => {
        try {
            const company = await Company.create({
                name: req.body.name
            })

            const user = await User.findByIdAndUpdate(req.user.id, {
                company: company.id
            })

            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    },
    getEditCompany: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            const company = await Company.findById(req.params.id)

            res.render('editCompany', {
                user,
                company
            })
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    },
    editCompany: async (req, res) => {
        try {
            const company = await Company.findByIdAndUpdate(req.params.id, {
                name: req.body.name
            })

            const user = await User.findByIdAndUpdate(req.user.id, {
                company: company.id
            })

            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    }
}