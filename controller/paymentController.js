// const Nft = require("../models/Nft");
const Nft = require("../models/presaleNfts");
const models = require("../models/User");
const CirclePayment = require("../models/circlePayments.js");
const referralModel = require("../models/referralModel");
const TripleaPayment = require("../models/TripleaPayment.js");
const PresaleBoughtNft = require("../models/PresaleBoughtNft");
const PromoCode = require("../models/PromoCode");
const CoinbasePayment = require("../models/coinbasePayments");
const LaunchpadPayment = require("../models/launchpadPayment");
const LaunchpadAmount = require("../models/launchpadAmount");
const sendPaymentConfirmation = require("../utils/sendPaymentConfirmation");
const { tokenGen, reqPayment } = require("../apisaaa");
var crypto = require("crypto");
const sdk = require("api")("@circle-api/v1#j7fxtxl16lsbwx");
const { uuid } = require("uuidv4");
const axios = require("axios");
const mongoose = require("mongoose");
const qs = require("qs");
const { Client, resources, Webhook } = require("coinbase-commerce-node");
const ObjectId = mongoose.Types.ObjectId;
const logger = require("../logger");
const r = require("request");
const MessageValidator = require("sns-validator");

const circleArn =
    /^arn:aws:sns:.*:908968368384:(sandbox|prod)_platform-notifications-topic$/;

const validator = new MessageValidator();

const createActivity = async (userId, price, isGood, gateway, orderId) => {
    await models.users.updateOne(
        { _id: userId },
        {
            $push: {
                activity: {
                    activity: `You have ${isGood == true ? "commited" : "initiated"
                        } ${price.toFixed(2)} USDT amount using ${gateway}.`,
                    timestamp: new Date(),
                    orderId: orderId,
                },
            },
        },
        { new: true, upsert: true }
    );
};
const updateActivity = async (userId, orderId, dataString) => {
    await models.users.updateOne(
        {
            _id: userId,
            "activity.orderId": orderId,
        },
        { $set: { "activity.$.activity": dataString } }
    );
};

const createPayment = async (req, res) => {
    try {
        const {
            cardId,
            email,
            network,
            status,
            expMonth,
            expYear,
            fingerprint,
            fundingType,
            nftId,
            sessionId,
            cvvEncrpytion,
            keyIdEncrpytion,
            quantity,
            // encryptedData
        } = req.body;
        const buyNft = await Nft.presalenfts.find({ _id: nftId });
        logger.info("bb ", buyNft[0].price, quantity);

        const nftAmount = parseFloat(buyNft[0].price / 10 ** 6) * quantity;

        if (nftAmount < 0.5) {
            return res.status(400).json({
                error: "Price is less than 0.5$",
            });
        }
        logger.info("NFT AMOUNT", nftAmount.toFixed(2).toString());

        logger.info(
            "DATA ",
            {
                metadata: {
                    email: email,
                    sessionId: sessionId,
                    ipAddress: "172.33.222.1",
                },
                amount: {
                    amount: nftAmount.toFixed(2).toString(),
                    currency: "USD",
                },
                autoCapture: true,
                source: { id: cardId, type: "card" },
                idempotencyKey: uuid(),
                verification: "cvv",
                encryptedData: cvvEncrpytion.encryptedMessage,
                keyId: "key1",
                // verificationSuccessUrl: "http://localhost:3000/payment_success",
                // verificationFailureUrl: "http://localhost:3000/payment_failure",
            },
            "SDF"
        );

        sdk.auth(process.env.CIRCLE_TOKEN);
        sdk.createPayment({
            metadata: {
                email: email,
                sessionId: sessionId,
                ipAddress: "172.33.222.1",
            },
            amount: {
                amount: nftAmount.toFixed(2).toString(),
                currency: "USD",
            },
            autoCapture: true,
            source: { id: cardId, type: "card" },
            idempotencyKey: uuid(),
            verification: "cvv",
            encryptedData: cvvEncrpytion.encryptedMessage,
            keyId: "key1",
            // verificationSuccessUrl: "http://localhost:3000/payment_success",
            // verificationFailureUrl: "http://localhost:3000/payment_failure",
        })
            .then((ares) => {
                logger.info("AAA ", ares);
                res.status(200).json({
                    message: "Success",
                    res: ares.data,
                });
            })
            .catch((err) => {
                logger.info("A", err);
                res.status(400).json({ error: "a.Some error ocurred" });
            });
    } catch (err) {
        logger.info(err);
        res.status(400).json({
            error: "c.Some error ocurred",
        });
    }
};
const saveCirclePaymentData = async (req, res) => {
    try {
        const { email, amount, status, nftId, paymentId, quantity } = req.body;

        const createObj = { email, amount, status, nftId, paymentId, quantity };

        const storeData = await CirclePayment.create(createObj);

        res.status(200).json({
            message: "Data saved successfully!",
        });
    } catch (err) {
        logger.info("save circle pay ", err);
        res.status(400).json({
            error: "Error ocurred while saving circle pay.",
        });
    }
};

const createPaymentAAA = async (req, res) => {
    try {
        const {
            userId,
            nftId,
            successUrl,
            cancleUrl,
            quantity,
            currency,
            promoCode,
        } = req.body;

        const buyNft = await Nft.presalenfts.findOne({ _id: nftId });
        const user = await models.users.findOne({ _id: userId });
        var promoDiv = 0;
        if (promoCode) {
            logger.info(promoCode, "promo");
            const promo = await PromoCode.findOne({ promoCode: promoCode });
            logger.info(promo);
            promoDiv = promo.percentDiscount;
        }

        logger.info(quantity, "quantity");

        var nftAmount =
            parseFloat(buyNft.price / 10 ** 6) * quantity * (100 - promoDiv);
        nftAmount = Math.round(nftAmount);
        logger.info("Price ", nftAmount);

        if (nftAmount < 0.001) {
            return res.status(400).json({
                error: "Price is less than 0.1$",
            });
        }
        var bodyData = qs.stringify({
            client_id: process.env.CLIENTID_AAA,
            client_secret: process.env.SECRETID_AAA,
            grant_type: "client_credentials",
        });
        var config = {
            method: "post",
            url: tokenGen,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: bodyData,
        };

        await axios(config)
            .then(async function (response) {
                logger.info(response.data);
                const orderId = uuid();
                var dataPay = JSON.stringify({
                    type: "triplea",
                    merchant_key: process.env.MERCHANT_KEY_AAA,
                    order_currency: currency,
                    order_amount: nftAmount,
                    notify_email: user.email,
                    notify_url: `https://2bec-2401-4900-1c1b-e42a-4044-3c41-e242-43eb.ngrok.io/payment/triplea-webhook-payment`,
                    notify_secret: "Cf9mx4nAvRuy5vwBY2FCtaKr",
                    notify_txs: true,
                    payer_id: orderId,
                    payer_name: user.username,
                    payer_email: user.email,
                    payer_phone: "+6591234567",
                    payer_address: "1 Parliament Place, Singapore 178880",
                    payer_poi:
                        "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
                    success_url: successUrl,
                    cancel_url: cancleUrl,
                    sandbox: true,
                    cart: {
                        items: [
                            {
                                sku: buyNft.name,
                                label: "Chiky Chik",
                                quantity: 1,
                                amount: nftAmount,
                            },
                        ],
                        shipping_cost: 0,
                        shipping_discount: 0,
                        tax_cost: 0,
                    },
                    webhook_data: {
                        order_id: orderId,
                        quantity: quantity,
                        userId: userId,
                        nftId: nftId,
                    },
                });
                var config = {
                    method: "post",
                    url: reqPayment,
                    headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                        "Content-Type": "application/json",
                    },
                    data: dataPay,
                };

                logger.info(dataPay, "239");
                axios(config)
                    .then(function (response) {
                        logger.info("A ", JSON.stringify(response.data));

                        res.status(200).json(response.data);
                    })
                    .catch(function (error) {
                        logger.info(error.response, "247");
                    });
            })
            .catch((ecr) => {
                res.status(400).json({
                    error: "Some error...",
                });
            });
    } catch (err) {
        res.status(400).json({
            error: "Some error ocurred",
        });
    }
};

//coinbase payment

const { Charge } = resources;
Client.init(process.env.COINBASE_TOKEN);

const coinbasePayment = async (req, res) => {
    const { chikId, email, userId, quantity, promoCode } = req.params;
    if (!email) {
        return res.status(404).json({
            err: "USER NOT FOUND",
        });
    }

    try {
        const buyNft = await Nft.presalenfts.findOne({ _id: chikId });
        logger.info(buyNft);
        if (!buyNft) {
            return res.status(404).json({
                err: "NFT not found!",
            });
        }
        var promoDiv = 0;
        logger.info(promoCode, "promo", !promoCode);
        if (promoCode) {
            logger.info(promoCode, "promo");
            const promo = await PromoCode.findOne({ promoCode: promoCode });
            logger.info(promo);
            promoDiv = promo.percentDiscount;
        }
        const nftAmount =
            parseFloat(buyNft?.price / 10 ** 6) *
            quantity *
            ((100 - promoDiv) / 100);
        logger.info("CHARGE DATA ", buyNft?.price / 10 ** 6);

        const chargeData = {
            name: buyNft.name,
            description: buyNft.description.substring(0, 199),
            local_price: {
                amount: nftAmount,
                currency: "USD",
            },
            pricing_type: "fixed_price",
            logo_url: buyNft.cloudinaryUrl,
            metadata: {
                customer_id: userId,
                customer_email: email,
                nftId: chikId,
                quantity: quantity,
            },
            redirect_url: `${process.env.DOMAIN}/profile`,
            cancel_url: `${process.env.DOMAIN}/chik/${chikId}?status=payment-failed-canceled`,
        };

        const charge = await Charge.create(chargeData);
        await createActivity(userId, nftAmount, false, "Coinbase");
        // logger.info(charge);
        // for email
        // sendPaymentConfirmation(emailId, )

        res.send(charge);
    } catch (error) {
        logger.info(error);
        res.status(404).json({
            error: "Data not found",
        });
    }
};

const handleCoinbasePayment = async (req, res) => {
    const rawBody = req.rawBody;
    logger.info("req body ", rawBody);
    const signature = req.headers["x-cc-webhook-signature"];
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;
    let event;

    try {
        event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
        logger.info("Event ", event);

        if (event.type === "charge:pending") {
            // received order
            // user paid, but transaction not confirm on blockchain yet

            logger.info("pending payment", event);
            return res.json({
                status: "Pending",
            });
        }

        if (event.type === "charge:confirmed") {
            // fulfill order
            // charge confirmed
            logger.info("charge confirmed", event.data);
            //save in presale bought nft added to user account
            logger.info("TEST ", {
                nftIdOwned: event.data.metadata.nftId,
                owner: event.data.metadata.customer_id,
                nft: ObjectId(event.data.metadata.nftId),
            });
            const createPresale = await PresaleBoughtNft.create({
                nftIdOwned: event.data.metadata.nftId,
                owner: event.data.metadata.customer_id,
                nft: ObjectId(event.data.metadata.nftId),
                quantity: event.data.metadata.quantity,
            });

            const coinbaseRecord = await CoinbasePayment.create({
                payId: event.data.payId,
                code: event.data.code,
                amount: event.data.pricing.local.amount,
                currency: event.data.pricing.local.currency,
                chickId: event.data.metadata.nftId,
                owner: event.data.metadata.customer_id,
                nft: event.data.metadata.nftId,
                quantity: event.data.metadata.quantity,
            });

            const userInfo = await models.users.find({
                _id: event.data.metadata.customer_id,
            });
            const getMyreferral = await models.users.find({
                referralCode: userInfo[0].refereeCode,
            });
            logger.info("GET MY REFERRAL ", getMyreferral[0]._id);
            if (userInfo && userInfo[0].refereeCode != "") {
                const bought = await PresaleBoughtNft.findOne({
                    _id: createPresale._id,
                });
                const setting = await referralModel.appsetting.findOne({});
                logger.info("bought ", bought);
                let referralIncome =
                    ((bought.amountSpent * bought.quantity) / 100) *
                    setting.referralPercent;
                const addMyIncome = await new referralModel.referralIncome({
                    userId: getMyreferral[0]._id,
                    amount: referralIncome,
                    nftId: event.data.metadata.nftId,
                    recievedFrom: event.data.metadata.customer_id,
                });
                await addMyIncome.save();
            }

            await createActivity(
                owner,
                event.data.pricing.local.amount,
                event.data.metadata.nftId,
                "Coinbase"
            );
            //create payment schema

            return res.json({
                status: "confirmed",
            });
        }

        if (event.type === "charge:failed") {
            // cancel order
            // charge failed or expired
            logger.info("charge failed sdfdsf", event.data);
            return res.json({
                status: "failed",
            });
        }

        res.send(`success ${event.id}`);
    } catch (error) {
        logger.info("err 00", error);
        res.status(400).send("failure");
    }
};

const coinbaseSuccess = async (req, res) => {
    res.send("success payment");
};
const coinbaseFail = async (req, res) => {
    res.send("cancel payment");
};
const sendPaymentEmail = async (req, res) => {
    try {
        logger.info(req.body.email);
        await sendPaymentConfirmation(req.body);
        res.status(200).json({
            status: "Email sent",
        });
    } catch (err) {
        logger.info("error", err);
        res.status(400).send("failure to send email");
    }
};

const tripleAWebhook = async (req, res) => {
    const sig = req.headers["triplea-signature"];
    const {
        webhook_data,
        event,
        type,
        payment_reference,
        crypto_currency,
        crypto_address,
        crypto_amount,
        order_currency,
        order_amount,
        exchange_rate,
        status,
        status_date,
        receive_amount,
        payment_tier,
        payment_currency,
        payment_amount,
        payment_crypto_amount,
    } = req.body;

    let timestamp, signature;
    for (let sig_part of sig.split(",")) {
        let [key, value] = sig_part.split("=");

        switch (key) {
            case "t":
                timestamp = value;
                break;
            case "v1":
                signature = value;
                break;
        }
    }
    const secret = "Cf9mx4nAvRuy5vwBY2FCtaKr!@#";
    // calculate signature
    let check_signature = crypto
        .createHmac("sha256", secret)
        .update(`${timestamp}.${req.body}`)
        .digest("hex");

    // current timestamp
    let curr_timestamp = Math.round(new Date().getTime() / 1000);
    logger.info("___________________________ WORKING HOOOK 509");
    if (
        signature === check_signature // verify signature
        // &&  Math.abs(curr_timestamp - timestamp) <= 300 // timestamp within tolerance
    ) {
        // signature validates ... do stuff
        logger.info("___________________________ WORKING HOOOK");

        if (status == "good") {
            const createPresale = await PresaleBoughtNft.create({
                nftIdOwned: webhook_data.nftId,
                owner: webhook_data.userId,
                nft: ObjectId(webhook_data.nftId),
                quantity: webhook_data.quantity,
            });

            const tripleaRecord = await TripleaPayment.create({
                event,
                type,
                payment_reference,
                crypto_currency,
                crypto_address,
                crypto_amount,
                order_currency,
                order_amount,
                exchange_rate,
                status,
                status_date,
                receive_amount,
                payment_tier,
                payment_currency,
                payment_amount,
                payment_crypto_amount,
                orderId: webhook_data.orderId,
            });

            const userInfo = await models.users.find({
                _id: webhook_data.userId,
            });
            const getMyreferral = await models.users.find({
                referralCode: userInfo[0].refereeCode,
            });
            logger.info("GET MY REFERRAL ", getMyreferral[0]._id);
            if (userInfo && userInfo[0].refereeCode != "") {
                const bought = await PresaleBoughtNft.findOne({
                    _id: createPresale._id,
                });
                const setting = await referralModel.appsetting.findOne({});
                logger.info("bought ", bought);
                let referralIncome =
                    ((bought.amountSpent * bought.quantity) / 100) *
                    setting.referralPercent;
                const addMyIncome = await new referralModel.referralIncome({
                    userId: getMyreferral[0]._id,
                    amount: referralIncome,
                    nftId: webhook_data.nftId,
                    recievedFrom: webhook_data.userId,
                });

                await addMyIncome.save();
            }

            await createActivity(
                owner,
                event.data.pricing.local.amount,
                event.data.metadata.nftId,
                "TripleA"
            );
            return res.status(200).end();
        } else {
            return res.status(400).end();
        }
    }
};

const initiateLaunchpadPayment = async (req, res) => {
    try {
        let { amount, paymentMethod } = req.body;

        const createData = await LaunchpadPayment.create({
            userId: req.user.userId,
            amountCommited: amount,
            paymentMethod: paymentMethod,
            paymentStatus: "Initiated",
        });

        res.status(200).json({
            msg: "Success! Payment initiated.",
            payment: createData,
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "500: Internal Server Error.",
        });
    }
};

const errorLaunchpadPayment = async (req, res) => {
    try {
        let { id, error, code } = req.body;

        const createData = await LaunchpadPayment.updateOne(
            { _id: ObjectId(id) },
            {
                userId: req.user.userId,
                paymentStatus: "Failed",
                code: code,
                error: error,
            }
        );

        res.status(200).json({
            msg: "Error! Payment failed.",
            payment: createData,
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "500: Internal Server Error.",
        });
    }
};

const makeLaunchpadPayment = async (req, res) => {
    try {
        let { amount, transactionHash, id, email } = req.body;
        logger.info(req.user);

        const findFirst = await LaunchpadPayment.findOne({
            _id: id,
        });
        console.log(findFirst);
        if (findFirst?.paymentStatus == "Completed") {
            return res.status(400).json({
                err: "Payment Already Updated!",
            });
        }

        const createData = await LaunchpadPayment.updateOne(
            { _id: ObjectId(id) },
            {
                paymentStatus: "Completed",
                paymentId: transactionHash,
            }
        );

        const findLaunchpad = await LaunchpadAmount.findOne({
            userId: req.user.userId.toString(),
        });
        if (!findLaunchpad) {
            logger.info("not found", findLaunchpad);
            const createAmount = await LaunchpadAmount.create({
                userId: req.user.userId,
                amountCommited: amount,
            });
        } else {
            findLaunchpad.amountCommited =
                Number(findLaunchpad.amountCommited) + Number(amount);
            logger.info("found --0", findLaunchpad);
            await findLaunchpad.save();
        }
        await sendPaymentConfirmation({
            email: email,
            quantity: 1,
            amount,
        });

        res.status(200).json({
            msg: "Success! Payment confirmed.",
        });
    } catch (err) {
        logger.info(err);
        console.log(err);
        res.status(500).json({
            err: "500: Internal Server Error.",
        });
    }
};

const coinbaseLaunchpadPayment = async (req, res) => {
    try {
        const { amount } = req.body;

        const nftAmount = amount;
        const uniqueId = uuid();
        const chargeData = {
            name: "Chikey Chik",
            description: "The world’s first fully customizable end-to-end NFT",
            local_price: {
                amount: nftAmount,
                currency: "USD",
            },
            pricing_type: "fixed_price",
            logo_url:
                "https://gamepay.sg/static/media/banner-kv.804e1dab7212846653e0.png",
            metadata: {
                userId: req.user.userId,
                customer_email: req.body.email,
                amount: amount,
                uniqueId: uniqueId,
            },
            redirect_url: `${process.env.DOMAIN}/profile?pay-status=paysuccess`,
            cancel_url: `${process.env.DOMAIN}/launchpad?status=payment-failed-canceled`,
        };

        logger.info("CHARGE DATA ", chargeData);

        const charge = await Charge.create(chargeData);

        await createActivity(
            req.user.userId,
            Number(nftAmount),
            false,
            "Coinbase",
            uniqueId
        );

        logger.info("CHARGE ", charge);

        res.send(charge);
    } catch (error) {
        logger.info(error);
        res.status(404).json({
            error: "Data not found",
        });
    }
};
const handleLaunchpadHook = async (req, res) => {
    const rawBody = req.rawBody;
    logger.info("req body ", rawBody);
    const signature = req.headers["x-cc-webhook-signature"];
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;
    let event;

    try {
        event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);

        if (event.type === "charge:pending") {
            // received order
            // user paid, but transaction not confirm on blockchain yet
            const findExists = await LaunchpadPayment.findOne({
                paymentId: event.data.id,
            });

            if (!findExists) {
                logger.info("-----CREATING FAILED 726");
                const createData = await LaunchpadPayment.create({
                    userId: event.data.metadata.userId,
                    amountCommited: event.data.metadata.amount,
                    paymentMethod: "Coinbase",
                    paymentStatus: "failed",
                    paymentId: event.data.id,
                });
            }
            return res.json({
                status: "Pending",
            });
        }

        if (event.type === "charge:confirmed") {
            // fulfill order
            // charge confirmed
            logger.info("-----charge confirmed", event.data);
            //save in presale bought nft added to user account

            //create payment schema
            const findExists = await LaunchpadPayment.findOne({
                paymentId: event.data.id,
            });
            if (!findExists) {
                logger.info("-----CREATING Success 751");
                const createData = await LaunchpadPayment.create({
                    userId: event.data.metadata.userId,
                    amountCommited: event.data.metadata.amount,
                    paymentMethod: "Coinbase",
                    paymentStatus: "confirmed",
                    paymentId: event.data.id,
                });
            } else {
                logger.info("-----updating Success 761");
                await LaunchpadPayment.updateOne(
                    {
                        paymentId: event.data.id,
                    },
                    {
                        userId: event.data.metadata.userId,
                        amountCommited: event.data.metadata.amount,
                        paymentMethod: "Coinbase",
                        paymentStatus: "confirmed",
                        paymentId: event.data.id,
                    }
                );
            }
            const findLaunchpad = await LaunchpadAmount.findOne({
                userId: event.data.metadata.userId,
            });
            if (!findLaunchpad) {
                logger.info("----778-not found", findLaunchpad);
                const createAmount = await LaunchpadAmount.create({
                    userId: event.data.metadata.userId,
                    amountCommited: event.data.metadata.amount,
                });
            } else {
                logger.info("-----CREATING FAILED 784");
                findLaunchpad.amountCommited =
                    Number(findLaunchpad.amountCommited) +
                    Number(event.data.metadata.amount);
                logger.info("found --0", findLaunchpad);
                await findLaunchpad.save();
            }
            await sendPaymentConfirmation({
                email: event.data.metadata.customer_email,
                quantity: 1,
                amount: event.data.metadata.amount,
            });
            logger.info(
                "looooooook",
                event.data.metadata.userId,
                event.data.metadata.amount
            );
            await updateActivity(
                event.data.metadata.userId,
                event.data.metadata.uniqueId,
                `You have commited ${event.data.metadata.amount} USDT amount using Coinbase.`
            );

            return res.json({
                status: "confirmed",
            });
        }

        if (event.type === "charge:failed") {
            // cancel order
            // charge failed or expired
            const findExists = await LaunchpadPayment.find({
                paymentId: event.data.id,
            });

            if (!findExists) {
                const createData = await LaunchpadPayment.create({
                    userId: event.data.metadata.userId,
                    amountCommited: event.data.metadata.amount,
                    paymentMethod: "Coinbase",
                    paymentStatus: "failed",
                    paymentId: event.data.id,
                });
            } else {
                await LaunchpadPayment.updateOne(
                    {
                        paymentId: event.data.id,
                    },
                    {
                        userId: event.data.metadata.userId,
                        amountCommited: event.data.metadata.amount,
                        paymentMethod: "Coinbase",
                        paymentStatus: "confirmed",
                        paymentId: event.data.id,
                    }
                );
            }
            await updateActivity(
                event.data.metadata.userId,
                event.data.metadata.uniqueId,
                `You have failed amount of ${event.data.metadata.amount} USDT using Coinbase.`
            );
            return res.json({
                status: "failed",
            });
        }

        res.send(`success ${event.id}`);
    } catch (error) {
        logger.info("err 00", error);
        res.status(400).send("failure");
    }
};
const launchpadPaymentAAA = async (req, res) => {
    try {
        const { successUrl, cancleUrl, email, amount } = req.body;

        var nftAmount = amount;
        nftAmount = Math.round(nftAmount);
        if (nftAmount < 0.01) {
            return res.status(400).json({
                error: "Price is less than 0.1$",
            });
        }
        var bodyData = qs.stringify({
            client_id: process.env.CLIENTID_AAA,
            client_secret: process.env.SECRETID_AAA,
            grant_type: "client_credentials",
        });
        var config = {
            method: "post",
            url: tokenGen,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: bodyData,
        };

        await axios(config)
            .then(async function (response) {
                logger.info("response {}", response);
                const orderId = uuid();
                var dataPay = JSON.stringify({
                    type: "triplea",
                    merchant_key: `${process.env.AAA_MERCHANT_KEY}`,
                    order_currency: "USD",
                    order_amount: nftAmount,
                    payer_id: orderId,
                    payer_name: email,
                    payer_email: email,
                    success_url: successUrl,
                    cancel_url: cancleUrl,
                    notify_url: `${process.env.APP_BACKEND_URL}/payment/tripleAWebhookLaunchpad`,
                    notify_secret: `${process.env.AAA_CLIENT_NOTIFYSECRET}`,
                    notify_txs: true,
                    webhook_data: {
                        order_id: orderId,
                        userId: req.user.userId,
                        email: email,
                    },
                    cart: {
                        items: [
                            {
                                amount: nftAmount,
                                quantity: 1,
                                label: "ChikyChik Launchpad",
                                sku: "Chiky launchpad sale",
                            },
                        ],
                        shipping_cost: 0,
                        shipping_discount: 0,
                        tax_cost: 0,
                    },
                    sandbox: `${process.env.AAA_SANDBOX}`,
                });

                /*JSON.stringify(
                    {
                    type: 'triplea',
                    merchant_key: 'mkey-cl1d9k0uc0cw4cmthcuilh31a', //process.env.MERCHANT_KEY_AAA,
                    order_currency: 'USD',
                    order_amount: nftAmount,
                    //notify_email: email,
                    payer_id: orderId,
                    payer_name: email,
                    payer_email: email,
                    //payer_phone: "+6591234567",
                    //payer_address: "1 Parliament Place, Singapore 178880",
                    //payer_poi:
                    //    "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
                    success_url: successUrl,
                    cancel_url: cancleUrl,
                    notify_url: `${process.env.APP_BACKEND_URL}/payment/tripleAWebhookLaunchpad`,
                    notify_secret: 'Cf9mx4nAvRuy5vwBY2FCtaKr',
                    notify_txs: true,
                    webhook_data: {
                        order_id: 1234,//orderId//,
 //                       userId: req.user.userId
                    },
                    cart: {
                        items: [
                            {
                                amount: 150,//nftAmount,
                                quantity: 1,
                                label: "Chiky Chik",
                                sku: "Chiky Chik" 
                            }
                        ],
                        shipping_cost: 0,
                        shipping_discount: 0,
                        tax_cost: 0
                    },
                    sandbox: true,
                }
                );
                */
                var config = {
                    method: "post",
                    url: reqPayment,
                    headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                        "Content-Type": "application/json",
                    },
                    data: dataPay,
                };

                logger.info("config {}", config, " ", "239");
                axios(config)
                    .then(async function (response) {
                        logger.info("A ", JSON.stringify(response.data));
                        await createActivity(
                            req.user.userId,
                            nftAmount,
                            false,
                            "TripleA",
                            orderId
                        );

                        res.status(200).json(response.data);
                    })
                    .catch(function (error) {
                        logger.info(error.response, dataPay, "247");
                        return res
                            .status(400)
                            .json({ err: "Some error ocurred!" });
                    });

                /*const res = await axios.post(reqPayment, dataPay, { headers });
                    logger.info ("res {}", res);*/
            })
            .catch((ecr) => {
                logger.info(ecr);
                res.status(400).json({
                    error: "Some error...",
                });
            });
    } catch (err) {
        logger.info(err);
        res.status(400).json({
            error: "Some error ocurred",
        });
    }
};
const tripleAWebhookLaunchpad = async (req, res) => {
    const sig = req.headers["triplea-signature"];
    const {
        webhook_data,
        event,
        type,
        payment_reference,
        crypto_currency,
        crypto_address,
        crypto_amount,
        order_currency,
        order_amount,
        exchange_rate,
        status,
        status_date,
        receive_amount,
        payment_tier,
        payment_currency,
        payment_amount,
        payment_crypto_amount,
    } = req.body;
    let timestamp, signature;
    for (let sig_part of sig.split(",")) {
        let [key, value] = sig_part.split("=");

        switch (key) {
            case "t":
                timestamp = value;
                break;
            case "v1":
                signature = value;
                break;
        }
    }
    const secret = "Cf9mx4nAvRuy5vwBY2FCtaKr";
    // calculate signature
    let check_signature = crypto
        .createHmac("sha256", secret)
        .update(`${timestamp}.${req.body}`)
        .digest("hex");

    // current timestamp
    let curr_timestamp = Math.round(new Date().getTime() / 1000);

    logger.info(
        signature,
        "___________________________ WORKING HOOOK 904",
        check_signature
    );
    logger.info("905 ", signature === check_signature);
    logger.info("Status", status);
    logger.info("BODY ", req.body);
    if (signature) {
        // signature validates ... do stuff
        logger.info("___________________________ WORKING HOOOK");
        const alreadyUpdated = await LaunchpadPayment.findOne({
            paymentId: req.body.txs[0].txid,
        });

        logger.info(alreadyUpdated, status, "alreadyUpdated");

        if (status == "good" && alreadyUpdated == null) {
            const findExists = await LaunchpadPayment.findOne({
                paymentId: req.body.txs[0].txid,
            });
            logger.info("FIND ", findExists);
            if (!findExists) {
                logger.info("AA ", {
                    userId: req.body.webhook_data.userId,
                    amountCommited: req.body.txs[0].receive_amount,
                    paymentMethod: "Triplea",
                    paymentStatus: "confirmed",
                    paymentId: req.body.txs[0].txid,
                    metadata: JSON.stringify(req.body),
                });
                const createData = await LaunchpadPayment.create({
                    userId: req.body.webhook_data.userId,
                    amountCommited: req.body.txs[0].receive_amount,
                    paymentMethod: "Triplea",
                    paymentStatus: "confirmed",
                    paymentId: req.body.txs[0].txid,
                    metadata: JSON.stringify(req.body),
                });
            }
            const findLaunchpad = await LaunchpadAmount.findOne({
                userId: req.body.webhook_data.userId,
            });
            if (!findLaunchpad) {
                logger.info("not found", findLaunchpad);
                const createAmount = await LaunchpadAmount.create({
                    userId: req.body.webhook_data.userId,
                    amountCommited: req.body.txs[0].receive_amount,
                });
            } else {
                findLaunchpad.amountCommited =
                    Number(findLaunchpad.amountCommited) +
                    Number(req.body.txs[0].receive_amount);
                logger.info("found --0", findLaunchpad);
                await findLaunchpad.save();
            }
            await sendPaymentConfirmation({
                email: req.body.webhook_data.email,
                quantity: 1,
                amount: req.body.txs[0].receive_amount,
            });
            // await createActivity(
            //     req.body.webhook_data.userId,
            //     req.body.txs[0].receive_amount,
            //     true,
            //     "TripleA"
            // );
            await updateActivity(
                req.body.webhook_data.userId,
                req.body.webhook_data.order_id,
                `You have commited ${req.body.txs[0].receive_amount} USDT amount using TripleA.`
            );

            return res.status(200).end();
        } else {
            return res.status(400).end();
        }
    }
};
const getCommitedAmount = async (req, res) => {
    try {
        if (!req.user.userId) {
            return res.status(404).json({
                err: "Error! user not found.",
            });
        }
        const findData = await LaunchpadAmount.findOne({
            userId: req.user.userId,
        });
        logger.info("findData   ", findData);

        res.status(200).json({
            data: findData,
            status: 200,
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "500: Internal server error!",
        });
    }
};

const getAllCommitedAmount = async (req, res) => {
    try {
        if (!req.user.userId) {
            return res.status(404).json({
                err: "Error! user not found.",
            });
        }
        const findData = await LaunchpadAmount.find({
            userId: req.user.userId,
        });
        logger.info("findData   ", findData);

        res.status(200).json({
            data: findData,
            status: 200,
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "500: Internal server error!",
        });
    }
};

const getLaunchpadActivity = async (req, res) => {
    try {
        if (!req.user.userId) {
            return res.status(404).json({
                err: "Error! user is not found.",
            });
        }
        let page = req.query.page - 1;
        let pageSize = req.query.pageSize;
        const currentDate = new Date();
        const fromDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 2,
            0
        );
        let total = await LaunchpadPayment.count({
            userId: req.user.userId,
            updatedAt: {
                $gte: fromDate,
            },
        });
        LaunchpadPayment.find({
            userId: req.user.userId,
            updatedAt: {
                $gte: fromDate,
            },
        })
            // .select("name")
            .sort({ updatedAt: -1 })
            .limit(pageSize)
            .skip(pageSize * page)
            .then((results) => {
                return res.status(200).json({
                    status: "success",
                    total: total,
                    page: page,
                    pageSize: pageSize,
                    data: results,
                });
            })
            .catch((err) => {
                return res.status(500).send(err);
            });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "500: Internal server error!",
        });
    }
};

const createCircleLaunchpadPayment = async (req, res) => {
    try {
        const {
            cardId,
            email,
            network,
            amount,
            status,
            expMonth,
            expYear,
            fingerprint,
            fundingType,
            sessionId,
            cvvEncrpytion,
            keyIdEncrpytion,
            quantity,
            updateId,
            // encryptedData
        } = req.body;
        // const buyNft = await Nft.presalenfts.find({ _id: nftId });
        // logger.info("bb ", buyNft[0].price, quantity);

        const nftAmount = parseFloat(amount);
        const idempotencyKey = uuid();
        if (nftAmount < 0.5) {
            return res.status(400).json({
                err: "Price is less than 0.5$",
            });
        }
        logger.info("NFT AMOUNT", nftAmount.toFixed(2).toString());

        logger.info(
            "DATA ",
            {
                metadata: {
                    email: email,
                    sessionId: sessionId,
                    ipAddress: "172.33.222.1",
                },
                amount: {
                    amount: nftAmount.toFixed(2).toString(),
                    currency: "USD",
                },
                autoCapture: true,
                source: { id: cardId, type: "card" },
                idempotencyKey: idempotencyKey,
                verification: "cvv",
                encryptedData: cvvEncrpytion.encryptedMessage,
                keyId: "key1",
                // verificationSuccessUrl: "http://localhost:3000/payment_success",
                // verificationFailureUrl: "http://localhost:3000/payment_failure",
            },
            "SDF"
        );
        await createActivity(
            req.user.userId,
            nftAmount,
            false,
            "Circle",
            idempotencyKey
        );
        console.log(
            req.user.userId,
            nftAmount,
            idempotencyKey,
            " sdfdsfds dsfsdfCircle"
        );
        // sdk.auth(process.env.CIRCLE_TOKEN);
        axios({
            url: `${process.env.CIRCLE_API_URL}/v1/payments`,
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.CIRCLE_TOKEN}`,
                "Content-Type": "application/json",
            },
            data: {
                metadata: {
                    email: email,
                    sessionId: sessionId,
                    ipAddress: "127.38.233.23",
                    userId: req.user.userId,
                },
                amount: {
                    amount: nftAmount.toFixed(2).toString(),
                    currency: "USD",
                },
                autoCapture: true,
                source: { id: cardId, type: "card" },
                idempotencyKey: idempotencyKey,
                encryptedData: cvvEncrpytion.encryptedMessage,
                keyId: keyIdEncrpytion,
                verification: "three_d_secure",
                verificationSuccessUrl: `${process.env.APP_FRONTEND_URL
                    }/profile?paymentCircle=${"payment-success"}&&paymentVerification=${idempotencyKey}&&paymentUpdate=${updateId}&&amount=${nftAmount.toFixed(
                        2
                    )}`,
                verificationFailureUrl: `${process.env.APP_FRONTEND_URL
                    }/profile?paymentCircle=${"payment-failed"}`,
            },
        })
            .then((ares) => {
                logger.info("Circle res", ares);
                console.log("Circle res", ares);
                res.status(200).json({
                    message: "Success",
                    res: ares.data,
                });
            })
            .catch((err) => {
                logger.info("Circle err ", err.response.data);
                console.log("Circle err ", err.response.data);
                res.status(400).json({ error: "a.Some error ocurred" });
            });
    } catch (err) {
        logger.info(err);
        res.status(400).json({
            error: "c.Some error ocurred",
        });
    }
};

const getKeyForCircleLaunchpadPayment = async (req, res) => {
    try {
        axios({
            url: `${process.env.CIRCLE_API_URL}/v1/encryption/public`,
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.CIRCLE_TOKEN}`,
                "Content-Type": "application/json",
            }
        }).then((data) => {
            logger.info('Received data from circle payment encryption api');
            logger.info(data);
            res.status(200).json({
                message: "Success",
                res: data,
            });
        }).catch((err) => {
                logger.error('Error occured while fetching data from circle api - {}' , err);
                logger.error(err)
                res.status(500).json({ error: "a.Some error ocurred" });
            });
    } catch (err) {
        logger.error(err);
        res.status(500).json({
            error: "Error occurred while fetching encryption data from circle api",
        });
    }
};

const getCardDetailsCircleLaunchpadPayment = async (req, res) => {
    try {
        const { payloadData } = req.body;
        axios({
            url: `${process.env.CIRCLE_API_URL}/v1/cards`,
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.CIRCLE_TOKEN}`,
                "Content-Type": "application/json",
            },
            data: payloadData
        }).then((data) => {
            logger.info('Received data from circle payment cards api');
            logger.info(data);
            res.status(200).json({
                message: "Success",
                res: data,
            });
        }).catch((err) => {
            logger.info(err);
                logger.error('Error occured while fetching data from circle payment cards api - {}', err);
                res.status(500).json({ error: "Internal Server Error" });
            });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            error: "Error occurred while fetching card details from circle cards api",
        });
    }
};


const paymentsCircleLaunchpadPayment = async (req, res) => {
    try {
        const { payloadData } = req.body;
        axios({
            url: `${process.env.CIRCLE_API_URL}/v1/payments/${paymentId}`,
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.CIRCLE_TOKEN}`,
            }
        }).then((data) => {
            logger.info('Received data from circle payment payments api');
            logger.info(data);
            res.status(200).json({
                message: "Success",
                res: data,
            });
        }).catch((err) => {
            logger.error(err);
                logger.error('Error occured while fetching data from circle payment payments api - {}' , err);
                res.status(500).json({ error: "Internal Server Error" });
            });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            error: "Error occurred while fetching payment details from circle payments api",
        });
    }
};


const circleSNSLaunchpad = async (request, response) => {
    if (request.method === "HEAD") {
        response.writeHead(200, {
            "Content-Type": "text/html",
        });
        response.end(`HEAD request for ${request.url}`);
        console.log("Received HEAD request");
        return;
    }
    if (request.method === "POST") {
        let body = "";
        request.on("data", (data) => {
            body += data;
        });
        request.on("end", () => {
            console.log(`POST request, \nPath: ${request.url}`);
            console.log("Headers: ");
            console.dir(request.headers);
            console.log(`Body: ${body}`);

            response.writeHead(200, {
                "Content-Type": "text/html",
            });
            response.end(`POST request for ${request.url}`);
            handleBody(body);
        });
    } else {
        const msg = `${request.method} method not supported`;
        console.log(msg);
        response.writeHead(400, {
            "Content-Type": "text/html",
        });
        response.end(msg);
        return;
    }

    const handleBody = async (body) => {
        const envelope = JSON.parse(body);
        validator.validate(envelope, async (err) => {
            if (err) {
                console.error(err);
            } else {
                switch (envelope.Type) {
                    case "SubscriptionConfirmation": {
                        if (!circleArn.test(envelope.TopicArn)) {
                            console.error(
                                `\nUnable to confirm the subscription as the topic arn is not expected ${envelope.TopicArn}. Valid topic arn must match ${circleArn}.`
                            );
                            break;
                        }
                        r(envelope.SubscribeURL, (err) => {
                            if (err) {
                                console.error(
                                    "Subscription NOT confirmed.",
                                    err
                                );
                            } else {
                                console.log("Subscription confirmed.");
                            }
                        });
                        break;
                    }
                    case "Notification": {
                        console.log(`Received message ${envelope.Message}`);
                        // enter code here  to verify payment
                        let event = envelope.Message;
                        if (
                            (event.status == "confirmed" || event.status == "paid") &&
                            event?.metadata.email
                        ) {
                            logger.info("-----charge confirmed", event);
                            //save in presale bought nft added to user account
                            const findUser = await models.users.findOne({
                                email: event.metadata.email,
                            });
                            //create payment schema
                            const findExists = await LaunchpadPayment.findOne({
                                paymentId: event.payment.id,
                            });
                            if (!findExists) {
                                logger.info("-----CREATING Success 751");
                                const createData =
                                    await LaunchpadPayment.create({
                                        userId: findUser._id,
                                        amountCommited: event.amount.amount,
                                        paymentMethod: "Circle",
                                        paymentStatus: "confirmed",
                                        paymentId: event.payment.id,
                                    });
                            } else {
                                logger.info("-----updating Success 761");
                                await LaunchpadPayment.updateOne(
                                    {
                                        paymentId: event.payment.id,
                                    },
                                    {
                                        userId: findUser._id,
                                        amountCommited: amount.amount,
                                        paymentMethod: "Circle",
                                        paymentStatus: "confirmed",
                                        paymentId: event.payment.id,
                                        metadata: JSON.stringify(event),
                                    }
                                );
                            }
                            const findLaunchpad = await LaunchpadAmount.findOne(
                                {
                                    userId: findUser._id,
                                }
                            );
                            if (!findLaunchpad) {
                                logger.info("----778-not found", findLaunchpad);
                                const createAmount =
                                    await LaunchpadAmount.create({
                                        userId: findUser._id,
                                        amountCommited: event.amount.amount,
                                    });
                            } else {
                                logger.info("-----CREATING FAILED 784");
                                findLaunchpad.amountCommited =
                                    Number(findLaunchpad.amountCommited) +
                                    Number(event.amount.amount);
                                logger.info("found --0", findLaunchpad);
                                await findLaunchpad.save();
                            }
                            await sendPaymentConfirmation({
                                email: event.metadata.email,
                                quantity: 1,
                                amount: event.amount.amount,
                            });

                            await updateActivity(
                                findUser._id,
                                event.payment.id,
                                `You have commited ${event.amount.amount} USDT amount using Coinbase.`
                            );
                        }
                        break;
                    }
                    default: {
                        console.error(
                            `Message of type ${body.Type} not supported`
                        );
                    }
                }
            }
        });
    };
};

module.exports = {
    createPayment,
    coinbasePayment,
    handleCoinbasePayment,
    coinbaseSuccess,
    coinbaseFail,
    createPaymentAAA,
    saveCirclePaymentData,
    sendPaymentEmail,
    tripleAWebhook,
    coinbaseLaunchpadPayment,
    handleLaunchpadHook,
    makeLaunchpadPayment,
    getCommitedAmount,
    launchpadPaymentAAA,
    tripleAWebhookLaunchpad,
    getAllCommitedAmount,
    initiateLaunchpadPayment,
    errorLaunchpadPayment,
    getLaunchpadActivity,
    updateActivity,
    createCircleLaunchpadPayment,
    circleSNSLaunchpad,
    getKeyForCircleLaunchpadPayment,
    getCardDetailsCircleLaunchpadPayment,
    paymentsCircleLaunchpadPayment
};
