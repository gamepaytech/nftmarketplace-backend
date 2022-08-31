const express = require('express')
const router = express.Router()

const {
    getAllTokens,
    setTokens,
    getPlatformTokens,
} = require('../controller/GamePayTokensSchema.controller.js')

router.route('/getAllToken').get(getAllTokens)
router.route('/setTokens').post(setTokens)
router.route('/getPlatformTokens').get(getPlatformTokens)

module.exports = router
