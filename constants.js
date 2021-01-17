require('dotenv').config()

const port = process.env.PORT

module.exports = { secretKey: process.env.SECRET_KEY, port, hostDomain: process.env.DOMAIN }