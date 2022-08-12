const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const gameNftSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'NFT name is required'],
        },
        jsonHash: { type: String },
        nftType: {
            type: String,
        },
        description: {
            type: String,
        },
        nftClass: {
            type: String,
            required: [true, 'NFT Class is required'],
        },
        gender: {
            type: String,
        },
        accessories: {
            type: [String],
        },
        colour: {
            type: String,
        },
        others: {
            type: String,
        },
        breedCount: {
            type: Number,
        },
        mintHash: String,
        tokenId: Number,
        chikCount: Number,
        mintedBy: {
            type: String,
            ref: 'User',
        },
        nftStatus: {
            type: Number,
            enum: { values: [1, 2, 3], message: `{VALUE} is not a valid` }, // 1- NFT In wallet,2- NFT on Sale, 3- NFT on Auction
            default: 1,
        },
        chain: {
            type: Number,
        },
        price: {
            type: Number,
        },
        category: {
            type: String,
            default: 'image',
        },
        imageUrl: {
            type: String,
        },
        owner: {
            type: String,
            ref: 'User',
        },
        gameId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('games_nft', gameNftSchema)
