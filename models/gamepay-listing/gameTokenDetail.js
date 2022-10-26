const mongoose = require("mongoose");

const gameTokenSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
           },
        symbol: {
            type: String,
            required: true,
          },
          name:{
            type: String,
            required: true,
        },
        image:{
            type: String,
            required: false,
        },
        current_price:{
            type: Number,
            required: false,
        },
        market_cap:{
            type: Number,
            required: false,
        },
        market_cap_rank:{
            type: Number,
            required: false,
        },
        fully_diluted_valuation:{
            type: Number,
            required: false,
        },
        total_volume:{
            type: Number,
            required: false,
        },
        high_24h:{
            type: Number,
            required: false,
        },
        low_24h:{
            type: Number,
            required: false,
        },
        price_change_24h:{
            type: Number,
            required: false,
        },
        price_change_percentage_24h:{
            type: Number,
            required: false,
        },
        market_cap_change_24h:{
            type: Number,
            required: false,
        },
        market_cap_change_percentage_24h:{
            type: Number,
            required: false,
        },
        circulating_supply:{
            type: Number,
            required: false,
        },
        total_supply:{
            type: Number,
            required: false,
        },
        max_supply:{
            type: Number,
            required: false,
        },
        ath:{
            type: Number,
            required: false,
        },
        ath_change_percentage:{
            type: Number,
            required: false,
        },
        ath_date:{
            type: String,
            required: false,
        },
        atl:{
            type: Number,
            required: false,
        },
        atl_change_percentage:{
            type: Number,
            required: false,
        },
        atl_date:{
            type: String,
            required: false,
        },
        last_updated:{
            type: String,
            required: false,
        },
        price_change_percentage_1h_in_currency:{
            type: Number,
            required: false,
        },
        price_change_percentage_24h_in_currency:{
            type: Number,
            required: false,
        },
        price_change_percentage_7d_in_currency:{
            type: Number,
            required: false,
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model("games_token_details", gameTokenSchema);
