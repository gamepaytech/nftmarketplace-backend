const express = require('express')
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
    addMyIncome,
    getMyrewards,
} = require('../controller/nft.controller.js')
const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')
const imageUpload = require('../middleware/image-upload')
const { uploadToPinata } = require('../middleware/upload-pinata')

router.route('/').get(getAll).post(create)
// router.route("/:tokenId").get(getNFTByTokenId);
router.route('/searchNftsFilter').post(searchNftsFilter)
router.route('/getAll').get(getNFTByUserId)
router.route('/getAllData').get(getAllData)
router.route('/getNftById').post(getNftById)
router.route('/buy-nft').post(authenticateUser, buyNft)
router.route('/userNfts').post(authenticateUser, ownedNft)
router.route('/mint').post(authenticateUser, mintNFT)
router.route('/approve').post(authenticateUser, approveNFT)
router.route('/addMyAmount').post(authenticateUser, addMyIncome)
router.route('/getMyRewards').post(authenticateUser, getMyrewards)

module.exports = router
