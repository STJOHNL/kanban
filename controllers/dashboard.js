const User = require('../models/User')
const Project = require('../models/Project')
const Task = require('../models/Task')

module.exports = {
    getDashboard: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            const projects = await Project.find()
            const tasks = await Task.find()
            res.render('dashboard', {
                user,
                projects,
                tasks
            })
        } catch (error) {
            console.log(error)
        }
    }
}