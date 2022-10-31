const logger = require("../../logger");
const gameNFTListModule = require("../../models/gamepay-listing/gameNFT");
const gameNFTDetailModule = require("../../models/gamepay-listing/gameNFTDetail");
const gameTokenDetailModule = require("../../models/gamepay-listing/gameTokenDetail");
const axios = require('axios');

const getGameNFTList = async (req, res) => {
  try {
    const page = parseInt(req.params.page) === 0 ?  1: parseInt(req.params.page) || 1; //for next page pass 1 here
    const limit = parseInt(req.params.limit) || 10;
    const search = req.query.search;
    if (search !== '' && search !== undefined) {
      const totalGameNFTDetailCount = await gameNFTDetailModule.find({name:{ $regex: search, $options: "i" }}).count({});
      const gameNFTDetailList = await gameNFTDetailModule
        .find({name:{ $regex: search, $options: "i" }})
        .skip((page - 1) * limit)
        .limit(limit);
      return res.status(200).json({
        total: totalGameNFTDetailCount,
        data: gameNFTDetailList,
        msg: "Game NFT List",
      });
    }
    const totalGameNFTDetailCount = await gameNFTDetailModule.count();
    const gameNFTDetailList = await gameNFTDetailModule.find().skip((page - 1) * limit).limit(limit);    
    return res.status(200).json({
      total:totalGameNFTDetailCount,
      data: gameNFTDetailList,
      msg: "Game NFT List",
    });
  } catch (err) {
    console.log(err)
    logger.error(err);
    res.status(500).json(err);
  }
};


const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const insertORUpdateGameNFTDetails = async (req, res) => {
  try {
    let page = 1; //for next page pass 1 here
    const limit = 30;
    const totalGameNFTCount = await gameNFTListModule.count();
    const totalNFTLoop = totalGameNFTCount / limit;
    var start = new Date().getTime();
    var end = new Date().getTime();
    for (let i = 0; i < totalNFTLoop; i++) {
      console.log(page, "current page");
      start = new Date().getTime();
      const gameNFTList = await gameNFTListModule
        .find()
        .skip((page - 1) * limit)
        .limit(limit);
      ++page;
      for (let j = 0; j < gameNFTList.length; j++) {
        const element = gameNFTList[j];
        const data = await axios.get(
          "https://api.coingecko.com/api/v3/nfts/"+element.asset_platform_id+"/contract/"+element.contract_address
        );
        const gameNFTMarket = await gameNFTDetailModule.findOne({
          contract_address: data.data?.contract_address,
        });
        if (gameNFTMarket) {
          await gameNFTDetailModule.findByIdAndUpdate(
            gameNFTMarket._id,
            data.data
          );
        } else {
          await gameNFTDetailModule.create(data.data);
        }
      }

      await wait(130000);
    }
    return res.status(200).json({
      total: totalGameNFTCount,
      data: gameNFTMarketData,
      msg: "Game NFT List",
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json(err);
  }
};


const updateGameNFTList = async (req, res) => {
  try {
    const limit = 250;
    for (let i = 1; i < 100; i++) {
      const data = await axios.get(
        "https://api.coingecko.com/api/v3/nfts/list?per_page="+limit+"&page="+i
      );
      if(data.data.length == 0){
        break;
      }
      for (let j = 0; j < data.data.length; j++) {
        const element = data.data[j];
        const gameNFTList = await gameNFTListModule.findOne({
          contract_address: element.contract_address,
        });
        console.log(element.id);
        if (gameNFTList) {
          await gameNFTListModule.findByIdAndUpdate(
            gameNFTList._id,
            element
          );
        } else {
          await gameNFTListModule.create(element);
        }
      }
    }
    return res.status(200).json({
      msg: "Game NFT List Updated",
    });
  } catch (err) {
    console.log(err)
    logger.error(err);
    res.status(500).json(err);
  }
};


const updateGameTokenDetails = async (req, res) => {
  try {
    const limit = 250;
    for (let i = 1; i < 100; i++) {
      const data = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page="+limit+"&page="+i+"&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
      );
      if(data.data.length == 0){
        break;
      }
      for (let j = 0; j < data.data.length; j++) {
        const element = data.data[j];
        const gameNFTList = await gameTokenDetailModule.findOne({
          id: element.id,
        });
        console.log(element.id);
        if (gameNFTList) {
          await gameTokenDetailModule.findByIdAndUpdate(
            gameNFTList._id,
            element
          );
        } else {
          await gameTokenDetailModule.create(element);
        }
      }
    }
    return res.status(200).json({
      msg: "Game Token List Updated",
    });
  } catch (err) {
    console.log(err)
    logger.error(err);
    res.status(500).json(err);
  }
};



module.exports = { getGameNFTList,insertORUpdateGameNFTDetails,updateGameNFTList,updateGameTokenDetails };
