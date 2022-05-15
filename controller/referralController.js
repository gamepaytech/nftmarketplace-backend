const Nft = require("../models/presaleNfts");
const models = require("../models/User");
const Vesting = require("../models/vesting");
const LockedToken = require("../models/lockedTokens");
const logger = require('../logger');
const referralModel = require("../models/referralModel");
const { getReferralCode } = require("../utils/referralUtils");

const createReferral = async (req, res) => {
    try {
        const { userId, myShare, friendShare, note, isDefault } = req.body;
        if(userId && myShare && friendShare){
            logger.info("Begin  of creating of referral for user :: " + userId);
            const referralCode = await getReferralCode(); // to revisit the logic as referral code in Users collection is a single field 
            if(isDefault){
                await referralModel.referralDetails.updateOne(
                  { isDefault: true },
                  { $set: { isDefault: false } }
                );
            }
            const referral = await referralModel.referralDetails.create({
                userId: userId,
                referralCode:  referralCode.code,
                myShare: myShare,
                friendShare: friendShare,
                description: note,
                isDefault: isDefault,
                status:"active"
            });
            if(referral){
                // send the list of referrals to UI
                const getReferrals = await referralModel.referralDetails.find(
                    { $and: [{ userId: userId }, { status:'active'} ] }
                );
                res.status(200).json({
                    msg: "Referral created!",
                    data: getReferrals
                });
                logger.info('End  of creating of referral for user :: ' + userId);
            }else{
                logger.error('Error occured while creating referral');
                return res.status(500).json({
                    msg: "Error occured while creating referral!"
                });
            }
        }else{
            logger.info('userId , myShare , friendShare details are required for creating a referral');
            res.status(400).json({
                msg: 'UserId and Share details are mandatory for a referral to be created'
            });
        }
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal Server Error!",
        });
    }
};

const getReferralsByUserId = async (req, res) => {
    try {
        const userId = req.body.userId;
        let page = req.query.page;
        let pageSize = req.query.pageSize;
        let total = await referralModel.referralDetails.count({});
        if (userId) {
            const getData = await referralModel.referralDetails.find(
                { $and: [{ userId: userId }, { status:'active'} ] }
            ).limit(pageSize)
            .skip(pageSize * page);
            if (getData) {
                res.status(200).json({
                    data: getData,
                    total:total,
                    page:page,
                    perPage:pageSize,
                    status: 200,
                });
            } else {
                res.status(204).json({
                    msg: 'No data found for the given user'
                });
            }
        } else {
            logger.info('UserId cannot be null');
            res.status(400).json({
                msg: 'UserId cannot be null'
            });
        }
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "500: Internal Server Error!",
            status: 500,
        });
    }
};

const updateReferral = async (req, res) => {
    try {
        const { id, userId, myShare, friendShare, note, isDefault } = req.body;
        if(id && userId && myShare && friendShare){
            logger.info("Begin  of updating of referral for user :: " + id);
            const checkReferrals = await referralModel.referralDetails.find({ _id: id });
            if(checkReferrals.length != 0){
                if(isDefault){
                    await referralModel.referralDetails.updateOne(
                      { isDefault: true },
                      { $set: { isDefault: false } }
                    );
                }
                const referral = await referralModel.referralDetails.updateOne(
                  { _id: id },
                  {
                    $set: {
                      myShare: myShare,
                      friendShare: friendShare,
                      note: note,
                      isDefault: isDefault,
                      status: "active",
                    },
                  }
                );
                if(referral){
                    // send the list of referrals to UI
                    const getReferrals = await referralModel.referralDetails.find(
                        { $and: [{ userId: userId }, { status:'active'} ] }
                    );
                    res.status(200).json({
                        msg: "Referral Updated!",
                        data: getReferrals
                    });
                    logger.info('End  of creating of referral for user :: ' + id);
                }else{
                    logger.error('Error occured while updating referral');
                    return res.status(500).json({
                        msg: "Error occured while updating referral!"
                    });
                }
            }else{
                res.status(400).json({
                    msg: 'Referral Not Found'
                }); 
            }
        }else{
            logger.info('id , myShare , friendShare details are required for updating a referral');
            res.status(400).json({
                msg: 'id and Share details are mandatory for a referral to be updated'
            });
        }
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal Server Error!",
        });
    }
};

const deleteReferral = async (req, res) => {
    try {
        const { id, userId } = req.body;
        const deleteData = await referralModel.referralDetails.updateOne({
            "_id": id
        },{$set:{
            status:"draft"
        }})
        if(deleteData){
            const getReferrals = await referralModel.referralDetails.find(
                { $and: [{ userId: userId }, { status:'active'} ] }
            );
            res.status(200).json({
                msg: "Referral deleted!",
                data: getReferrals
            });
            logger.info('End  of creating of referral for user :: ' + id);
        }else{
            return res.status(404).json({
                err: "Error! data not found."
            })   
        }
    }
    catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal Server Error!"
        })
    }
}

module.exports = {
    createReferral,
    getReferralsByUserId,
    updateReferral,
    deleteReferral
};
