const models = require("../models/User");
const referralModel = require("../models/referralModel");
const Claimed = require("../models/claimed")
const Web3 = require("web3")
const Provider = require('@truffle/hdwallet-provider');
const { address, abi } = require('../config')
const axios = require("axios");



const updateClaimed = async (req, res) => {
    try {
        const user = req.body.id
        const wallet = req.body.wallet

        var claimedAlready = await Claimed.find({ userId: user })
        const rewards = await referralModel.referralIncome.find({ userId: user })
        const userInfo = await models.users.findOne({ _id: user })
        var totalClaimed = 0
        if(claimedAlready !== null){
           for(let i =0;  i< claimedAlready.length; i++){
             totalClaimed +=  claimedAlready[i].amount
           }
        }
        let totalRewards = 0
        for (let i = 0; i < rewards.length; i++) {
            totalRewards += rewards[i].amount
        }
        const value = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=USD'
        )

        const claimAmount = (value.data.binancecoin.usd * (totalRewards - totalClaimed)) / Math.pow(10, 18)
        const provider = new Provider(process.env.PRIVATE_KEY, process.env.RPC);
        const web3 = new Web3(provider)
        const contract = new web3.eth.Contract(abi, address);
        const account = await web3.eth.accounts.wallet.add(
            process.env.PRIVATE_KEY
        )

        if (userInfo.metamaskKey.includes(wallet)) {
            const estimated = await contract.methods.transfer(wallet, (claimAmount * Math.pow(10, 6)).toFixed(0).toString())
                .estimateGas(
                    { gas: 3000000, from: account.address },
                    function (error, gasAmount) {
                        if (error) {
                            console.log(error?.message)
                        }
                    }
                )
            await contract.methods.transfer(wallet, (claimAmount * Math.pow(10, 6)).toFixed(0).toString()).send({ from: account.address, gas:estimated +100000})
                .then(async (responce) => {
                        await Claimed.create(
                            { "userId": user, 
                            "amount": (totalRewards - totalClaimed),
                            "wallet": wallet},
                        );
                    res.status(200).json({ claimAmount })
                })
                .catch((err) => {
                    console.log(err)
                })
        }

    } catch (error) {
        res.status(500).json({err:"Internal Server Error"})
    }
}

const claimable = async (req, res) => {
    try {
        const user = req.body.id;
        var claimedAlready = await Claimed.find({ "userId": user })
        var totalClaimed = 0
        if(claimedAlready !== null){
           for(let i =0;  i< claimedAlready.length; i++){
             totalClaimed +=  claimedAlready[i].amount
           }
        }

        const rewards = await referralModel.referralIncome.find({ userId: user })
        let totalRewards = 0
        for (let i = 0; i < rewards.length; i++) {
            totalRewards += rewards[i].amount
        }
        res.status(200).json(totalRewards - totalClaimed)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const withdrawDetails = async(req, res) =>{
    console.log("here94")
    try {
        const user = req.body.id;
        var claimedAlready = await Claimed.find({ "userId": user })
        console.log(claimedAlready.reverse(),"here")
        res.status(200).json({claimedAlready})
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    updateClaimed,
    claimable,
    withdrawDetails
}