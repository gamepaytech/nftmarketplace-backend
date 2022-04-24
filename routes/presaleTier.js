const express = require('express')
const router = express.Router()
const cors = require('cors')

const { getPresale, updatePresale, startPresale, schedulePreSale, getPreSaleTierById } = require('../controller/presaleController')
const { authenticateUser } = require('../middleware/authentication')

router.get('/startPreSale', cors(),authenticateUser,startPresale)
router.get('/schedulePreSale', cors(),authenticateUser,schedulePreSale)
router.get('/getAll', cors(),authenticateUser,getPresale)
router.get('/:id', cors(),authenticateUser,getPreSaleTierById)
router.put('/update', cors(),authenticateUser,updatePresale)

module.exports = router
