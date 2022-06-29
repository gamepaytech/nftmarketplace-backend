const express = require('express')
const router = express.Router()

const {
    getAllTokens,
    setTokens,
} = require('../controller/GamePayTokensSchema.controller.js')

router.route('/getAllToken').get(getAllTokens)
router.route('/setTokens').post(setTokens)

module.exports = router
