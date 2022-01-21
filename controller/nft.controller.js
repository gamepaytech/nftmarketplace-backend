const Nft = require("../models/Nft");
const mongoose = require("mongoose");
const NFTStates = require("../models/NFT-States");
const ObjectId = mongoose.Types.ObjectId;
const create = async (req, res) => {
    const {
        jsonHash,
        name,
        nftType,
        description,
        chain,
        tokenId,
        mintedBy,
        collectionName,
        category,
        royalty,
        cloudinaryUrl,
        owner,
        uploadedBy,
        price,
        nftClass,
        gender,
        accessories,
        colour,
        others,
        breedCount,
    } = req.body;
    const jk = "kkdskds";
    console.log(req, req.body);
    if (!name) {
        throw new CustomError.BadRequestError("Please provide the nft name");
    } else if (!nftType) {
        throw new CustomError.BadRequestError("Please provide the nft type");
    }

    const createObj = {
        jsonHash,
        name,
        price,
        description,
        nftClass,
        gender,
        accessories,
        colour,
        others,
        breedCount,
        nftType,
        uploadedBy,
        chain,
        tokenId,
        mintedBy,
        collectionName,
        category,
        cloudinaryUrl,
        royalty,
        owner,
    };
    console.log(createObj);
    const data = await Nft.create(createObj);
    // console.log("data ",data);
    res.status(200).json({ data });
};

//search in nft database using their attributes
const searchNftsFilter = async (req, res) => {
    //array of class
    let classData = req.body.class;
    let genderData = req.body.gender;
    let accessories = req.body.accessories;
    let colour = req.body.colour;
    let others = req.body.others;
    let breedCount = req.body.breedCount;

    console.log("class ",classData);
    console.log("gender ",genderData);
    console.log("accessories ",accessories);
    console.log("colour ", colour);
    console.log("others ", others);
    console.log("breedCount ",breedCount);
    let nftFilter = await Nft.find({
        $or: [
            { nftClass: { $in: classData } },
            { gender: { $in: genderData } },
            { accessories: { $in: accessories } },
            { others: { $in: others }},
            { colour: { $in: colour}},
            // {breedCount: {$literal: breedCount}}
            
        ],

        // breedCount: {breedCount}

        // colour: ["Yellow"]
    });

    res.json({
        status: 200,
        data: nftFilter,
    });
};

const getNFTByTokenId = async (req, res) => {
    const tokenId = req.params.tokenId;
    console.log(tokenId);
    const nft = await Nft.findOne({
        tokenId,
    });
    console.log(nft);
    res.status(201).json({ nft });
};

const getAll = async (req, res) => {
    const userId = req.user.userId;
    const nfts = await Nft.find({ owner: userId });
    res.status(201).json({ data: nfts });
};

const getNFTByUserId = async (req, res) => {
    // const userId = req.params.userId;
    const nfts = await Nft.find();
    res.status(201).json(nfts);
};
// fetch NFT using nft id
const getNftById = async (req, res) => {
    const { nftId } = req.body;
    console.log(nftId);

    if (!nftId) {
        throw new CustomError.BadRequestError(true, "Please provide NFT id");
    }
    const data = await Nft.findOne({ _id: nftId });
    res.send({
        data: data,
        message: "Successfull",
    });
};

const mintNFT = async (req, res) => {
    const { nftId, mintHash, receipt, blockNumber, tokenId } = req.body;

    if (!nftId) {
        res.status(400).json({ msg: "Please provide NFT id" });
    } else if (!mintHash) {
        res.status(400).json({ msg: "Please provide the mint hash" });
    } else if (!receipt) {
        res.status(400).json({ msg: "Receipt is required" });
    } else if (!blockNumber) {
        res.status(400).json({ msg: "Please provide Block Number" });
    } else if (tokenId != 0 && !tokenId) {
        res.status(400).json({ msg: "Please provide token Id" });
    } else {
        let updateObj = {
            mintHash,
            mintReceipt: receipt,
            blockNumber,
            tokenId,
            mintedBy: receipt.from,
        };

        await Nft.updateOne({ _id: ObjectId(nftId) }, updateObj);
        await NFTStates.create({
            nftId: ObjectId(nftId),
            state: "Mint",
            from: receipt.from,
            to: "contract",
        });
        res.status(201).json({ msg: "NFT minted successfully" });
    }
};

const buyNft = async (req, res) => {
    const { nftId, newOwner } = req.body;
    await Nft.updateOne({ _id: nftId }, { nftStatus: 2, owner: newOwner });
    res.send({
        message: "NFT Updates",
        nftId: nftId,
        newOwner: newOwner,
    });
};

const ownedNft = async (req, res) => {
    const { wallet } = req.body;
    console.log(wallet);
    const nfts = await Nft.find({ owner: wallet });
    res.status(201).json(nfts);
};

const approveNFT = async (req, res) => {
    const { nftId, approveHash } = req.body;
    if (nftId) {
        res.status(400).json({ msg: "Please provide the NFT id" });
    } else if (!approveHash) {
        res.status(400).json({ msg: "Please provide the approve hash" });
    } else {
        await Nft.updateOne(
            { _id: ObjectId(nftId) },
            { isApproved: true, approvedAt: new Date(), approveHash }
        );
        await NFTStates.create({
            nftId: ObjectId(nftId),
            state: "Approve",
            from: "address",
            to: "contract",
        });
        res.status(201).send({ msg: "NFT updated" });
    }
};

module.exports = {
    create,
    getNFTByTokenId,
    getAll,
    mintNFT,
    approveNFT,
    getNFTByUserId,
    buyNft,
    ownedNft,
    getNftById,
    searchNftsFilter,
};
