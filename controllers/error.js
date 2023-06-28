module.exports = {
    getError: async (req, res) => {
        try {
            res.render('error')
        } catch (error) {
            console.log(error)
            res.render('/')
        }
    },
    get404: (req, res, next) => {
        res.status(404).render('404')
    }
}