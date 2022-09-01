const express = require('express');

const { addUserReview } = require('../../controller/gamepay-listing/userReviewController');

const router = express.Router();
router.post('/addUserReview', addUserReview);

module.exports = router;