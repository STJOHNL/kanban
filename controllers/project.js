const User = require('../models/User')
const Project = require('../models/Project')

module.exports = {
    // getTasks: async (req, res) => {
    //     try {
    //         const tasks = await Task.find()
    //         res.render('tasks', {
    //             tasks
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },
    createProject: async (req, res) => {
        try {
            const project = await Project.create({
                name: req.body.name,
                description: req.body.description,
                company: req.body.company || req.user.company
            })

            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
    },
    editProject: async (req, res) => {
        try {
            const project = await Project.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                description: req.body.description,
                company: req.body.company || req.user.company
            })
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
    }
}