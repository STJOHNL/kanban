const User = require('../models/User')
const Project = require('../models/Project')
const Task = require('../models/Task')

module.exports = {
    getDashboard: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).populate(['company'])

            const company = user.company?._id || undefined

            if (!company) {
                res.redirect('/company/create')
            } else {
                const projects = await Project.find({ company: company }).populate(['tasks'])
                res.render('dashboard', {
                    user,
                    projects
                })
            }
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    }
}