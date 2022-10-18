const mongoose = require("mongoose");

const gameNFTMarketData = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    contract_address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    asset_platform_id: {
      type: String,
      required: false,
    },
    symbol: {
      type: String,
      required: false,
    },
    image: {
      type: Object,
      required: false,
    },
    description: {
      type: String,
    },
    native_currency: {
      type: String,
    },
    floor_price: {
      type: Object,
    },
    market_cap: {
      type: Object,
    },
    volume_24h: {
      type: Object,
    },
    floor_price_in_usd_24h_percentage_change: {
      type: Number,
    },
    number_of_unique_addresses: {
      type: Number,
    },
    number_of_unique_addresses_24h_percentage_change: {
      type: Number,
    },
    total_supply: {
      type: Number,
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("games_nfts_details", gameNFTMarketData);
