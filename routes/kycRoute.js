const express = require('express')
const router = express.Router()
const cors = require('cors')

const { getKYC, getKYCById, saveKYC, updateKYC, getKYCByUserId} = require('../controller/kycController')
const { authenticateUser } = require('../middleware/authentication')

router.get('/getAll', cors(),authenticateUser, getKYC)
router.get('/:id', cors(),authenticateUser, getKYCById)
router.get('/users/:userId', cors(),authenticateUser, getKYCByUserId)
router.post('/save', cors(),authenticateUser, saveKYC)
router.post('/update', cors(),authenticateUser, updateKYC)

module.exports = router
