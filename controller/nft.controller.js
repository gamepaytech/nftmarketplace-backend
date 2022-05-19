const Nft = require("../models/presaleNfts");
const models = require("../models/User");
const mongoose = require("mongoose");
const NFTStates = require("../models/NFT-States");
const referralModel = require("../models/referralModel");
const PresaleBoughtNft = require("../models/PresaleBoughtNft");
const PromoCode = require("../models/PromoCode")
const ObjectId = mongoose.Types.ObjectId;
// const nftPresale = require("../models/NftPresale");
const logger = require('../logger')

const getPresaleSetting = async (req, res) => {
    const data = await Nft.settingpresalenfts.findOne({});
    res.status(201).json({ "msg":"success", data: data });
};

const create = async (req, res) => {
    const {
        // jsonHash,
        name,
        nftType,
        description,
        chain,
        tokenId,
        mintedBy,
        collectionName,
        category,
        royalty,
        cloudinaryUrl,
        owner,
        uploadedBy,
        price,
        nftClass,
        gender,
        accessories,
        colour,
        chikCount,
        others,
        breedCount,
        nftTotalSupply,
    } = req.body;
    // const jk = 'kkdskds'
    // logger.info(req, req.body)
    if (!name) {
        res.status(400).json({ msg: "Please provide the nft name" });
        return;
    } else if (!nftType) {
        res.status(400).json({ msg: "Please provide the nft type" });
        return;
    }

    const createObj = {
        // jsonHash,
        name,
        nftType,
        description,
        chain,
        tokenId,
        mintedBy,
        collectionName,
        category,
        royalty,
        cloudinaryUrl,
        owner,
        uploadedBy,
        price,
        nftClass,
        gender,
        accessories,
        colour,
        chikCount,
        others,
        breedCount,
        nftTotalSupply,
    };
    logger.info(createObj);
    const data = await Nft.presalenfts.create(createObj);
    // logger.info("data ",data);
    res.status(200).json({ data: data });
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
            const nfts = await Nft.presalenfts.find({ nftStatus: 2 })
                .sort({
                    createdAt: -1,
                })
                .limit(limit);
            res.status(201).json({ data: nfts });
        } else {
            const nfts = await Nft.presalenfts.find({ nftStatus: 1 })
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

//search in nft database using their attributes
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

    nftFilter = await Nft.presalenfts.find({
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
    const nfts = await Nft.presalenfts.find();
    res.status(201).json(nfts);
};
// fetch NFT using nft id
const getNftById = async (req, res) => {
    const { nftId } = req.body;

    if (!nftId) {
        res.status(400).json({ msg: "Please provide NFT id" });
        return;
    } else if (nftId === "undefined") {
        res.status(400).json({ msg: "Wrong NFT Credentials!!" });
        return;
    }
    try {
        const data = await Nft.presalenfts.findOne({ _id: nftId });
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

const buyNft = async (req, res) => {
    const { nftId, newOwner } = req.body;
    await Nft.presalenfts.updateOne({ _id: nftId }, { nftStatus: 2, owner: newOwner });
    res.send({
        msg: "NFT Updates",
        nftId: nftId,
        newOwner: newOwner,
    });
};

const sellNft = async (req, res) => {
    const { nftId, newOwner, price } = req.body;
    await Nft.presalenfts.updateOne(
        { _id: nftId },
        { nftStatus: 1, owner: newOwner, price: price }
    );
    res.send({
        msg: "NFT Updates",
        nftId: nftId,
        newOwner: newOwner,
    });
};

const ownedNft = async (req, res) => {
    const { wallet } = req.body;
    const nfts = await Nft.presalenfts.find({ owner: { $in: wallet } });
    res.status(201).json(nfts);
};

const userBoughtNft = async (req, res) => {
    const { nftId, userId, promoApplied, quantity } = req.body;
    const findNftById = await Nft.presalenfts.find({ _id: nftId });
    // logger.info("NFT ",findNftById)
    var promoDiv = 0
    if(promoApplied !== "false"){
        logger.info(promoApplied,"promo")
        const promo = await PromoCode.findOne({promoCode:promoApplied})
        logger.info(promo)
        promoDiv= promo.percentDiscount
    }
    logger.info(promoDiv,findNftById)
    const amountTotal = (findNftById[0].price *(100 - promoDiv))/100
    logger.info(amountTotal,"amountTotal")
    const updatePresale = await PresaleBoughtNft.create({
        nftIdOwned : nftId,
        owner : userId,
        nft : ObjectId(nftId),
        amountSpent : amountTotal,
        promoCode : promoApplied,
        quantity : quantity
    });
    logger.info(updatePresale);
    res.status(200).json({
        message: "SUCCESS",
        updatePresale,
    });
};
const getNftByUserId = async (req, res) => {
    try {
        const { userId } = req.body;

        const findNfts = await PresaleBoughtNft.find({ owner: userId }).populate({
            path:"nft"
        });
        console.log("findNfts ",findNfts);
    // logger.info("findnfts ",findNfts);
    if (!findNfts) {
        return res.status(404).json({
            error: "Error! No nft found",
        });
    }
    //  logger.info(findNfts,"FIND NFTS")
    //  let allNft = new Array();
    //  for (let i = 0; i < findNfts.length; i++) {
    //      const findNft = await Nft.presalenfts.find({ _id: findNfts[i].nft });
    //      // logger.info("nfts ",findNft);
    //      console.log("findNft", findNft);
    //      if (findNft.length > 0) {
    //          allNft[i] = {
    //              buyData:findNfts,
    //              nft:findNft
    //          };
    //      }
    //  }
    //  const newNft = allNft.filter(function (el) {
    //      return el != null;
    //  })
    //  console.log("newNft", newNft);
    //  logger.info("NFTS" ,newNft);
    res.status(200).json({
        allNft: findNfts,
    });
    }
    catch(err) {
        logger.info(err);
        res.status(500).json({
            err:"Internal Server Error!"
        })
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

const addMyIncome = async function (req, res) {
    try {
        if (
            req.body.nftId == undefined ||
            req.body.nftId == "" ||
            req.body.userId == undefined ||
            req.body.userId == ""
        ) {
            res.json({ status: 400, msg: "nftId is required" });
            return;
        }
        

        const userInfo = await models.users.findById(req.body.userId);
        if (userInfo && userInfo.refereeCode != "") {
            const getMyreferral = await models.users.find({ 
                referralCode: userInfo.refereeCode,
            });
            logger.info("GET MY REFERRAL ",getMyreferral[0]._id)
            const bought = await PresaleBoughtNft.findOne({_id:req.body.purchaseId})
            logger.info("bought ",bought);
            if(bought){
                const getMyRefferalsDetail = await referralModel.referralDetails.findOne({referralCode:userInfo[0].refereeCode}) 
                logger.info("getMyRefferalsDetail ",getMyRefferalsDetail);
                if(getMyRefferalsDetail){
                    let myShareAmount = (bought.amountSpent *bought.quantity / 100) * parseInt(getMyRefferalsDetail.myShare);
                    let myFriendShareAmount = (bought.amountSpent *bought.quantity / 100) * parseInt(getMyRefferalsDetail.friendShare);
                    const addMyIncome = await new referralModel.referralIncome({
                        userId: getMyreferral[0]._id,
                        amount: myShareAmount,
                        nftId: req.body.nftId,
                        recievedFrom: req.body.userId,
                    });
                    await addMyIncome.save(); 
                    const addFriendIncome = await new referralModel.referralIncome({
                        userId:req.body.userId,
                        amount: myFriendShareAmount,
                        nftId: req.body.nftId,
                        recievedFrom:  getMyreferral[0]._id,
                    });
                    await addFriendIncome.save();   
                }
            }

            const totalIncome = await referralModel.referralIncome.find({
                userId: getMyreferral[0]._id,
            });
            let totalAmount = 0;
            for (let i = 0; i < totalIncome.length; i++) {
                totalAmount += totalIncome[i].amount;
            }

            res.json({
                stauts: 200,
                msg: "Success",
                totalAmount: totalAmount,
            });
        } else {

            res.json({
                status: 200,
                msg: "The user is not refered by anyone",
            });
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() });
    }
};

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
        if (req.body.userId == undefined || req.body.userId == "") {
            res.json({ status: 400, msg: "nftId is required" });
            return;
        }

        const myRewards = await referralModel.referralIncome.find({
            userId: req.body.userId,
        });

        let totalRewards = 0;
        let Ids = [];
        for (let i = 0; i < myRewards.length; i++) {
            totalRewards += myRewards[i].amount;
            Ids.push(myRewards[i].recievedFrom);
        }

        logger.info(Ids,"idssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")

        const getMyReferees = await models.users.find({
            _id: { $in: Ids },
        });

        logger.info(myRewards,"getMyReferees")

        let myreferees = [];
        if (getMyReferees && getMyReferees.length) {
            for (let i = 0; i < getMyReferees.length; i++) {
                for (let j = 0; j < myRewards.length; j++) {
                    if (myRewards[j].recievedFrom == getMyReferees[i].id) {
                        myreferees.push({
                            id: getMyReferees[i].id,
                            email: getMyReferees[i].email,
                            username: getMyReferees[i].username,
                            rewardDate: myRewards[j].createdDate,
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
        });
    } catch (error) {
        res.json({ sttaus: 400, msg: error.toString() });
    }
};

module.exports = {
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
    addMyIncome,
    getMyrewards,
    updateTotalSupply,
    userBoughtNft,
    getNftByUserId,
};
