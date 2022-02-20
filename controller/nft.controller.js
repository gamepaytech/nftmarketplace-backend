const Nft = require('../models/Nft')
const models = require('../models/User')
const mongoose = require('mongoose')
const NFTStates = require('../models/NFT-States')
const referralModel = require('../models/referralModel')
const ObjectId = mongoose.Types.ObjectId

const create = async (req, res) => {
    const {
        jsonHash,
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
        others,
        breedCount,
    } = req.body
    const jk = 'kkdskds'
    console.log(req, req.body)
    if (!name) {
        throw new CustomError.BadRequestError('Please provide the nft name')
    } else if (!nftType) {
        throw new CustomError.BadRequestError('Please provide the nft type')
    }

    const createObj = {
        jsonHash,
        name,
        price,
        description,
        nftClass,
        gender,
        accessories,
        colour,
        others,
        breedCount,
        nftType,
        uploadedBy,
        chain,
        tokenId,
        mintedBy,
        collectionName,
        category,
        cloudinaryUrl,
        royalty,
        owner,
    }
    console.log(createObj)
    const data = await Nft.create(createObj)
    // console.log("data ",data);
    res.status(200).json({ data })
}

const getAllData = async (req, res) => {
    const type = req.query.type
    const limit = req.query.limit
    const time = req.query.time
    // console.log(type)
    // console.log(limit)

    if (type && !limit && !time) {
        if (type === 'sold') {
            const nfts = await Nft.find({ nftStatus: 2 }).sort({
                createdAt: -1,
            })
            res.status(201).json({ data: nfts })
        } else {
            const nfts = await Nft.find({ nftStatus: 1 }).sort({
                createdAt: -1,
            })
            res.status(201).json({ data: nfts })
        }
    } else if (type && limit && !time) {
        if (type === 'sold') {
            const nfts = await Nft.find({ nftStatus: 2 })
                .sort({
                    createdAt: -1,
                })
                .limit(limit)
            res.status(201).json({ data: nfts })
        } else {
            const nfts = await Nft.find({ nftStatus: 1 })
                .sort({
                    createdAt: -1,
                })
                .limit(limit)
            res.status(201).json({ data: nfts })
        }
    } else if (time) {
        const date1 = new Date()
        const date2 = new Date()
        const date3 = new Date()
        const lastMonth = new Date(date1.setDate(date1.getDate() - 30))
        const lastWeek = new Date(date2.setDate(date2.getDate() - 7))
        const lastDay = new Date(date3.setDate(date3.getDate() - 1))
        console.log(lastWeek)
        console.log(lastDay)
        console.log(lastMonth)
        const nfts = await Nft.aggregate([
            { $match: { createdAt: { $gte: lastMonth } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                    sales: '$price',
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' },
                },
            },
        ])
        res.status(201).json({ data: nfts })
    } else {
        const nfts = await Nft.find()
        res.status(201).json({ data: nfts })
    }
}

//search in nft database using their attributes
const searchNftsFilter = async (req, res) => {
    // const {filter} = req.body
    //array of class
    let classData = req.body.class
    let genderData = req.body.gender
    let accessories = req.body.accessories
    let colour = req.body.colour
    let others = req.body.others
    let breedCount = req.body.breedCount

    const array = []
    // console.log(classData !== '')
    if (classData.length !== 0) {
        const data = { nftClass: { $in: classData } }
        array.push(data)
    }
    if (genderData.length !== 0) {
        const data = { gender: { $in: genderData } }
        array.push(data)
    }
    if (accessories.length !== 0) {
        const data = { accessories: { $in: accessories } }
        array.push(data)
    }
    if (colour.length !== 0) {
        const data = { colour: { $in: colour } }
        array.push(data)
    }
    if (others.length !== 0) {
        const data = { others: { $in: others } }
        array.push(data)
    }
    if (breedCount !== 0) {
        const data = { breedCount: { $in: breedCount } }
        array.push(data)
    }
    // console.log(array, 'HI')

    nftFilter = await Nft.find({
        $and: array,
    })

    res.json({
        status: 200,
        data: nftFilter,
    })
}

const getNFTByTokenId = async (req, res) => {
    const tokenId = req.params.tokenId
    console.log(tokenId)
    const nft = await Nft.findOne({
        tokenId,
    })
    console.log(nft)
    res.status(201).json({ nft })
}

const getAll = async (req, res) => {
    const userId = req.user.userId
    const nfts = await Nft.find({ owner: userId })
    res.status(201).json({ data: nfts })
}

const getNFTByUserId = async (req, res) => {
    // const userId = req.params.userId;
    const nfts = await Nft.find()
    res.status(201).json(nfts)
}
// fetch NFT using nft id
const getNftById = async (req, res) => {
    const { nftId } = req.body

    if (!nftId) {
        throw new CustomError.BadRequestError(true, 'Please provide NFT id')
    }
    const data = await Nft.findOne({ _id: nftId })
    res.send({
        data: data,
        msg: 'Successfull',
    })
}

const mintNFT = async (req, res) => {
    const { nftId, mintHash, receipt, blockNumber, tokenId } = req.body

    if (!nftId) {
        res.status(400).json({ msg: 'Please provide NFT id' })
    } else if (!mintHash) {
        res.status(400).json({ msg: 'Please provide the mint hash' })
    } else if (!receipt) {
        res.status(400).json({ msg: 'Receipt is required' })
    } else if (!blockNumber) {
        res.status(400).json({ msg: 'Please provide Block Number' })
    } else if (tokenId != 0 && !tokenId) {
        res.status(400).json({ msg: 'Please provide token Id' })
    } else {
        let updateObj = {
            mintHash,
            mintReceipt: receipt,
            blockNumber,
            tokenId,
            mintedBy: receipt.from,
        }

        await Nft.updateOne({ _id: ObjectId(nftId) }, updateObj)
        await NFTStates.create({
            nftId: ObjectId(nftId),
            state: 'Mint',
            from: receipt.from,
            to: 'contract',
        })
        res.status(201).json({ msg: 'NFT minted successfully' })
    }
}

const buyNft = async (req, res) => {
    const { nftId, newOwner } = req.body
    await Nft.updateOne({ _id: nftId }, { nftStatus: 2, owner: newOwner })
    res.send({
        msg: 'NFT Updates',
        nftId: nftId,
        newOwner: newOwner,
    })
}

const ownedNft = async (req, res) => {
    const { wallet } = req.body
    const nfts = await Nft.find({ owner: {'$in': wallet} })
    res.status(201).json(nfts)
}

const approveNFT = async (req, res) => {
    const { nftId, approveHash } = req.body
    if (nftId) {
        res.status(400).json({ msg: 'Please provide the NFT id' })
    } else if (!approveHash) {
        res.status(400).json({ msg: 'Please provide the approve hash' })
    } else {
        await Nft.updateOne(
            { _id: ObjectId(nftId) },
            { isApproved: true, approvedAt: new Date(), approveHash }
        )
        await NFTStates.create({
            nftId: ObjectId(nftId),
            state: 'Approve',
            from: 'address',
            to: 'contract',
        })
        res.status(201).send({ msg: 'NFT updated' })
    }
}

const addMyIncome = async function (req, res) {
    try {
        if (
            req.body.nftId == undefined ||
            req.body.nftId == '' ||
            req.body.userId == undefined ||
            req.body.userId == ''
        ) {
            res.json({ status: 400, msg: 'nftId is required' })
            return
        }

        const query = await referralModel.referralIncome.find({
            receivedFrom: req.body.userId,
            nftId: req.body.nftId,
        })

        if (query && query.length > 0) {
            res.status(400).json({ msg: 'Already Purchased' })
        } else {
            const userInfo = await models.users.find({ _id: req.body.userId })

            if (userInfo && userInfo[0].refereeCode != '') {
                const data = await Nft.findOne({ _id: req.body.nftId })
                const setting = await referralModel.appsetting.findOne({})
                let referralIncome =
                    (data.price / 100) * setting.referralPercent

                const getMyreferral = await models.users.find({
                    referralCode: userInfo[0].refereeCode,
                })

                const addMyIncome = await new referralModel.referralIncome({
                    userId: getMyreferral[0]._id,
                    amount: referralIncome,
                    nftId: req.body.nftId,
                    recievedFrom: req.body.userId,
                })

                await addMyIncome.save()

                const totalIncome = await referralModel.referralIncome.find({
                    userId: req.body.userId,
                })
                let totalAmount = 0
                for (let i = 0; i < totalIncome.length; i++) {
                    totalAmount += totalIncome[i].amount
                }

                res.json({
                    sttaus: 200,
                    msg: 'Success',
                    totalAmoutn: totalAmount,
                })
            } else {
                const totalIncome = await referralModel.referralIncome.find({
                    userId: req.body.userId,
                })
                let totalAmount = 0
                for (let i = 0; i < totalIncome.length; i++) {
                    totalAmount += totalIncome[i].amount
                }
                res.json({
                    status: 200,
                    msg: 'Success',
                    totalAmoutn: totalAmount,
                })
            }
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getMyrewards = async function (req, res) {
    try {
        if (req.body.userId == undefined || req.body.userId == '') {
            res.json({ status: 400, msg: 'nftId is required' })
            return
        }

        const myRewards = await referralModel.referralIncome.find({
            userId: req.body.userId,
        })

        let totalRewards = 0
        let Ids = []
        for (let i = 0; i < myRewards.length; i++) {
            totalRewards += myRewards[i].amount
            Ids.push(myRewards[i].recievedFrom)
        }

        const getMyReferees = await models.users.find({
            _id: { $in: Ids },
        })

        let myreferees = []
        if (getMyReferees && getMyReferees.length) {
            for (let i = 0; i < getMyReferees.length; i++) {
                for (let j = 0; j < myRewards.length; j++) {
                    if (myRewards[j].recievedFrom == getMyReferees[i].id) {
                        myreferees.push({
                            id: getMyReferees[i].id,
                            email: getMyReferees[i].email,
                            rewardDate: myRewards[j].createdDate,
                            reward: myRewards[j].amount,
                        })
                    }
                }
            }
        }

        res.json({
            status: 200,
            msg: 'Success',
            data: {
                totalReward: totalRewards,
                myReferees: myreferees,
            },
        })
    } catch (error) {
        res.json({ sttaus: 400, msg: error.toString() })
    }
}

module.exports = {
    create,
    getNFTByTokenId,
    getAll,
    mintNFT,
    approveNFT,
    getNFTByUserId,
    getAllData,
    buyNft,
    ownedNft,
    getNftById,
    searchNftsFilter,
    addMyIncome,
    getMyrewards,
}
