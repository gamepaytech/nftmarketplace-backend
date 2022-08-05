const express = require('express');
const cors = require('cors')

const {  getGameReview, addGameReview } = require('../../controller/gamepay-listing/reviewsController');

const router = express.Router();
router.post('/', cors(), getGameReview)
router.post('/add', cors(), addGameReview);

module.exports = router;
