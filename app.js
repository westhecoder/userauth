const express = require('express')
const session = require('express-session')
const passport = require('passport')
const routes = require('./routes')

const MongoStore = require('connect-mongo')

//This gives access to the .env file. 
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

//const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' })

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true, 
    store: MongoStore.create({mongoUrl: process.env.DB_STRING}), 
    cookie: {
        maxAge: 1000 * 60 * 24
    }
}))

require('./config/passport')
// Keeps the passport middleware active while we're on other routes
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    console.log(req.session)
    console.log(req.user)
    next()
})

app.use(routes)

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log((new Date().toLocaleTimeString()) , 'Server running at port: ' + port)
})
