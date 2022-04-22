const express = require('express')
const router = express.Router()
const cors = require('cors')

const { getPresale, updatePresale } = require('../controller/presaleController')

router.get('/getAll', cors(),getPresale)
router.put('/update', cors(),updatePresale)

module.exports = router
