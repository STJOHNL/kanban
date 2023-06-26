module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    adminAuth: function (req, res, next) {
        if (req.isAuthenticated() && req.user.admin) {
            return next()
        } else {
            res.redirect('/')
        }
    }
};