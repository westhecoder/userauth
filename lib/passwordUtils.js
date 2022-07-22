const crypto = require('crypto')

function genPassword(password) {

    /* We are hetting the hash of the password and storing
        that in the database. We first generate a salt and
        use that to generate a hash.
    */

    const salt = crypto.randomBytes(32).toString('hex')
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

    return {
        salt: salt,
        hash: genHash
    }
}


//Called on login with new user password. 
function validPassword(password, hash, salt) {

    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return hash === hashVerify
}

module.exports.validPassword = validPassword
module.exports.genPassword = genPassword
