require('dotenv').config();

const port = process.env.PORT;
const root = __dirname;
const dbUrl = process.env.DB_URL;

module.exports = { secretKey: process.env.SECRET_KEY, port, hostDomain: process.env.DOMAIN, root, dbUrl };
