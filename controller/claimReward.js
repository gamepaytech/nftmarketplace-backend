const models = require("../models/User");
const referralModel = require("../models/referralModel");
const Claimed = require("../models/claimed")
const Web3 = require("web3")
const Provider = require('@truffle/hdwallet-provider');
const { address, abi } = require('../config')
const axios = require("axios");
const logger = require('../logger')
const Moralis = require('moralis/node')

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


        const claimAmount = (totalRewards - totalClaimed) / Math.pow(10, 6)
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
                            logger.info(error?.message)
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
                    logger.info(err)
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
        logger.info(error)
        res.status(500).json(error)
    }
}

const withdrawDetails = async(req, res) =>{
    logger.info("here94")
    try {
        const user = req.body.id;
        var claimedAlready = await Claimed.find({ "userId": user })
        logger.info(claimedAlready.reverse(),"here")
        res.status(200).json({claimedAlready})
    } catch (error) {
        res.status(500).json(error)
    }
}

const watchContractEvents = async(req, res) =>{
    console.log("starting>>>")
    const serverUrl = "https://7e97nawu9isc.usemoralis.com:2053/server";
    const appId = "UzI09s80iJUhe06OSKrJSyQT72vFdqCzC2Jsz8gu"
    const masterKey = "fXrqYoOWPlbA1Eh4ewEQ0lBTvc48ptC0rSyC62Xr"
    await Moralis.start({ serverUrl, appId, masterKey });
  // code example of creating a sync event from cloud code
  let options = {
    chainId: "",
    address: "0x71efAD425d7fCdF723858F69993eD0a2497f049C",
    topic: "Paid(uint256, address)",
    abi: {
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "Paid",
		"type": "event"
	},
    limit: 5,
    tableName: "PayTab",
    sync_historical: false,
  };

  Moralis.Cloud.run("watchContractEvent", options, { useMasterKey: true }).then(
    (result) => {
      console.log(result,"the data is coming correctly");
    }
  );
}

module.exports = {
    updateClaimed,
    claimable,
    withdrawDetails,
    watchContractEvents
}