const express = require('express')
const router = express.Router()
const cors = require('cors')

const { getKYC, getKYCById, createKYC, updateKYC } = require('../controller/kycController')
const { authenticateUser } = require('../middleware/authentication')

router.get('/getAll', cors(),authenticateUser, getKYC)
router.get('/:id', cors(),authenticateUser, getKYCById)
router.post('/create', cors(),authenticateUser, createKYC)
router.put('/update', cors(),authenticateUser, updateKYC)

module.exports = router
