const express = require('express')
const router = express.Router()
const cors = require('cors')
const {
    saveInfluencer
} = require('../controller/influencerController')

router.post('/saveInfluencer', cors(), saveInfluencer)


module.exports = router;