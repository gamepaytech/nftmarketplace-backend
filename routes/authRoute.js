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
    setactivity,
    getactivity,
} = require('../controller/authController')
const { authenticateUser } = require('../middleware/authentication')

router.post('/register', cors(), addMyReferral)
router.post('/login', cors(), login)
router.post('/logout', cors(), authenticateUser, logout)
router.get('/verify-email', cors(), verifyEmail)
router.post('/reset-password', cors(), resetPassword)
router.post('/forgot-password', cors(), forgotPassword)
router.post('/addMyReferral', cors(), addMyReferral)
router.post('/myReferrals', cors(), authenticateUser, getAllMyReferrals)
router.get('/getAllSuperAdmin', cors(), authenticateUser, getAllSuperAdmin)
router.get('/getAllAdmin', cors(), authenticateUser, getAllAdmin)
router.post('/changeUserStatus', cors(), authenticateUser, changeUserStatus)
router.post('/addWalletKey', cors(), authenticateUser, addWalletKey)
router.post('/getAllWalletKey', cors(), authenticateUser, getAllWallet)
router.post('/deleteWalletKey', cors(), authenticateUser, removeWalletKey)
router.post('/checkWalletKey', cors(), checkRegisterredWallet)
router.post('/checkUserWalletKey', cors(), authenticateUser, checkWalletKey)
router.get('/getPercent', cors(), authenticateUser, getPercent)
router.post('/updatePercent', cors(), authenticateUser, updatePercent)
router.post('/activity', cors(), setactivity)
router.post('/getactivity', cors(), getactivity)

module.exports = router
