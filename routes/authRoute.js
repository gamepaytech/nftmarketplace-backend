const express = require('express')
const router = express.Router()
const cors = require('cors')
const {
    register,
    test,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
} = require('../controller/authController')
const { authenticateUser } = require('../middleware/authentication')

router.post('/register', cors(), register)
router.post('/login', cors(), login)
router.post('/logout', cors(), authenticateUser, logout)
router.get('/verify-email', cors(), verifyEmail)
router.post('/reset-password', cors(), resetPassword)
router.post('/forgot-password', cors(), forgotPassword)
// router.get('/', test)

module.exports = router
