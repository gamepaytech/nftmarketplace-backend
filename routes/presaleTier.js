const express = require('express')
const router = express.Router()
const cors = require('cors')

const { getPresale } = require('../controller/presaleController')

router.get('/getAll', cors(),getPresale)

module.exports = router
