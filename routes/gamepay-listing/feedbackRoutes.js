const express = require('express');

const { addFeedback } = require('../../controller/gamepay-listing/feedbackController');

const router = express.Router();
router.post('/addFeedback', addFeedback);

module.exports = router;