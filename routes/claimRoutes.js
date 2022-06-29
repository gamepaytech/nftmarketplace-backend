const express = require('express')
const router = express.Router()
const cors = require('cors')
const {
    updateClaimed,
    claimable,
    withdrawDetails,
    watchContractEvents
} = require('../controller/claimReward')
const { authenticateUser } = require('../middleware/authentication')

router.post('/claimedAlready', cors(), updateClaimed)
router.post('/claimable', cors(), claimable)
router.post('/getwithdrawlist', cors(), withdrawDetails)
// router.post('/watchmetamaskevent', cors(), watchContractEvents)

module.exports = router
