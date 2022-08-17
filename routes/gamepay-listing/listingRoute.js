const express = require('express');
const cors = require('cors');

const router = express.Router();
const { getGamepayListings, getTweetListByUsername } = require('../../controller/gamepay-listing/listingController');
const { uploadGamePayListing } = require('../../middleware/multerS3Upload');

router.post('/',cors(),getGamepayListings);
router.post('/get-tweet-list',cors(),getTweetListByUsername);

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
