const express = require('express')
const router = express.Router()
const cors = require('cors')

const { getLaunchPad, getLaunchPadById } = require('../controller/launchPadController')
const { authenticateUser } = require('../middleware/authentication')

router.get('/getAll', cors(),authenticateUser, getLaunchPad)
router.get('/:id', cors(),getLaunchPadById)

module.exports = router
