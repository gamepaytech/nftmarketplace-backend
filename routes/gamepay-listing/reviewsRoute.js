const express = require('express');
const cors = require('cors')

const {  getGameReview, addGameReview, overallRating } = require('../../controller/gamepay-listing/reviewsController');

const router = express.Router();
router.post('/', cors(), getGameReview);
router.post('/add', cors(), addGameReview);
router.post('/ratings', cors(), overallRating);


module.exports = router;
