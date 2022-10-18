const mongoose = require("mongoose");

const gameNFTSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
           },
        contract_address: {
            type: String,
            required: true,
          },
          name:{
            type: String,
            required: true,
        },
        asset_platform_id:{
            type: String,
            required: false,
        },
        symbol:{
            type: String,
            required: false,
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model("games_nfts", gameNFTSchema);
