const passport = require('passport')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const sgMail = require('@sendgrid/mail')

module.exports = {
    getLogin: (req, res) => {
        try {
            if (req.user) {
                return res.redirect('/dashboard')
            }
            res.render('login')
        } catch (error) {
            console.log(error)
            res.redirect('/error')
        }
    },
    postLogin: (req, res, next) => {
        try {
            const validationErrors = []
            if (!validator.isEmail(req.body.email)) {
                validationErrors.push({ msg: 'Please enter a valid email address.' })
            }
            if (validator.isEmpty(req.body.password)) {
                validationErrors.push({ msg: 'Password cannot be blank.' })
            }
            if (validationErrors.length) {
                req.flash('errors', validationErrors)
                return res.redirect('/login')
            }
            req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return next(err)
                }
                if (!user) {
                    req.flash('errors', info)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err)
                    }
                    req.flash('success', { msg: 'Success! You are logged in.' })
                    res.redirect(req.session.returnTo || `/dashboard`)
                })
            })(req, res, next)
        } catch (error) {
            console.log(error)
        }
    },
    signout: (req, res, next) => {
        try {
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
        } catch (error) {
            console.log(error)
        }
    },
    getSignUp: (req, res) => {
        try {
            res.render('signup')
        } catch (error) {
            console.log(error)
        }
    },
    getRecover: (req, res) => {
        res.render('recover', { title: 'Recover Account' })
    },
    recover: async (req, res) => {
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

            const msg = {
                to: req.body.email,
                from: {
                    email: process.env.FROM_EMAIL,
                    name: 'Devtivity'
                },
                templateId: 'd-b74a7d843a9c48bcacbbadbde9d790a1',
                dynamicTemplateData: {
                    link: link,
                    user: user.fName
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
    },
    reset: async (req, res) => {
        try {
            const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
            res.render('reset', { user })
        } catch (error) {
            console.log(error)
        }
    },
    resetPassword: async (req, res) => {
        try {
            const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })

            const validationErrors = []
            if (!validator.isLength(req.body.password, { min: 8 })) {
                validationErrors.push({ msg: 'Password must be at least 8 characters long' })
            }
            if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })

            if (!user) { validationErrors.push({ msg: 'Password reset token is invalid or has expired.' }) }

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
            })
            // Send email
            const mailOptions = {
                to: user.email,
                from: {
                    email: process.env.FROM_EMAIL,
                    name: 'Devtivity'
                },
                templateId: 'd-815dcb4048f94890b484d7c6d60e7e34',
                dynamicTemplateData: {
                    user: user.fName
                }
            }

            sgMail.send(mailOptions)

            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    },
    signUp: async (req, res, next) => {
        try {
            const validationErrors = [];
            if (!validator.isEmail(req.body.email)) {
                validationErrors.push({ msg: 'Please enter a valid email address.' });
            }
            if (!validator.isLength(req.body.password, { min: 8 })) {
                validationErrors.push({ msg: 'Password must be at least 8 characters long' });
            }
            if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

            if (validationErrors.length) {
                req.flash('errors', validationErrors);
                return res.redirect('/sign-up');
            }
            req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

            const user = new User({
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                phone: req.body.phone,
                company: req.body.company,
                password: req.body.password
            });

            const existingUser = await User.findOne({ email: req.body.email });

            if (existingUser) {
                req.flash('errors', { msg: 'Account with that email address or username already exists.' });
                return res.redirect('/sign-up');
            }
            else {
                await user.save();
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect(`/dashboard`);
                });
            }
        } catch (error) {
            console.log(error);
            res.redirect('/sign-up');
        }
    }
}