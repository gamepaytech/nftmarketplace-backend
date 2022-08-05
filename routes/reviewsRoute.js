const express = require('express');

const router = express.Router();
const { submit, reviews } = require('../controller/userReviews/reviewsController');

router.post('/',submit);
router.get('/',reviews);

module.exports = router;
