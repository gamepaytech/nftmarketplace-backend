const models = require('../models/User');
const axios = require('axios');
const logger = require('../logger');

const getAllPaymentsFromCircle = async (req, res) => {
    try {
        const userInfo = await models.users.findOne({
            username: req.params.userName,
        });
        if(userInfo && (userInfo.isAdmin || userInfo.isSuperAdmin)){
            axios({
                url: `${process.env.CIRCLE_API_URL}/v1/payments`,
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.CIRCLE_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((resp) => {
                    logger.info('Received data related to the list of all payments');
                    logger.info({
                        message: 'Success',
                        data: resp.data
                    });
                    res.status(200).json({
                        message: 'Success',
                        data : resp.data
                    });
                })
                .catch((err) => {
                    logger.error(
                        'Error occured while fetching list of all payments from circle'
                    );
                    logger.error(err);
                    res.status(500).json({ error: 'Error ocurred while fetching list of payments' });
                });
        }else{
            logger.info('User not authorized to get payments data!');
            res.status(401).json({
                error: 'Unauthorized to get payments information.',
            });
        }
    } catch (err) {
        logger.error(err);
        res.status(500).json({
            error: 'Error occurred while fetching data from circle api',
        });
    }
};

const getPaymentInfoFromCircle = async (req, res) => {
    try {
        const userInfo = await models.users.findOne({
            username: req.params.userName,
        });
        if(userInfo && (userInfo.isAdmin || userInfo.isSuperAdmin)){
            const paymentId = req.params.paymentId;
            axios({
                url: `${process.env.CIRCLE_API_URL}/v1/payments/${paymentId}`,
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.CIRCLE_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((resp) => {
                    logger.info('Received data related to the payment id -' + paymentId);
                    logger.info({
                        message: 'Success',
                        data: resp.data
                    });
                    res.status(200).json({
                        message: 'Success',
                        data : resp.data
                    });
                })
                .catch((err) => {
                    logger.error(
                        'Error occured while fetching payment info from circle'
                    );
                    logger.error(err);
                    res.status(500).json({ error: 'Error ocurred while fetching payment info' });
                });
        }else{
            logger.info('User not authorized to get payment info details!');
            res.status(401).json({
                error: 'Unauthorized to get payment info information.',
            });
        }
    } catch (err) {
        logger.error(err);
        res.status(500).json({
            error: 'Error occurred while fetching data from circle api',
        });
    }
};

module.exports = {
    getAllPaymentsFromCircle,
    getPaymentInfoFromCircle
};
