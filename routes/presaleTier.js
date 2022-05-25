const express = require('express')
const router = express.Router()
const cors = require('cors')

const { getPresale, updatePresale, startPresale, schedulePreSale, getPreSaleTierById, stopPresale, createPreSaleTier } = require('../controller/presaleController')
const { authenticateUser } = require('../middleware/authentication')

router.get('/startPreSale', cors(),authenticateUser,startPresale)
router.get('/stopPresale', cors(),authenticateUser,stopPresale)
router.get('/schedulePreSale', cors(),schedulePreSale)
router.get('/getAll', cors(), getPresale)
router.post('/create', cors(),authenticateUser,createPreSaleTier)
router.get('/:id', cors(),authenticateUser,getPreSaleTierById)
router.put('/update', cors(),authenticateUser,updatePresale)

module.exports = router
