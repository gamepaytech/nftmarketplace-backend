const GamePayToken = require('../models/GamePayToken')

const setTokens = async (req, res) => {
    const { name, address, url } = req.body

    if (!name) {
        res.status(401).json({ msg: 'Please provide the nft name' })
    }
    const tokensObj = {
        name,
        address,
        url,
    }

    const data = await GamePayToken.create(tokensObj)

    res.status(200).json({
        data,
        status: 200,
    })
}

const getAllTokens = async (req, res) => {
    const allTokens = await GamePayToken.find()

    res.status(200).json(allTokens)
}

const getPlatformTokens = async (req, res) => {
    const allTokens = await GamePayToken.find()
    const platformTokens = allTokens.filter(token => {
        if(token.name === 'Chiky' || token.name === 'Silk') return(token)
    })
    res.status(200).json(platformTokens)
}

module.exports = {
    getAllTokens,
    setTokens,
    getPlatformTokens
}
