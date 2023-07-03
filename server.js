const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const noJoyRoutes = require('./routes/404')
const mainRoutes = require('./routes/main')
const authRoutes = require('./routes/auth')
const errorRoutes = require('./routes/error')
const accountRoutes = require('./routes/account')
const dashboardRoutes = require('./routes/dashboard')
const taskRoutes = require('./routes/task')
const companyRoutes = require('./routes/company')

require('dotenv').config({ path: './config/.env' })

// Passport config
require('./config/passport')(passport)

// Connect to MongoDB
connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
app.use(methodOverride('_method'))

// Sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: MongoStore.create({ mongoUrl: process.env.DB_STRING })
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', mainRoutes)
app.use('/auth', authRoutes)
app.use('/error', errorRoutes)
app.use('/account', accountRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/task', taskRoutes)
app.use('/company', companyRoutes)

// 404 routes need to be last
app.use(noJoyRoutes)

app.listen(process.env.PORT, () => {
    console.log('Server is running!')
})