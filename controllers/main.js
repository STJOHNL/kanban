module.exports = {
    getIndex: (req, res) => {
        try {
            res.render('index')
        } catch (error) {
            console.log(error)
        }
    },
    getElements: (req, res) => {
        try {
            res.render('uiElements')
        } catch (error) {
            console.log(error)
        }
    }
}