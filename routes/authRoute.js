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
    updatePresaleLaunchPad,
    updateActivity,
    checkWalletKeyBeforeRegister,
    resendVerifyEmail,
    sendVerifyEmail
} = require('../controller/authController')
const { authenticateUser, authenticateAdmin, authenticateSuperAdmin } = require('../middleware/authentication')

router.post('/register', cors(), addMyReferral)
router.post('/login', cors(), login)
router.post('/logout', cors(), authenticateUser, logout)
router.post('/verify-email', cors(), verifyEmail)
router.post('/reset-password', cors(), resetPassword)
router.post('/forgot-password', cors(), forgotPassword)
router.post('/addMyReferral', cors(), addMyReferral)
router.post('/myReferrals/:page/:pageSize', cors(), authenticateUser, getAllMyReferrals)
router.get('/getAllSuperAdmin', cors(), authenticateSuperAdmin, getAllSuperAdmin)
router.get('/getAllAdmin', cors(), authenticateAdmin, getAllAdmin)
router.post('/changeUserStatus', cors(), authenticateUser, changeUserStatus)
router.post('/addWalletKey', cors(), authenticateUser, addWalletKey)
router.post('/getAllWalletKey', cors(), authenticateUser, getAllWallet)
router.post('/deleteWalletKey', cors(), authenticateUser, removeWalletKey)
router.post('/checkWalletKey', cors(), checkRegisterredWallet)
router.post('/checkUserWalletKey', cors(), authenticateUser, checkWalletKey)
router.post('/checkWalletKeyBeforeRegister', cors(),  checkWalletKeyBeforeRegister)
router.get('/getPercent', cors(), getPercent)
router.post('/updatePercent', cors(), authenticateAdmin, updatePercent)
router.post('/updatePresaleLaunchpad', cors(), authenticateAdmin, updatePresaleLaunchPad)
router.post('/activity', cors(), setactivity)
router.post('/getactivity/:page/:pageSize', cors(), getactivity)
router.patch('/updateActivity', cors(), authenticateUser, updateActivity);
router.post('/resend-verification-emails', cors(), authenticateAdmin, resendVerifyEmail)
router.get('/send-verification-emails', cors(), authenticateAdmin, sendVerifyEmail)


module.exports = router
