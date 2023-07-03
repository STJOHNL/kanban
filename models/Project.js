const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
}, { timestamps: true })

module.exports = mongoose.model('Project', ProjectSchema)