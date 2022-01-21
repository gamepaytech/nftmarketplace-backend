const express = require("express");
const {
  getAll,
  getNFTByTokenId,
  getNFTByUserId,
  create,
  mintNFT,
  approveNFT,
  buyNft,
  ownedNft,
  getNftById,
  searchNftsFilter
} = require("../controller/nft.controller.js");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const imageUpload = require("../middleware/image-upload");
const { uploadToPinata } = require("../middleware/upload-pinata");

router
  .route("/")
  .get(getAll)
  .post(create);
// router.route("/:tokenId").get(getNFTByTokenId);
router.route("/searchNftsFilter").post(searchNftsFilter);
router.route("/getAll").get(getNFTByUserId);
router.route("/getNftById").post(getNftById);
router.route("/buy-nft").post(buyNft);
router.route("/userNfts").post(ownedNft);
router.route("/mint").post(authenticateUser, mintNFT);
router.route("/approve").post(authenticateUser, approveNFT);


module.exports = router;
