const mongoose = require('mongoose')

const allGameSchema = new mongoose.Schema(
    {
        gameName: { type: String, required: false },
        platforms: { type: String, required: false },
        gameLogoUrl: { type: String, required: false },
        url: { type: String, required: false },
        token: { type: String, required: false },
        blockchain: { type: String, required: false },
        earn: { type: String, required: false },
        upfront: { type: String, required: false },
        rating: { type: String, required: false },
        description: { type: String, required: false },
        type:{type: String, required: false},
        genre:{type: String, required: false}
    },
)

const TopGamesResponse = mongoose.model('TopGames', allGameSchema);

module.exports = TopGamesResponse;
