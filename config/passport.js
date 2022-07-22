const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const connection = require('./database')
const User = connection.models.User
const validPassword = require('../lib/passwordUtils').validPassword

/* const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
} */

//Username the value from the login (req,post) form
const verifyCallback = (username, password, done) => {

    console.log(username, password)

    User.findOne({ username: username })
        .then((user) => {

            if (!user) {
                //Telling passport there was no error and there was no usr as well, rejsect this. 
                return done(null, false, { message: 'Email not registered.' })
            }

            const isValid = validPassword(password, user.hash, user.salt)
            console.log(user.hash)

            if (isValid) return done(null, user)
            return done(null, false, { message: 'Password Incorrect.' })
        })
        .catch((err) => {
            done(err)
        })
}

const strategy = new LocalStrategy(verifyCallback)
passport.use(strategy) //To authenticate user requests. 

//Putting the user into and out of the session. 
passport.serializeUser((user, done) => { done(null, user.id) })

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user)
        })
        .catch(err => done(err))
})