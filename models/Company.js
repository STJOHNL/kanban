const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema({
    name: String
}, { timestamps: true })

module.exports = mongoose.model('Company', CompanySchema)