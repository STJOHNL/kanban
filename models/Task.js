const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: Number,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
}, { timestamps: true })

module.exports = mongoose.model('Task', TaskSchema)