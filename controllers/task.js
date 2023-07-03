const User = require('../models/User')
const Task = require('../models/Task')

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
    createTask: async (req, res) => {
        try {
            const task = await Task.create({
                name: req.body.name,
                description: req.body.description,
                status: 'Backlog',
                company: req.body.company || req.user.company
            })

            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
    },
    editTask: async (req, res) => {
        try {
            const task = await Task.findByIdAndUpdate(req.params.id, {
                name: req.body.name
            })
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
    }
}