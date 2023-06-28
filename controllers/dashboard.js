const User = require('../models/User')

module.exports = {
    getDashboard: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            res.render('dashboard', {
                user
            })
        } catch (error) {
            console.log(error)
        }
    }
}