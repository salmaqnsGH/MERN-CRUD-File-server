const dotenv = require('dotenv')
dotenv.config()

module.exports={
    serviceName: process.env.SERVICE_NAME,
    jwtKey: process.env.SECRET,
    urlDb:process.env.MONGO_URL
}