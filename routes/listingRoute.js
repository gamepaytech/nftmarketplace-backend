const express = require('express');
const cors = require('cors');

const router = express.Router();
const {uploadGamePayListing} = require('../middleware/multerS3Upload')
const { authenticateUser } = require('../middleware/authentication');
const { getGamepayListings } = require('../controller/gamepay-listing/listingController');

router.post('/',cors(),getGamepayListings);

router
  .route("/upload-game-image")
  .post(uploadGamePayListing.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file were uploaded." })
    };
    res.status(201).json({
      message: "Successfully uploaded file!",
      url: req.file.location,
    });
  });
module.exports = router;
