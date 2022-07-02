const Nft = require("../models/presaleNfts");
const Nfts = require("../models/nfts");
const models = require("../models/User");
const mongoose = require("mongoose");
const NFTStates = require("../models/NFT-States");
const referralModel = require("../models/referralModel");
const PresaleBoughtNft = require("../models/PresaleBoughtNft");
const PresaletNftInitiated = require("../models/presaleNftsInitiated");
const PromoCode = require("../models/PromoCode");
const ObjectId = mongoose.Types.ObjectId;
// const nftPresale = require("../models/NftPresale");
const logger = require("../logger");
var Web3 = require("web3");
const sendPaymentConfirmation = require("../utils/sendPaymentConfirmation");
const CirclePayment = require("../models/circlePayments.js");
const schedulePreSale = require("../utils/presaleSchedular");
const { mintingAddress, mintingAbi } = require("../config.js");
const Provider = require("@truffle/hdwallet-provider");
const dotenv = require("dotenv").config();
const getPresaleSetting = async (req, res) => {
  const data = await Nft.settingpresalenfts.findOne({});
  res.status(201).json({ msg: "success", data: data });
};

const create = async (req, res) => {
  try {
    const {
      // jsonHash,
      name,
      nftType,
      description,
      chain,
      mintedBy,
      collectionName,
      category,
      royalty,
      cloudinaryUrl,
      uploadedBy,
      nftClass,
      gender,
      owner,
      accessories,
      colour,
      chikCount,
      others,
      breedCount,
      nftTotalSupply,
      result,
    } = req.body;

    if (!name) {
      res.status(400).json({ msg: "Please provide the nft name" });
      return;
    } else if (!nftType) {
      res.status(400).json({ msg: "Please provide the nft type" });
      return;
    }

    var web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC));
    const latest = await web3.eth.getBlockNumber();
    if (result.blockNumber + 30 > latest) {
      const createObj = {
        // jsonHash,
        name,
        nftType,
        description,
        chain,
        tokenId: result.events.Minted.returnValues.id,
        mintedBy,
        collectionName,
        category,
        royalty,
        cloudinaryUrl,
        ownerId:owner,
        uploadedBy,
        price: result.events.saleCreated.returnValues.price,
        nftClass,
        gender,
        accessories,
        colour,
        chikCount,
        others,
        breedCount,
        nftTotalSupply,
        saleId: result.events.saleCreated.returnValues.itemId,
      };
      logger.info(createObj);
      const data = await Nfts.nftDetails.create(createObj);
      // logger.info("data ",data);
      res.status(200).json({ data: data });
    }
  } catch (e) {
    logger.error(e);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const updateTotalSupply = async (req, res) => {
  const { updateCount, id } = req.body;

  if (!updateCount) {
    res.status(400).json({
      message: "Please send update count",
    });
  }

  const findNft = await Nft.presalenfts.findOne({ _id: id });
  findNft.itemSold = parseInt(findNft.itemSold) + parseInt(updateCount);
  await findNft.save();
  res.status(200).json({
    message: "Found",
    data: findNft,
  });
};

const getAllData = async (req, res) => {
  const type = req.query.type;
  const limit = req.query.limit;
  const time = req.query.time;
  // logger.info(type)
  // logger.info(limit)

  if (type && !limit && !time) {
    if (type === "sold") {
      const nfts = await Nft.presalenfts.find({ nftStatus: 2 }).sort({
        createdAt: -1,
      });
      res.status(201).json({ data: nfts });
    } else {
      const nfts = await Nft.presalenfts.find({ nftStatus: 1 }).sort({
        createdAt: -1,
      });
      res.status(201).json({ data: nfts });
    }
  } else if (type && limit && !time) {
    if (type === "sold") {
      const nfts = await Nft.presalenfts
        .find({ nftStatus: 2 })
        .sort({
          createdAt: -1,
        })
        .limit(limit);
      res.status(201).json({ data: nfts });
    } else {
      const nfts = await Nft.presalenfts
        .find({ nftStatus: 1 })
        .sort({
          createdAt: -1,
        })
        .limit(limit);
      res.status(201).json({ data: nfts });
    }
  } else if (time) {
    const date1 = new Date();
    const date2 = new Date();
    const date3 = new Date();
    const lastMonth = new Date(date1.setDate(date1.getDate() - 30));
    const lastWeek = new Date(date2.setDate(date2.getDate() - 7));
    const lastDay = new Date(date3.setDate(date3.getDate() - 1));
    logger.info(lastWeek);
    logger.info(lastDay);
    logger.info(lastMonth);
    const nfts = await Nft.presalenfts.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$price",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(201).json({ data: nfts });
  } else {
    const nfts = await Nft.presalenfts.find();
    res.status(201).json({ data: nfts });
  }
};

const searchNftsFilter = async (req, res) => {
  // const {filter} = req.body
  //array of class
  let classData = req.body.class;
  let genderData = req.body.gender;
  let accessories = req.body.accessories;
  let colour = req.body.colour;
  let others = req.body.others;
  let breedCount = req.body.breedCount;

  const array = [];
  // logger.info(classData !== '')
  if (classData.length !== 0) {
    const data = { nftClass: { $in: classData } };
    array.push(data);
  }
  if (genderData.length !== 0) {
    const data = { gender: { $in: genderData } };
    array.push(data);
  }
  if (accessories.length !== 0) {
    const data = { accessories: { $in: accessories } };
    array.push(data);
  }
  if (colour.length !== 0) {
    const data = { colour: { $in: colour } };
    array.push(data);
  }
  if (others.length !== 0) {
    const data = { others: { $in: others } };
    array.push(data);
  }
  if (breedCount !== 0) {
    const data = { breedCount: { $in: breedCount } };
    array.push(data);
  }
  // logger.info(array, 'HI')

  nftFilter = await Nfts.nftDetails.find({
    $and: array,
  });

  res.json({
    status: 200,
    data: nftFilter,
  });
};

const getNFTByTokenId = async (req, res) => {
  const tokenId = req.params.tokenId;
  logger.info(tokenId);
  const nft = await Nft.presalenfts.findOne({
    tokenId,
  });
  logger.info(nft);
  res.status(201).json({ nft });
};

const getAll = async (req, res) => {
  const userId = req.user.userId;
  const nfts = await Nft.presalenfts.find({ owner: userId });
  res.status(201).json({ data: nfts });
};

const getNFTByUserId = async (req, res) => {
  // const userId = req.params.userId;
  const nfts = await Nfts.nftDetails.find({ active: true });
  res.status(201).json(nfts);
};
// fetch NFT using nft id
const getNftById = async (req, res) => {
  try {
    const nftId = req.body.nftId;
    if (!nftId || nftId === "undefined") {
      res.status(400).json({ msg: "NFT id is Required" });
      return;
    }
    const data =
      req.body.type === "inventory"
        ? await Nfts.nftDetails.findOne({ _id: nftId })
        : await Nfts.nftDetails.findOne({
            $and: [{ _id: nftId }, { active: true }],
          });
    res.send({
      data: data,
      msg: "Successfull",
    });
  } catch (error) {
    logger.info(error.toString());
    res.json({ status: 400, msg: error.toString() });
  }
};

const mintNFT = async (req, res) => {
  const { nftId, mintHash, receipt, blockNumber, tokenId } = req.body;

  if (!nftId) {
    res.status(400).json({ msg: "Please provide NFT id" });
  } else if (!mintHash) {
    res.status(400).json({ msg: "Please provide the mint hash" });
  } else if (!receipt) {
    res.status(400).json({ msg: "Receipt is required" });
  } else if (!blockNumber) {
    res.status(400).json({ msg: "Please provide Block Number" });
  } else if (tokenId != 0 && !tokenId) {
    res.status(400).json({ msg: "Please provide token Id" });
  } else {
    let updateObj = {
      mintHash,
      mintReceipt: receipt,
      blockNumber,
      tokenId,
      mintedBy: receipt.from,
    };

    await Nft.presalenfts.updateOne({ _id: ObjectId(nftId) }, updateObj);
    await NFTStates.create({
      nftId: ObjectId(nftId),
      state: "Mint",
      from: receipt.from,
      to: "contract",
    });
    res.status(201).json({ msg: "NFT minted successfully" });
  }
};

// const buyNft = async (req, res) => {
//     const { nftId } = req.body;
//     await Nft.presalenfts.updateOne({ _id: nftId }, { nftStatus: 2, owner: newOwner });
//     res.send({
//         msg: "NFT Updates",
//         nftId: nftId,
//         newOwner: newOwner,
//     });
// };

const buyNft = async (req, res) => {
  const { amountSpent, quantity, nftId } = req.body;
  const preSaleData = await Nfts.nftDetails.findById({ _id: ObjectId(nftId) });

  // if (Number(preSaleData.nftTotalSupply - quantity)) {
  //   const newData = {
  //     itemSold: Number(preSaleData.itemSold + quantity),
  //     nftTotalSupply: Number(preSaleData.nftTotalSupply - quantity),
  //   };
  //   await Nfts.nftDetails.findByIdAndUpdate({ _id: ObjectId(nftId) }, newData);
  // } else {
  //   const newData = {
  //     itemSold: Number(preSaleData.itemSold + quantity),
  //     nftTotalSupply: Number(preSaleData.nftTotalSupply - quantity),
  //     active: false,
  //   };
  //   await Nfts.nftDetails.findByIdAndUpdate({ _id: ObjectId(nftId) }, newData);
  // }

  //Updating the activity section of both users(buyer and Seller)
  await models.users.findByIdAndUpdate(
    { _id: ObjectId(req.user.userId) },
    {
      $push: {
        activity: {
          activity: `You have bought ${nftId} for price ${amountSpent}`,
          timestamp: new Date(),
          orderId: "1233", // we need to add transactions
        },
      },
    }
  );

  await models.users.findByIdAndUpdate(
    { _id: ObjectId(preSaleData.ownerId) },
    {
      $push: {
        activity: {
          activity: `You have sold ${nftId} for price ${amountSpent}`,
          timestamp: new Date(),
          orderId: "1233", // we need to add transactions
        },
      },
    }
  );

  //creating bought details on buying nft
  const preSaleBoughtData = await PresaleBoughtNft.create({
    owner: req.user.username,
    nftIdOwned: req.user.userId,
    prevOwner: preSaleData.owner,
    prevOwnerId: ObjectId(preSaleData.ownerId),
    nft: nftId,
    amountSpent,
    quantity,
    active: true,
    saleId: preSaleData.saleId,
  });

  logger.info("PreSaleBoughtData");
  //User which put nft on sell
  if (preSaleData.boughtId) {
    await PresaleBoughtNft.findByIdAndUpdate(
      { _id: ObjectId(preSaleData.boughtId) },
      { active: false }
    );
  }
  await Nfts.nftDetails.findByIdAndUpdate(
    { _id: ObjectId(nftId) },
    {
      itemSold: 1,
      nftTotalSupply: 0,
      active: false,
    }
  );
  res.status(201).json({
    message: "Purchase is Successfull",
    preSaleBoughtData,
  });
};

// const sellNft = async (req, res) => {
//     const { nftId, newOwner, price } = req.body;
//     await Nft.presalenfts.updateOne(
//         { _id: nftId },
//         { nftStatus: 1, owner: newOwner, price: price }
//     );
//     res.send({
//         msg: "NFT Updates",
//         nftId: nftId,
//         newOwner: newOwner,
//     });
// };

const sellNft = async (req, res) => {
  const { nftId, result, boughtId,dolorPrice } = req.body;
  // const {
  //   name,
  //   nftType,
  //   description, 
  //   nftClass,
  //   gender,
  //   accessories,
  //   colour,
  //   others,
  //   breedCount,
  //   nftStatus,
  //   tierType,
  //   mintedBy,
  //   chikCount,
  //   saleId, //have some doubts
  // } = await Nfts.nftDetails.findById({ _id: ObjectId(nftId) });
  // nftData = {
  //   name,
  //   nftType,
  //   description,
  //   nftClass,
  //   gender,
  //   accessories,
  //   colour,
  //   others,
  //   breedCount,
  //   nftStatus,
  //   tierType,
  //   mintedBy,
  //   price,
  //   itemSold: 0,
  //   chikCount,
  //   nftTotalSupply: 1,
  //   boughtId: ObjectId(boughtId),
  //   owner: req.user.username,
  //   ownerId: req.user.userId,
  //   saleId,
  // };

  var web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC));
  const latest = await web3.eth.getBlockNumber();

  if (result.blockNumber + 30 > latest) {
    await Nfts.nftDetails.findByIdAndUpdate(
      { _id: ObjectId(nftId) },
      {
        itemSold: 0,
        nftTotalSupply: 1,
        price:result.events.saleCreated.returnValues.price,
        boughtId: ObjectId(boughtId),
        owner: req.user.username,
        ownerId: req.user.userId,
        saleId:result.events.saleCreated.returnValues.itemId,
        active: true,
      }
    );

    await models.users.findByIdAndUpdate(
      { _id: ObjectId(req.user.userId) },
      {
        $push: {
          activity: {
            activity: `You have listed ${nftId} for price ${dolorPrice}`,
            timestamp: new Date(),
            orderId: "1233", // we need to add sale Id
          },
        },
      }
    );
  }
  // const onSaleNft = await Nfts.nftDetails.create(nftData);

  res.status(201).json({
    message: "Nft Successfully Put On Sale",
    // onSaleNft,
  });
};

const ownedNft = async (req, res) => {
  const { wallet } = req.body;
  const nfts = await Nft.presalenfts.find({ owner: { $in: wallet } });
  res.status(201).json(nfts);
};

const getPriceTrail = async (req, res) => {
  const { nftId } = req.body;
  let priceData = [];
  const boughtData = await PresaleBoughtNft.find({
    nft: ObjectId(nftId),
  });
  !!boughtData &&
    boughtData.map((data) => {
      const { amountSpent, quantity } = data;
      priceData.push(amountSpent / quantity);
    });
  const sale = await Nfts.nftDetails.find({
    $and: [{ _id: ObjectId(nftId) }, { active: true }],
  });

  !!sale &&
    sale.map((data) => {
      priceData.push(data.price);
    });

  res.status(201).json({
    msg: "It was successfull",
    priceData,
  });
};

const userBoughtNftMetamask = async (req, res) => {
  const { nftId, address, promoApplied, quantity, txHash } = req.body;
  logger.info(process.env.RPC, "rpc");

  var web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC));

  const tx = await web3.eth.getTransactionReceipt(txHash);
  const latest = await web3.eth.getBlockNumber();
  const userInfo = await models.users.find({ metamaskKey: address });
  var userId;
  for (let i = 0; i < userInfo.length; i++) {
    if (userInfo[i].metamaskKey.includes) {
      userId = userInfo[i]._id;
    }
  }

  if (tx.blockNumber + 30 > latest) {
    const findNftById = await Nft.presalenfts.find({ _id: nftId });
    // logger.info("NFT ",findNftById)
    var promoDiv = 0;
    if (promoApplied !== "false") {
      logger.info(promoApplied, "promo");
      const promo = await PromoCode.findOne({ promoCode: promoApplied });
      logger.info(promo);
      promoDiv = promo.percentDiscount;
    }
    logger.info(promoDiv, findNftById);
    const amountTotal = (findNftById[0].price * (100 - promoDiv)) / 100;
    logger.info(amountTotal, "amountTotal");

    const updatePresale = await PresaleBoughtNft.create({
      nftIdOwned: nftId,
      owner: userId,
      nft: ObjectId(nftId),
      amountSpent: amountTotal,
      promoCode: promoApplied,
      quantity: quantity,
    });

    logger.info(updatePresale, "updatePresale");

    addMyIncomeMetaMask(nftId, userId, updatePresale._id);

    logger.info(updatePresale);
    res.status(200).json({
      message: "SUCCESS",
      updatePresale,
    });
  }
};

const userBoughtNft = async (req, res) => {
  const { nftId, userId, promoApplied, quantity } = req.body;
  logger.info("userBought running");
  const findNftById = await Nft.presalenfts.find({ _id: nftId });
  // logger.info("NFT ",findNftById)
  var promoDiv = 0;
  if (promoApplied !== "false") {
    logger.info(promoApplied, "promo");
    const promo = await PromoCode.findOne({ promoCode: promoApplied });
    logger.info(promo);
    promoDiv = promo.percentDiscount;
  }
  logger.info(promoDiv, findNftById);
  const amountTotal = (findNftById[0].price * (100 - promoDiv)) / 100;
  logger.info(amountTotal, "amountTotal");
  logger.info(nftId, userId, amountTotal, promoApplied, quantity, "389");
  const updatePresale = await PresaleBoughtNft.create({
    nftIdOwned: nftId,
    owner: userId,
    nft: ObjectId(nftId),
    amountSpent: amountTotal,
    promoCode: promoApplied,
    quantity: quantity,
  });
  logger.info(nftId, userId, updatePresale._id, "add my income");
  addMyIncomeMetaMask(nftId, userId, updatePresale._id);

  logger.info(updatePresale);
  res.status(200).json({
    message: "SUCCESS",
    updatePresale,
  });
};

const getNftByUserId = async (req, res) => {
  try {
    const { userId } = req.body;
    let page = req.params.page;
    let pageSize = req.params.pageSize;
    let total = 0;
    total = await PresaleBoughtNft.find({
      $and: [{ nftIdOwned: ObjectId(userId) }, { active: true }],
    }).count();
    const findNfts = await PresaleBoughtNft.find({
      $and: [{ nftIdOwned: ObjectId(userId) }, { active: true }],
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "nft",
      })
      .limit(pageSize)
      .skip(pageSize * page);
    if (!findNfts) {
      return res.status(404).json({
        error: "Error! No nft found",
      });
    }
    res.status(200).json({
      allNft: findNfts,
      total: total,
    });
  } catch (err) {
    logger.info(err);
    res.status(500).json({
      err: "Internal Server Error!",
    });
  }
};

const approveNFT = async (req, res) => {
  const { nftId, approveHash } = req.body;
  if (nftId) {
    res.status(400).json({ msg: "Please provide the NFT id" });
  } else if (!approveHash) {
    res.status(400).json({ msg: "Please provide the approve hash" });
  } else {
    await Nft.presalenfts.updateOne(
      { _id: ObjectId(nftId) },
      { isApproved: true, approvedAt: new Date(), approveHash }
    );
    await NFTStates.create({
      nftId: ObjectId(nftId),
      state: "Approve",
      from: "address",
      to: "contract",
    });
    res.status(201).send({ msg: "NFT updated" });
  }
};

const addMyIncomeMetaMask = async function (nftId, userId, purchaseId) {
  try {
    if (nftId && userId) {
      const userInfo = await models.users.findById(userId);
      if (userInfo && userInfo.refereeCode != "") {
        const bought = await PresaleBoughtNft.findOne({ _id: purchaseId });
        logger.info("bought ", bought);
        if (bought) {
          const getMyRefferalsDetail =
            await referralModel.referralDetails.findOne({
              referralCode: userInfo.refereeCode,
            });
          logger.info("getMyRefferalsDetail ", getMyRefferalsDetail);
          if (getMyRefferalsDetail) {
            logger.info("GET MY REFERRAL ", getMyRefferalsDetail.userId);
            let myShareAmount =
              ((bought.amountSpent * bought.quantity) / 100) *
              parseInt(getMyRefferalsDetail.myShare);
            let myFriendShareAmount =
              ((bought.amountSpent * bought.quantity) / 100) *
              parseInt(getMyRefferalsDetail.friendShare);
            const addMyIncome = await new referralModel.referralIncome({
              userId: getMyRefferalsDetail.userId,
              amount: myShareAmount,
              refereeCode: userInfo.refereeCode,
              nftId: nftId,
              recievedFrom: userId,
            });
            await addMyIncome.save();
            const addFriendIncome = await new referralModel.referralIncome({
              userId: userId,
              amount: myFriendShareAmount,
              refereeCode: userInfo.refereeCode,
              nftId: nftId,
              recievedFrom: getMyRefferalsDetail.userId,
            });
            await addFriendIncome.save();
          }
        }
      } else {
        logger.info("do not have refree!");
      }
    }
  } catch (error) {
    logger.info(error);
  }
};

// const addMyIncome = async function (req, res) {
//     try {
//         if (
//             req.body.nftId == undefined ||
//             req.body.nftId == "" ||
//             req.body.userId == undefined ||
//             req.body.userId == ""
//         ) {
//             res.json({ status: 400, msg: "nftId is required" });
//             return;
//         }

//         const userInfo = await models.users.findById(req.body.userId);
//         if (userInfo && userInfo.refereeCode != "") {
//             const bought = await PresaleBoughtNft.findOne({_id:req.body.purchaseId})
//             logger.info("bought ",bought);
//             if(bought){
//                 const getMyRefferalsDetail = await referralModel.referralDetails.findOne({referralCode:userInfo.refereeCode})
//                 logger.info("getMyRefferalsDetail ",getMyRefferalsDetail);
//                 if(getMyRefferalsDetail){
//                     logger.info("GET MY REFERRAL ",getMyRefferalsDetail.userId)
//                     let myShareAmount = (bought.amountSpent *bought.quantity / 100) * parseInt(getMyRefferalsDetail.myShare);
//                     let myFriendShareAmount = (bought.amountSpent *bought.quantity / 100) * parseInt(getMyRefferalsDetail.friendShare);
//                     const addMyIncome = await new referralModel.referralIncome({
//                         userId: getMyRefferalsDetail.userId,
//                         amount: myShareAmount,
//                         refereeCode:userInfo.refereeCode,
//                         nftId: req.body.nftId,
//                         recievedFrom: req.body.userId,
//                     });
//                     await addMyIncome.save();
//                     const addFriendIncome = await new referralModel.referralIncome({
//                         userId:req.body.userId,
//                         amount: myFriendShareAmount,
//                         refereeCode:userInfo.refereeCode,
//                         nftId: req.body.nftId,
//                         recievedFrom: getMyRefferalsDetail.userId,
//                     });
//                     await addFriendIncome.save();
//                 }
//             }

//             const totalIncome = await referralModel.referralIncome.find({
//                 userId: req.body.userId,
//             });
//             let totalAmount = 0;
//             for (let i = 0; i < totalIncome.length; i++) {
//                 totalAmount += totalIncome[i].amount;
//             }

//             res.json({
//                 stauts: 200,
//                 msg: "Success",
//                 totalAmount: totalAmount,
//             });
//         } else {

//             res.json({
//                 status: 200,
//                 msg: "The user is not refered by anyone",
//             });
//         }
//     } catch (error) {
//         logger.info(error)
//         res.json({ status: 400, msg: error.toString() });
//     }
// };

//  Will come in work after presale
// const addMyIncome = async function (req, res) {
//     try {
//         if (
//             req.body.nftId == undefined ||
//             req.body.nftId == "" ||
//             req.body.userId == undefined ||
//             req.body.userId == ""
//         ) {
//             res.json({ status: 400, msg: "nftId is required" });
//             return;
//         }

//         const query = await referralModel.referralIncome.find({
//             receivedFrom: req.body.userId,
//             nftId: req.body.nftId,
//         });

//         if (query && query.length > 0) {
//             res.status(400).json({ msg: "Already Purchased" });
//         } else {
//             const userInfo = await models.users.find({ _id: req.body.userId });

//             if (userInfo && userInfo[0].refereeCode != "") {
//                 const data = await Nft.findOne({ _id: req.body.nftId });
//                 const setting = await referralModel.appsetting.findOne({});
//                 let referralIncome =
//                     (data.price / 100) * setting.referralPercent;

//                 const getMyreferral = await models.users.find({
//                     referralCode: userInfo[0].refereeCode,
//                 });

//                 const addMyIncome = await new referralModel.referralIncome({
//                     userId: getMyreferral[0]._id,
//                     amount: referralIncome,
//                     nftId: req.body.nftId,
//                     recievedFrom: req.body.userId,
//                 });

//                 await addMyIncome.save();

//                 const totalIncome = await referralModel.referralIncome.find({
//                     userId: req.body.userId,
//                 });
//                 let totalAmount = 0;
//                 for (let i = 0; i < totalIncome.length; i++) {
//                     totalAmount += totalIncome[i].amount;
//                 }

//                 res.json({
//                     sttaus: 200,
//                     msg: "Success",
//                     totalAmoutn: totalAmount,
//                 });
//             } else {
//                 const totalIncome = await referralModel.referralIncome.find({
//                     userId: req.body.userId,
//                 });
//                 let totalAmount = 0;
//                 for (let i = 0; i < totalIncome.length; i++) {
//                     totalAmount += totalIncome[i].amount;
//                 }
//                 res.json({
//                     status: 200,
//                     msg: "Success",
//                     totalAmoutn: totalAmount,
//                 });
//             }
//         }
//     } catch (error) {
//         res.json({ status: 400, msg: error.toString() });
//     }
// };

const getMyrewards = async function (req, res) {
  try {
    let page = req.params.page;
    let pageSize = req.params.pageSize;
    if (req.body.userId == undefined || req.body.userId == "") {
      res.json({ status: 400, msg: "nftId is required" });
      return;
    }

    const total = await referralModel.referralIncome
      .find({
        userId: req.body.userId,
      })
      .count();

    const myRewards = await referralModel.referralIncome
      .find({
        userId: req.body.userId,
      })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * page);

    let totalRewards = 0;
    let Ids = [];
    for (let i = 0; i < myRewards.length; i++) {
      totalRewards += myRewards[i].amount;
      Ids.push(myRewards[i].recievedFrom);
    }

    logger.info(
      Ids,
      "ids"
    );

    const getMyReferees = await models.users.find({
      _id: { $in: Ids },
    });
    logger.info(myRewards, "getMyReferees");

    let myreferees = [];
    if (getMyReferees && getMyReferees.length) {
      for (let i = 0; i < getMyReferees.length; i++) {
        for (let j = 0; j < myRewards.length; j++) {
          if (myRewards[j].recievedFrom == getMyReferees[i].id) {
            myreferees.push({
              id: getMyReferees[i].id,
              email: getMyReferees[i].email,
              refereeCode: myRewards[j].refereeCode,
              rewardDate: myRewards[j].createdAt,
              reward: myRewards[j].amount,
            });
          }
        }
      }
    }

    res.json({
      status: 200,
      msg: "Success",
      data: {
        totalReward: totalRewards,
        myReferees: myreferees,
      },
      total: total,
    });
  } catch (error) {
    res.json({ sttaus: 400, msg: error.toString() });
  }
};

const createPreSaleNFTInitiated = async function (req, res) {
  try {
    logger.info("Start of createPreSaleNFTInitiated");
    const {
      nftId,
      nftCount,
      userId,
      promoApplied,
      email,
      paymentId,
      paymentStatus,
    } = req.body;

    const presaleNftInitiated = await PresaletNftInitiated.findOne({
      userId: userId,
      paymentId: paymentId,
    });

    if (presaleNftInitiated) {
      logger.info("PreSale NFT record already exists.");
      res.json({
        status: 500,
        msg: "PreSale NFT record already exists !!",
      });
    } else {
      const presaleInft = await PresaletNftInitiated.create({
        nftId: nftId,
        nftCount: Number(nftCount),
        userId: userId,
        promoApplied: promoApplied,
        email: email,
        paymentId: paymentId,
        paymentStatus: paymentStatus,
      });
      if (presaleInft) {
        logger.info("Successfully created PreSale NFT initiation record.");
        logger.info("End of createPreSaleNFTInitiated");
        res.json({
          status: 200,
          msg: "PreSale NFT initiation completed successfully!!",
        });
      } else {
        logger.info("Unable to create PreSale NFT initiation record.");
        res.json({
          status: 500,
          msg: "An error occured while PreSale NFT initiation",
        });
      }
    }
  } catch (error) {
    logger.info(
      "Error occured in the createPreSaleNFTInitiated method - " +
        error.toString()
    );
    res.json({ sttaus: 500, msg: error.toString() });
  }
};

const updateNFTSaleOnPaidStatus = async function (req, res) {
  try {
    logger.info("Start of updateNFTSaleOnPaidStatus");
    const { userId, paymentId, amount, paymentStatus } = req.body;

    const presaleNft = await PresaletNftInitiated.find({
      userId: userId,
      paymentId: paymentId,
      paymentStatus: "action_required",
    });

    if (presaleNft) {
      const updatePreSaleNFT = await updatePreSaleNFTDetails(
        presaleNft,
        amount
      );
      if (updatePreSaleNFT === "SUCCESS") {
        logger.info("NFT pre sale info updated successfully.");
        logger.info("End of updateNFTSaleOnPaidStatus");
        res.status(200).json({
          msg: "NFT pre sale info updated successfully.",
        });
        presaleNft.paymentStatus = paymentStatus;
        await presaleNft.save();
      } else {
        logger.info("NFT record not found.");
        res.status(200).json({
          msg: "NFT record not found.",
        });
      }
    } else {
      logger.info("PreSale NFT initiation record not found.");
      res.status(200).json({
        msg: "PreSale NFT initiation record not found !!",
      });
    }
  } catch (error) {
    logger.error(
      "Error occured while updating presale NFT count upon success payment"
    );
    res.status(500).json({ msg: error.toString() });
  }
};

const updatePreSaleNFTDetails = async (presaleNft, amount) => {
  try {
    logger.info("Start of updatePreSaleNFTDetails");
    const findNFT = await Nft.presalenfts.findById(presaleNft.nftId);
    if (findNFT) {
      logger.info("Updating itemSold field for presaleNFT");
      findNFT.itemSold =
        parseInt(findNFT.itemSold) + parseInt(presaleNft.nftCount);
      await findNFT.save();
      logger.info("Updating itemSold field for presaleNFT");
      const promoApplied = presaleNft.promoApplied;
      let promoDiv = 0;
      if (promoApplied !== "false") {
        logger.info(
          "Promo Applied during presale NFT purchase - " + promoApplied
        );
        const promo = await PromoCode.findOne({ promoCode: promoApplied });
        promoDiv = promo.percentDiscount;
      }
      const amountTotal = (findNftById[0].price * (100 - promoDiv)) / 100;
      const updatePresale = await PresaleBoughtNft.create({
        nftIdOwned: presaleNft.nftId,
        owner: userId,
        nft: ObjectId(presaleNft.nftId),
        amountSpent: amountTotal,
        promoCode: promoApplied,
        quantity: presaleNft.nftCount,
      });
      logger.info(
        "Adding referral income for - " +
          userId +
          "for the nft with id - " +
          presaleNft.nftId
      );
      addMyIncomeMetaMask(nftId, userId, updatePresale._id);
      logger.info("NFT pre sale info updated successfully.");

      const createObj = {
        email: presaleNft.email,
        amount,
        status: "paid",
        nftId: presaleNft.nftId,
        paymentId: presaleNft.paymentId,
        quantity: presaleNft.nftCount,
      };
      logger.info("Creating record into Circle Payment");
      await CirclePayment.create(createObj);
      logger.info(
        "Successfully created record into Circle Payment " + createObj
      );
      logger.info("Sending confirmation email to user");

      await sendPaymentConfirmation({
        email: presaleNft.email,
        quantity: presaleNft.nftCount,
        amount: amount,
      });
      logger.info("Sent confirmation email to user " + presaleNft.email);
      logger.info("End of updatePreSaleNFTDetails");
      return "SUCCESS";
    } else {
      logger.info("Unable to find presaleNFT");
      return "ERROR";
    }
  } catch (error) {
    logger.info(
      "Error occured while updatePreSaleNFTDetails - " + error.toString()
    );
    return "ERROR";
  }
};

module.exports = {
  getPriceTrail,
  getPresaleSetting,
  create,
  getNFTByTokenId,
  getAll,
  mintNFT,
  approveNFT,
  sellNft,
  getNFTByUserId,
  getAllData,
  buyNft,
  ownedNft,
  getNftById,
  searchNftsFilter,
  addMyIncomeMetaMask,
  getMyrewards,
  updateTotalSupply,
  userBoughtNft,
  getNftByUserId,
  userBoughtNftMetamask,
  createPreSaleNFTInitiated,
  updateNFTSaleOnPaidStatus,
  updatePreSaleNFTDetails,
};
