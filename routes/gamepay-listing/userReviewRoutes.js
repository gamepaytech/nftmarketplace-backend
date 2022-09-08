const express = require('express');

const { addUserReview,getUserReview } = require('../../controller/gamepay-listing/userReviewController');

const router = express.Router();
router.post('/addUserReview', addUserReview);
router.get('/getUserReview', getUserReview);


module.exports = router;