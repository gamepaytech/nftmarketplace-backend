const { isTokenValid } = require('../utils')
const Token = require('../models/Token')

const authenticateUser = async (req, res, next) => {
    try {
        // console.log('AUTHENTICATING...')
        const accessToken = req.headers['authorization']
        const bearerToken = accessToken.split(' ')[1]
        if (accessToken) {
            const payload = isTokenValid(bearerToken)
            if (!payload) {
                return res.status(401).json({ msg: 'Invalid Token' })
            }

            req.user = payload
            // console.log('authenticate')

            return next()
        } else {
            // console.log('authentication failed')

            return res.status(500).json({ error: 'Invalid Token' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Authentication Invalid')
    }
}


const authenticateAdmin = async (req,res, next) => {
    try {
        const accessToken = req.headers['authorization']
        const bearerToken = accessToken.split(' ')[1]
        if (accessToken) {
            const payload = isTokenValid(bearerToken)
            if (!payload) {
                return res.status(401).json({ msg: 'Invalid Token' })
            }

            req.user = payload
            // console.log(req.user,"sdfd");
            // console.log(!req.user.isAdmin);
            if(!req.user.isAdmin) {
                return res.status(401).json({err:"100: Invalid Authorization: No access Granted!"});
            }

            return next()
        } else {
            // console.log('authentication failed')

            return res.status(500).json({ error: 'Invalid Token' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Authentication Invalid')
    }
}

const authenticateSuperAdmin = async (req,res, next) => {
    try {
        const accessToken = req.headers['authorization']
        const bearerToken = accessToken.split(' ')[1]
        if (accessToken) {
            const payload = isTokenValid(bearerToken)
            if (!payload) {
                return res.status(401).json({ msg: 'Invalid Token' })
            }

            req.user = payload
            
            if(!req.user.isSuperAdmin) {
                return res.status(401).json({err:"101: Invalid Authorization: No access Granted!"});
            }

            return next()
        } else {
            // console.log('authentication failed')

            return res.status(500).json({ error: 'Invalid Token' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Authentication Invalid')
    }
}

module.exports = { authenticateUser, authenticateAdmin, authenticateSuperAdmin }
