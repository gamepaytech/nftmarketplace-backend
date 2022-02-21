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
    addMyReferral,
    getAllMyReferrals,
    getAllSuperAdmin,
    getAllAdmin,
    changeUserStatus,
    checkRegisterredWallet,
    addWalletKey,
    removeWalletKey,
    getAllWallet,
    checkWalletKey,
    getPercent,
    updatePercent,
} = require('../controller/authController')
const { authenticateUser } = require('../middleware/authentication')

router.post('/register', cors(), addMyReferral)
router.post('/login', cors(), login)
router.post('/logout', cors(), authenticateUser, logout)
router.get('/verify-email', cors(), verifyEmail)
router.post('/reset-password', cors(), resetPassword)
router.post('/forgot-password', cors(), forgotPassword)
router.post('/addMyReferral', cors(), addMyReferral)
router.post('/myReferrals', cors(), getAllMyReferrals)
router.get('/getAllSuperAdmin', cors(), getAllSuperAdmin)
router.get('/getAllAdmin', cors(), getAllAdmin)
router.post('/changeUserStatus', cors(), changeUserStatus)
router.post('/addWalletKey', cors(), addWalletKey)
router.post('/getAllWalletKey', cors(), getAllWallet)
router.post('/deleteWalletKey', cors(), removeWalletKey)
router.post('/checkWalletKey', cors(), checkRegisterredWallet)
router.post('/checkUserWalletKey', cors(), checkWalletKey)
router.get('/getPercent', cors(), getPercent)
router.post('/updatePercent', cors(), updatePercent)

module.exports = router
