const config = require('../config')
const jwt = require('jsonwebtoken')

module.exports = {
    isLogin: async(req, res, next) => {
        try{
            const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null
            const data = jwt.verify(token, config.jwtKey)

            req.user = data.user
            req.token = token
            next()

        }catch(err){
            res.status(401).json({ message: 'Not Authorized to access this resource' })
        }
    }
}