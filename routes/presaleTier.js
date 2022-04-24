const express = require('express')
const router = express.Router()
const cors = require('cors')

const { getPresale, updatePresale, startPresale, schedulePreSale } = require('../controller/presaleController')

router.get('/getAll', cors(),getPresale)
router.get('/startPreSale', cors(),startPresale)
router.get('/schedulePreSale', cors(),schedulePreSale)
router.put('/update', cors(),updatePresale)

module.exports = router
