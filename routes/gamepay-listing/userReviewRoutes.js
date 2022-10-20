const express = require('express');

const { addUserOpinion,getUserReview } = require('../../controller/gamepay-listing/userReviewController');

const router = express.Router();
router.post('/addUserOpinion', addUserOpinion);
router.get('/getUserReview', getUserReview);


module.exports = router;