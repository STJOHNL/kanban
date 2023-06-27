const passport = require('passport')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const sgMail = require('@sendgrid/mail')

exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/dashboard')
    }
    res.render('index', {
        title: 'Login'
    })
}

exports.postLogin = (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) {
        validationErrors.push({ msg: 'Please enter a valid email address.' })
    }
    if (validator.isEmpty(req.body.password)) {
        validationErrors.push({ msg: 'Password cannot be blank.' })
    }

    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('/')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err) }
        if (!user) {
            req.flash('errors', info)
            return res.redirect('/')
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err)
            }
            req.flash('success', { msg: 'Success! You are logged in.' })
            res.redirect(req.session.returnTo || '/dashboard')
        })
    })(req, res, next)
}

exports.logout = (req, res, next) => {
    // logout logic

    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.user = null
    req.session.save(function (err) {
        if (err) next(err)

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(function (err) {
            if (err) next(err)
            res.redirect('/')
        })
    })
}

exports.getRecover = (req, res) => {
    res.render('recover', { title: 'Recover Account' })
}

// Recover Password - Generates token and sends password reset email
// Public

exports.recover = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        const validationErrors = []

        if (!user) { validationErrors.push({ msg: `The email ${req.body.email} is not associated with any account.` }) }

        if (validationErrors.length) {
            req.flash('errors', validationErrors)
            return res.redirect('back')
        }

        // Generate and set password reset token
        user.generatePasswordReset()
        // Save the updated user object
        user.save()
        let link = `http://${req.headers.host}/reset/${user.resetPasswordToken}`

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: req.body.email,
            from: {
                email: process.env.FROM_EMAIL,
                name: 'Lace Up - Point 2 Running Company'
            }, // Use the email address or domain you verified above
            templateId: 'd-787158f0b4454799bc2831cdedabd15b',
            dynamicTemplateData: {
                link: link,
                name: user.fName
            }
        }
        await sgMail.send(msg);
        res.redirect('/')
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
}

// Reset Password - Validate password reset token and shows the password reset view
// Public

exports.reset = async (req, res) => {
    try {
        const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired.' })

        // Redirect user to form with the email address
        res.render('reset', { user })
    } catch (error) {
        console.log(error)
    }
}

// Reset Password
// Public

exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        const validationErrors = []

        if (!user) {
            validationErrors.push({ msg: 'Password reset token is invalid or has expired.' })
        }
        if (!validator.isLength(req.body.password, { min: 8 })) {
            validationErrors.push({ msg: 'Password must be at least 8 characters long.' })
        }
        if (req.body.password !== req.body.confirmPassword) {
            validationErrors.push({ msg: 'Passwords to not match.' })
        }

        if (validationErrors.length) {
            req.flash('errors', validationErrors)
            return res.redirect('back')
        }

        // Set new password
        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined

        // Save
        user.save((err) => {
            if (err) return res.status(500).json({ message: err.message })

            // Send email
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const mailOptions = {
                to: user.email,
                from: {
                    email: process.env.FROM_EMAIL,
                    name: 'Lace Up - Point 2 Running Company'
                },
                templateId: 'd-28698985fd10459386df4c7f1519cee6',
                subject: "Your password has been changed",
                dynamicTemplateData: {
                    name: user.fName
                }
            }

            sgMail.send(mailOptions, (error, result) => {
                if (error) return res.status(500).json({ message: error.message })
            })
        })
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}