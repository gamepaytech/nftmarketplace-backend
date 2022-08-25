const mongoose = require('mongoose')

let nftSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'NFT name is required'],
        },
        jsonHash: { type: String},
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
        mintedBy: {
            type: String,
            ref: 'User',
        },
        mintingAddress : {
            type: String,
        },
        nftStatus: {
            type: Number,
            enum: { values: [1, 2, 3], message: `{VALUE} is not a valid` }, // 1- NFT In wallet,2- NFT on Sale, 3- NFT on Auction
            default: 1,
        },
        chain: {
            type: Number,
        },
        hp: {
            type: String,
        },
        attack: {
            type: String,
        },
        price: {
            type: String,
        },
        category: {
            type: String,
            default: 'image',
        },
        cloudinaryUrl: {
            type: String,
        },
        tier_type: {
            type: String,
            default:"1"
        },
        active: {
            type: Boolean,
            default:true
        },
        presale_status: {
            type: String,
            default:"started"
        },
        presale_start_date: {
            type: String,
            default: new Date().toISOString()
        },
        boughtId:{
            type: mongoose.Schema.ObjectId,
            ref:'PresaleBoughtNft'
        },
        ownerId:{
            type:mongoose.Schema.ObjectId,
            ref:"User"
        },
        ownerAddress: {
            type: String,
            required : true
        },
        saleId:{
            type:Number,
            required:true
        },
        tokenId :{
            type:Number,
            required:true
        },
        chikCount: Number,
    },
    { timestamps: true }
)

nftSchema.virtual('boughtDetails', {
    ref: 'PresaleBoughtNft', //The Model to use
    localField: '_id', //Find in Model, where localField 
    foreignField: 'nft', // is equal to foreignField
});
// Set Object and Json property to true. Default is set to false
nftSchema.set('toObject', { virtuals: true });
nftSchema.set('toJSON', { virtuals: true });


let nftSetting = new mongoose.Schema({
    event_start: {
        type: Boolean,
        default: false
    }
})

module.exports = {
    nftDetails: mongoose.model('nftDetails', nftSchema),
    nftSettings: mongoose.model('nftSettings', nftSetting),
}
