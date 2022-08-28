const express = require('express');
const cors = require('cors');

const router = express.Router();
const { getGamepayListings, getTweetListByUsername, getRedditListByUsername, getGamepayListingByFilter } = require('../../controller/gamepay-listing/listingController');
const { uploadGamePayListing } = require('../../middleware/multerS3Upload');

router.post('/',cors(),getGamepayListings);
router.post('/filter-list',cors(),getGamepayListingByFilter);
router.post('/get-tweet-list',cors(),getTweetListByUsername);
router.post('/get-reddit-list',cors(),getRedditListByUsername);

router.route("/upload-game-image").post(uploadGamePayListing.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file were uploaded." })
  };
  res.status(201).json({
    message: "Successfully uploaded file!",
    url: req.file.location,
  });
});

module.exports = router;
