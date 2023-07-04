const User = require('../models/User')
const Task = require('../models/Task')
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
    //          res.redirect('/error')
    //     }
    // },
    createTask: async (req, res) => {
        try {
            const task = await Task.create({
                name: req.body.name,
                description: req.body.description,
                status: 0,
                company: req.body.company || req.user.company
            })

            const project = await Project.findByIdAndUpdate(req.body.project,
                { $push: { tasks: task._id } })

            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    },
    editTask: async (req, res) => {
        try {
            const task = await Task.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
                company: req.body.company || req.user.company
            })
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    }
}