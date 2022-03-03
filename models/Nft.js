const mongoose = require('mongoose')

const NftSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'NFT name is required'],
        },
        jsonHash: { type: String, required: [true, 'JSON Hash required'] },
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
        cloudinaryUrl: {
            type: String,
        },
        owner: {
            type: String,
            ref: 'User',
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Nft', NftSchema)
