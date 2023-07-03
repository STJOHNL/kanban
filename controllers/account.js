const User = require('../models/User')
const Company = require('../models/Company')

module.exports = {
    getAccounts: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            const users = await User.find().populate(['company'])
            const companies = await Company.find()
            res.render('accounts', {
                user,
                users,
                companies
            })
        } catch (error) {
            console.log(error)
        }
    },
    getAccount: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            const accountUser = await User.findById(req.params.id)
            res.render('account', {
                user,
                accountUser
            })
        } catch (error) {
            console.log(error)
        }
    },
    editAccount: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            const accountUser = await User.findByIdAndUpdate(req.params.id, {
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
                company: req.body.company
            })
            res.redirect(`/account/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    }
}