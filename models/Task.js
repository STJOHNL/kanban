const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
}, { timestamps: true })

module.exports = mongoose.model('Task', TaskSchema)