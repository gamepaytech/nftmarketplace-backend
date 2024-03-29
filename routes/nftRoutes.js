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
  searchNftsFilter,
  getAllData,
  // addMyIncome,
  getMyrewards,
  sellNft,
  updateTotalSupply,
  userBoughtNft,
  getNftByUserId,
  getPresaleSetting,
  userBoughtNftMetamask,
  createPreSaleNFTInitiated,
  updateNFTSaleOnPaidStatus,
  getPriceTrail,
  cancelSale,
  getNftByWalletAddress,
  changePrice
} = require("../controller/nft.controller.js");

const {upload} = require('../middleware/multerS3Upload')
const router = express.Router();
const { authenticateUser ,authenticateAdmin} = require("../middleware/authentication");
const { uploadToPinata } = require("../controller/pinataUpload");

router.route("/").get(getAll).post(create);
// router.route("/:tokenId").get(getNFTByTokenId);
router.route("/cancel-sale").post(authenticateUser, cancelSale);
router.route("/change-sale-price").post(authenticateUser, changePrice);
router.route("/presale-setting").get(getPresaleSetting);
router.route("/searchNftsFilter").post(searchNftsFilter);
router.route("/getAll").get(getNFTByUserId);
router.route("/getAllData").get(getAllData);
router.route("/getNftById").post(getNftById);
router.route("/buy-nft").post(authenticateUser, buyNft);
router.route("/sell-nft").post(authenticateUser, sellNft);
router.route("/userNfts").post(authenticateUser, ownedNft);
router.route("/mint").post(authenticateUser, mintNFT);
router.route("/approve").post(authenticateUser, approveNFT);
// router.route('/addMyAmount').post(authenticateUser, addMyIncome)
router
  .route("/getMyRewards/:page/:pageSize")
  .post(authenticateUser, getMyrewards);
router.route("/update-item-sold").put(updateTotalSupply);
router.route("/add-user-presaleNft").post(userBoughtNft);
router.route("/add-user-presaleNft-metamask").post(userBoughtNftMetamask);
router.route("/get-by-userId/:page/:pageSize").post(getNftByUserId);
router.route("/get-by-walletAddress/:page/:pageSize").post(getNftByWalletAddress);
router
  .route("/upload-pinata")
  .post(upload.single("image"), uploadToPinata);
router
  .route("/create-presalenft-initiated")
  .post(authenticateUser, createPreSaleNFTInitiated);
router
  .route("/update-nftsale-on-paidStatus")
  .post(authenticateUser, updateNFTSaleOnPaidStatus);
router.route("/priceTrail").post(getPriceTrail);

module.exports = router;
