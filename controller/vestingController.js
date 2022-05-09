const Nft = require("../models/presaleNfts");
const models = require("../models/User");
const Vesting = require("../models/vesting");
const LockedToken = require("../models/lockedTokens");
const logger = require('../logger')

const createVestingData = async (req, res) => {
    try {
        logger.info("RESA ", req.user, "REQ");

        const {
            wallet_address,
            token_amount_invested,
            token_allotted_qty,
            token_unit_price,
            token_unit_currency,
            nft_amount_invested,
            nft_allotted_qty,
            nft_unit_price,
            nft_unit_currency,
        } = req.body;

        const createVesting = await Vesting.create({
            wallet_address,
            nft: {
                amount_invested: nft_amount_invested,
                allotted_qty: nft_allotted_qty,
                unit_price: nft_unit_price,
                unit_currency: nft_unit_currency,
            },
            token: {
                amount_invested: token_amount_invested,
                allotted_qty: token_allotted_qty,
                unit_price: token_unit_price,
                unit_currency: token_unit_currency,
            },
        });

        if (!createVesting) {
            return res.status(404).json({
                err: "Error not found!",
                status: 404,
            });
        }

        res.status(200).json({
            vesting: createVesting,
            msg: "Vesting data created!",
            status: 200,
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal Server Error!",
        });
    }
};
const vestingGetData = async (req, res) => {
    try {
        const findData = await Vesting.find({});

        if (!findData) {
            return res.status(404).json({
                err: "No token vesting data found!",
            });
        }

        res.status(200).json({
            data: findData,
            status: 200,
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "500: Internal Server Error!",
            status: 500,
        });
    }
};
const updateVestingDataById = async (req, res) => {
    try {
        const {
            token_amount_invested,
            token_allotted_qty,
            token_unit_price,
            token_unit_currency,
            nft_amount_invested,
            nft_allotted_qty,
            nft_unit_price,
            nft_unit_currency,
        } = req.body;
        logger.info("v ",req.body.vestingId);
        const findData = await Vesting.findOneAndUpdate(
            {
                _id: req.body.vestingId,
            },
            {
                nft: {
                    amount_invested: nft_amount_invested,
                    allotted_qty: nft_allotted_qty,
                    unit_price: nft_unit_price,
                    unit_currency: nft_unit_currency,
                },
                token: {
                    amount_invested: token_amount_invested,
                    allotted_qty: token_allotted_qty,
                    unit_price: token_unit_price,
                    unit_currency: token_unit_currency,
                },
            }
        );

        logger.info("fd ",findData);

        if (!findData) {
            return res.status(404).json({
                err: "Error vesting data not found!",
            });
        }

        res.status(200).json({
            data: findData,
            msg: "Data updated successfully!",
            status: 200,
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal Server Error!",
        });
    }
};

const deleteVestingDataById = async (req, res) => {
  try {
    const deleteData = await Vesting.findOneAndDelete({
      "_id":req.body.vestingId
    })

    logger.info("DELETE DATA ",deleteData);
    if(!deleteData) {
      return res.status(404).json({
        err:"Error! data not found."
      })
    }
    res.status(200).json({
      msg:"Success, Data deleted!"
    })
  }
  catch(err) {
    logger.info(err);
    res.status(500).json({
      err:"Internal Server Error!"
    })
  }
}

const getVestingByWallet = async (req, res) => {
    try {
        if(!req.body.walletAddress) {
          return res.status(404).json({
            err:"Error! Please provide the wallet address."
          });
        }
        const findByWallet = await Vesting.findOne({
            wallet_address: req.body.walletAddress,
        });

        if (!findByWallet) {
            return res.status(404).json({
                err: "No data found",
            });
        }
        res.status(200).json({
            data: findByWallet,
            status: 200,
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};

const getLockedTokens = async (req, res) => {
    try {
      logger.info("A ",req.body.wallet_address);
        const getData = await LockedToken.find({
            wallet_address: req.body.wallet_address,
        });
        if (!getData) {
            res.status(404).json({
                err: "Internal Server Error!",
            });
        }

        res.status(200).json({
            data: getData,
            status: 200,
        });
    } catch (err) {
        logger.info(err);
    }
};

module.exports = {
    vestingGetData,
    getVestingByWallet,
    getLockedTokens,
    createVestingData,
    updateVestingDataById,
    deleteVestingDataById
};
