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
const {createActivity,updateActivity} = require("../utils/paymentActivity");
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
const {addMyIncomeMetaMask, updatePreSaleNFTDetails} = require('./nft.controller')
const circleArn =
    /^arn:aws:sns:.*:908968368384:(sandbox|prod)_platform-notifications-topic$/;
const validator = new MessageValidator();
const PresaletNftInitiated = require("../models/presaleNftsInitiated");


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
                keyId: keyIdEncrpytion,
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
        console.log("buyNft ", buyNft);
        var promoDiv = 0;
        if (promoCode) {
            logger.info(promoCode, "promo");
            console.log(promoCode, "promo");
            const promo = await PromoCode.findOne({ promoCode: promoCode });
            logger.info(promo);
            console.log(promo);
            promoDiv = promo.percentDiscount;
        }

        logger.info(quantity, "quantity");
        console.log(
            quantity,
            "quantity price",
            buyNft.price,
            " promoDiv ",
            promoDiv
        );
        var nftAmount =
            parseFloat(buyNft.price) * quantity * ((100 - promoDiv) / 100);
        nftAmount = Math.round(nftAmount);

        const uniqueId = uuid();

        await createActivity(userId, nftAmount, false, "TripleA", uniqueId);
        logger.info("Price ", nftAmount);
        console.log(nftAmount, " nftAmount");
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
                console.log(response.data, "1st api");

                const orderId = uuid();
                var dataPay = JSON.stringify({
                    type: "widget",
                    merchant_key: process.env.AAA_MERCHANT_KEY,
                    order_currency: currency,
                    order_amount: nftAmount,
                    notify_email: "hello@gamepay.sg",
                    notify_url: `${process.env.APP_BACKEND_URL}/payment/triplea-webhook-payment`,
                    notify_secret: `${process.env.AAA_CLIENT_NOTIFYSECRET}`,
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
                    sandbox: process.env.AAA_SANDBOX,
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
                        uniqueId: uniqueId,
                        nftAmount: nftAmount,
                    },
                });
                console.log(dataPay, "datapay");
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
                        console.log("triplea ", response.data);
                        res.status(200).json(response.data);
                    })
                    .catch(function (error) {
                        logger.info(error.response, "247");
                        console.log(error.response.data.errors)
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
    const { chikId, email, userId, quantity} = req.params;
    const promoCode = req.body.promoCode
    console.log(req.body,"promocode")
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
        const nftAmount = parseFloat(buyNft?.price) * quantity * ((100 - promoDiv) / 100);
        logger.info("CHARGE DATA ", buyNft?.price);
        console.log(
            parseFloat(buyNft?.price) * quantity * ((100 - promoDiv) / 100),
            "CHARGE DATA ",
            buyNft?.price
        );
        let uniqueId = uuid();
        const chargeData = {
            name: buyNft.name,
            description: buyNft.description.substring(0, 199),
            local_price: {
                amount: parseFloat(buyNft?.price) * quantity * ((100 - promoDiv) / 100),
                currency: "USD",
            },
            pricing_type: "fixed_price",
            logo_url: buyNft.cloudinaryUrl,
            metadata: {
                userId: userId,
                email: email,
                nftId: chikId,
                quantity: quantity,
                payment_activity: "NFT_PURCHASE",
                uniqueId: uniqueId,
                amount: parseFloat(buyNft?.price) * quantity * ((100 - promoDiv) / 100)
            },

            redirect_url: `${process.env.APP_FRONTEND_URL}/profile`,
            cancel_url: `${process.env.APP_FRONTEND_URL}/chik/${chikId}?status=payment-failed-canceled`,
        };

        const charge = await Charge.create(chargeData);
        await createActivity(userId, nftAmount, false, "Coinbase", uniqueId);


        logger.info("COINBASE CHARGE ", charge);
        console.log("charge ", charge);
        res.send(charge);
    } catch (error) {
        logger.info(error);
        res.status(404).json({
            error: "Data not found",
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
                payment_activity: "LAUNCHPAD",
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
                paymentId: event.data.id
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

            // const userInfo = await models.users.find({
            //     _id: event.data.metadata.customer_id,
            // });

            console.log(event.data.id,"event id")
            const alreadySaved = await PresaleBoughtNft.findOne({paymentId:event.data.id})
            
            console.log(alreadySaved,"alreadySaved")
            if(alreadySaved == null){
                addMyIncomeMetaMask(event.data.metadata.nftId, event.data.metadata.customer_id,createPresale._id)

                await createActivity(
                    owner,
                    event.data.pricing.local.amount,
                    event.data.metadata.nftId,
                    "Coinbase"
                );
            }

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
    console.log("508 line", req.body);

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
    if (signature) {
        // signature validates ... do stuff
        logger.info("___________________________ WORKING HOOOK");

        if (status == "good") {
            console.log(" TRIPLE A RESPONSE status good", req.body);

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
                orderId: webhook_data.order_id,
            });

            const alreadySaved = await PresaleBoughtNft.findOne({paymentId:webhook_data.order_id})

            console.log(alreadySaved,"alreadySaved")

            if(alreadySaved == null){
                const createPresale = await PresaleBoughtNft.create({
                    nftIdOwned: req.body.webhook_data.nftId,
                    owner: req.body.webhook_data.userId,
                    nft: ObjectId(req.body.webhook_data.nftId),
                    quantity: req.body.webhook_data.quantity,
                    amountSpent: (req.body.payment_amount/req.body.webhook_data.quantity).toFixed(4),
                    currency: req.body.payment_currency,
                    paymentId:webhook_data.order_id,
                    paymentMode: "TripleA",
                });

                console.log(req.body.webhook_data.nftId,req.body.webhook_data.userId,createPresale._id,"add my data")

                const findNFT = await Nft.presalenfts.findById(req.body.webhook_data.nftId);
                if (findNFT) {
                    logger.info('Start of Updating itemSold field for presaleNFT using TripleA.');
                    findNFT.itemSold = parseInt(findNFT.itemSold) + parseInt(req.body.webhook_data.quantity);
                    await findNFT.save();
                    logger.info('End of Updating itemSold field for presaleNFT using TripleA.');
                } else {
                    logger.info('Unable to fetch presale NFT from collection using TripleA.');
                }

                addMyIncomeMetaMask(req.body.webhook_data.nftId,req.body.webhook_data.userId,createPresale._id)
    
                await updateActivity(
                    req.body.webhook_data.userId,
                    req.body.webhook_data.uniqueId,
                    `You have completed the payment of ${req.body.payment_amount} USD using TripleA.`
                );

                const userInfo = await models.users.findOne({
                    _id: req.body.webhook_data.userId,
                });
                await sendPaymentConfirmation({
                    email: userInfo.email,
                    quantity: req.body.webhook_data.quantity,
                    amount: req.body.payment_amount,
                });
            }

            return res.status(200).end();
        } else {
            return res.status(400).end();
        }
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
            console.log(" PENDING ", event.data.metadata);
            if (event.data.metadata.payment_activity == "LAUNCHPAD") {
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
            } else if (event.data.metadata.payment_activity == "NFT_PURCHASE") {
                //nft purchase pending status
            }
        }

        if (event.type === "charge:confirmed") {
            // fulfill order
            // charge confirmed
            logger.info("-----charge confirmed", event.data);
            //save in presale bought nft added to user account
            console.log("CONFIRMED ", event.data.metadata,event.data.metadata.payment_activity == "NFT_PURCHASE");
            //create payment schema
            if (event.data.metadata.payment_activity == "LAUNCHPAD") {
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
            } else if (event.data.metadata.payment_activity == "NFT_PURCHASE") {
                //create nft

                console.log("in else if", event ,'786')
                const findCoinbasePay = await CoinbasePayment.findOne({
                    uniqueId: event.data.metadata.uniqueId,
                });
                console.log(findCoinbasePay)
                if (!findCoinbasePay) {
                    const CoinbasePay = await CoinbasePayment.create({
                        payId: event.id,
                        code: event.data.code,
                        amount: (event.data.metadata.amount/event.data.metadata.quantity).toFixed(4),
                        chickId: event.data.metadata.nftId,
                        owner: event.data.metadata.userId,
                        nft: ObjectId(event.data.metadata.nftId),
                        quantity: event.data.metadata.quantity,
                        uniquId: event.data.metadata.uniqueId,
                    });
                    console.log(CoinbasePay,802)
                } else {
                    const updateCoinbasePay = await CoinbasePayment.updateOne(
                        { uniqueId: event.data.metadata.uniqueId },
                        { $set: { status: "Confirmed" } }
                    );
                }
                
                console.log(event.data.metadata.uniqueId,"payment id")
                const alreadySaved = await PresaleBoughtNft.findOne({paymentId:event.data.metadata.uniqueId})

                console.log(alreadySaved,"is null")
                if(alreadySaved == null){
                    console.log( event.data.metadata.nftId,
                        event.data.metadata.userId,
                        ObjectId(event.data.metadata.nftId),
                        event.data.metadata.quantity,
                        event.data.metadata.amount,
                        "Coinbase")
                    const createPresale = await PresaleBoughtNft.create({
                        nftIdOwned: event.data.metadata.nftId,
                        owner: event.data.metadata.userId,
                        nft: ObjectId(event.data.metadata.nftId),
                        quantity: event.data.metadata.quantity,
                        amountSpent: event.data.metadata.amount,
                        currency: "USD",
                        paymentId: event.data.metadata.uniqueId,
                        paymentMode: "Coinbase",
                    });

                    console.log(createPresale,'create presale')
    
                    const userInfo = await models.users.find({
                        _id: event.data.metadata.userId,
                    });

                    console.log(userInfo)

                    console.log(event.data.metadata.nftId,event.data.metadata.userId,createPresale._id,"add to my reward")
    
                    await addMyIncomeMetaMask(event.data.metadata.nftId,event.data.metadata.userId,createPresale._id).then((res)=>{
                        console.log("status")
                       
                    })
    
                    console.log(event.data.metadata.userId,
                        event.data.metadata.uniqueId,
                        event.data.metadata.amount,
                        )
                    await updateActivity(
                        event.data.metadata.userId,
                        event.data.metadata.uniqueId,
                        `You have completed the payment of ${event.data.metadata.amount} USD using Coinbase.`
                    );
                    console.log(userInfo[0].email,
                        event.data.metadata.quantity,
                        event.data.metadata.amount,)

                    await sendPaymentConfirmation({
                        email: userInfo[0].email,
                        quantity: event.data.metadata.quantity,
                        amount: event.data.metadata.amount,
                    });
                }
                
            }
        }

        if (event.type === "charge:failed") {
            // cancel order
            // charge failed or expired
            console.log("FAILED ", event.data.metadata);
            if (event.data.metadata.payment_activity == "LAUNCHPAD") {
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
            } else if (event.data.metadata.payment_activity == "NFT_PURCHASE") {
                //failed status
                await updateActivity(
                    event.data.metadata.userId,
                    event.data.metadata.uniqueId,
                    `You have failed payment for CHIKY #${event.data.metadata.nftId} for ${event.data.metadata.amount} USD using Coinbase.`
                );
            }
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
                    notify_email: "hello@gamepay.sg",
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
            nftId,
            updateId,
            payment_activity,
            promoCode,
            ipAddress
        } = req.body;
        var promoDiv = 0;
        if (promoCode) {
            logger.info(promoCode, "promo");
            console.log(promoCode, "promo");
            const promo = await PromoCode.findOne({ promoCode: promoCode });
            logger.info(promo);
            console.log(promo);
            promoDiv = promo.percentDiscount;
        }

        logger.info(quantity, "quantity");

        var nftAmount =
            parseFloat(amount) * ((100 - promoDiv) / 100);
        nftAmount = Math.round(nftAmount);

        console.log(nftAmount,"amount of nft")

        const idempotencyKey = uuid();
        console.log("Place 1");
        if (nftAmount < 0.5) {
            return res.status(400).json({
                err: "Price is less than 0.5$",
            });
        }
        console.log("Place 2");
        logger.info("NFT AMOUNT", nftAmount.toFixed(2).toString());


        console.log("Place 3");
        await createActivity(
            req.user.userId,
            nftAmount,
            false,
            "Fiat Payment",
            idempotencyKey
        );
        console.log("Place 4");
        console.log(
            req.user.userId,
            nftAmount,
            idempotencyKey,
            " sdfdsfds dsfsdfCircle"
        );
        // sdk.auth(process.env.CIRCLE_TOKEN);
        console.log('IpAddresss - '+ ipAddress);
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
                    ipAddress: ipAddress,
                },
                amount: {
                    amount: nftAmount.toFixed(2).toString(),
                    currency: "USD",
                },
                description:JSON.stringify({
                    payment_activity : payment_activity,
                    userId: req.user.userId,
                    uniqueId: idempotencyKey,
                    nftId:nftId,
                    quantity:quantity,
                    promoCode:promoCode
                }),
                autoCapture: true,
                source: { id: cardId, type: "card" },
                idempotencyKey: idempotencyKey,
                encryptedData: cvvEncrpytion.encryptedMessage,
                keyId: keyIdEncrpytion,
                verification: "three_d_secure",
                verificationSuccessUrl: payment_activity=="NFT_PURCHASE"? 
                `${
                    process.env.APP_FRONTEND_URL
                }/profile?paymentCircle=${"payment-success"}`:
                `${
                    process.env.APP_FRONTEND_URL
                }/profile?paymentCircle=${"payment-success"}&&paymentVerification=${idempotencyKey}&&paymentUpdate=${updateId}&&amount=${nftAmount.toFixed(
                    2
                )}`,
                // verificationSuccessUrl: `https://cicd.gamepay.sg/profile?paymentCircle=${"payment-success"}&&paymentVerification=${idempotencyKey}&&paymentUpdate=${updateId}&&amount=${nftAmount.toFixed(
                //         2
                //     )}`,
                verificationFailureUrl: payment_activity=="NFT_PURCHASE"? 
                `${
                    process.env.APP_FRONTEND_URL
                }/profile?paymentCircle=${"payment-failed"}`:
                `${
                    process.env.APP_FRONTEND_URL
                }/profile?paymentCircle=${"payment-failed"}&&paymentVerification=${idempotencyKey}&&paymentUpdate=${updateId}&&amount=${nftAmount.toFixed(
                    2
                )}`,
                //verificationFailureUrl: `https://cicd.gamepay.sg/profile?paymentCircle=${"payment-failed"}`,
            },
        })
            .then((ares) => {
                logger.info("Circle response reveived");
                console.log("Circle response reveived");
                logger.info(ares.data);
                console.log(ares.data);
                res.status(200).json({
                    message: "Success",
                    res: ares.data,
                });
            })
            .catch((err) => {
                console.log(err);
                logger.info("Circle error during v1 payments " +  err.response.data.message);
                console.log("Circle err ", err.response.data);
                res.status(400).json({ error: err.response.data.message });
            });
    } catch (err) {
        console.log(err);
        //logger.info(err);
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
            },
        })
            .then((resp) => {
                logger.info("Received data from circle payment encryption api");
                logger.info({
                    message: "Success",
                    publicKey: resp.data.data.publicKey,
                    keyIdEncrpytion: resp.data.data.keyId,
                });
                res.status(200).json({
                    message: "Success",
                    publicKey: resp.data.data.publicKey,
                    keyIdEncrpytion: resp.data.data.keyId,
                });
            })
            .catch((err) => {
                logger.error(
                    "Error occured while fetching data from circle api"
                );
                logger.error(err);
                res.status(500).json({ error: "Some error ocurred" });
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
        axios({
            url: `${process.env.CIRCLE_API_URL}/v1/cards`,
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.CIRCLE_TOKEN}`,
                "Content-Type": "application/json",
            },
            data: req.body,
        })
            .then((response) => {
                logger.info("Received data from circle payment cards api");
                logger.info({
                    message: "Success",
                    id: response.data.data.id,
                    email: response.data.data.metadata.email,
                    network: response.data.data.network,
                    status: response.data.data.status,
                    expMonth: response.data.data.expMonth,
                    expYear: response.data.data.expYear,
                    fingerprint: response.data.data.fingerprint,
                    fundingType: response.data.data.fundingType,
                });
                res.status(200).json({
                    message: "Success",
                    id: response.data.data.id,
                    email: response.data.data.metadata.email,
                    network: response.data.data.network,
                    status: response.data.data.status,
                    expMonth: response.data.data.expMonth,
                    expYear: response.data.data.expYear,
                    fingerprint: response.data.data.fingerprint,
                    fundingType: response.data.data.fundingType,
                });
            })
            .catch((err) => {
            console.log(err.response.data);
            console.log('Error occurred during cards api payment');
            logger.error('Error occured while fetching data from circle payment cards api');
            logger.info(err);
            res.status(500).json({ error: err.response.data?.message });
        });
    } catch (err) {
        console.log(err);
        logger.info(err);
        console.log('Internal Server Error');
        res.status(500).json({
            error: "Error occurred while fetching card details from circle cards api",
        });
    }
};

const paymentsCircleLaunchpadPayment = async (req, res) => {
    try {
        const { paymentId } = req.body;
        console.log("Payment id " + paymentId);
        axios({
            url: `${process.env.CIRCLE_API_URL}/v1/payments/${paymentId}`,
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.CIRCLE_TOKEN}`,
            },
        })
            .then((data) => {
                console.log("Received data from circle payment payments api");
                logger.info("Received data from circle payment payments api");
                logger.info("data ", data.data);

                res.status(200).json({
                    message: "Success",
                    data: data.data,
                });
            })
            .catch((err) => {

                logger.error(
                    "Error occured while fetching data from circle payment payments api - {}",
                    err
                );
                res.status(500).json({ error: "Internal Server Error" });
            });
    } catch (err) {
        //console.log(err);
        logger.info(err);
        res.status(500).json({
            error: "Error occurred while fetching payment details from circle payments api",
        });
    }
};

const circleSNSResponse= async (request, response) => {
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
        request.on("end", async () => {
            console.log(`POST request, \nPath: ${request.url}`);
            console.log("Headers: ");
            console.dir(request.headers);
            console.log(`Body: ${body}`);

            response.writeHead(200, {
                "Content-Type": "text/html",
            });
            response.end(`POST request for ${request.url}`);
            await handleBody(body);
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
                        // we receive message as envelope.Message
                        let event = JSON.parse(envelope.Message);
                        console.log(event,"event",typeof event);
                        logger.info("CIRCLE EVENT ", event);

                        logger.info('Fetching User object from database');
                        const findUser = await models.users.findById(JSON.parse(event.payment.description).userId);

                        if (event.payment?.status === "paid" || event.payment?.status == "confirmed") {
                            logger.info("Payment Status from Circle is " + event.payment.status);

                            if (findUser) {
                                logger.info('Payment Activity - ' + JSON.parse(event.payment.description).payment_activity);
                                const paymentActivity = JSON.parse(event.payment.description).payment_activity;

                                logger.info('paymentActivity === NFT_PURCHASE' + (paymentActivity === 'NFT_PURCHASE'));

                                if (paymentActivity == "NFT_PURCHASE") {

                                    logger.info('Checking if the presale nft exists in database for userId - ' + userId + 'and payment id - ' + event.payment.id);
                                    const presaleNft = await PresaletNftInitiated.findOne({
                                        userId: findUser._id,
                                        paymentId: event.payment.id,
                                        paymentStatus: 'action_required'
                                    });

                                    logger.info('presaleNft object - ' + presaleNft);

                                    logger.info('event.payment.id - ' + event.payment.id);

                                    if (presaleNft) {
                                        logger.info('Presale nft exists in database');
                                        console.log(event.payment.id, "payment id");
                                        logger.info(event.payment.id +  "payment id");

                                        const alreadySaved = await PresaleBoughtNft.findOne({ paymentId: event.payment.id })

                                        console.log(alreadySaved, "is null");

                                        if (!alreadySaved) {
                                            logger.info('Creating PresaleBoughtNft collection with nft count and amount');
                                            console.log(JSON.parse(event.payment.description).nftId,
                                                JSON.parse(event.payment.description).userId,
                                                ObjectId(JSON.parse(event.payment.description).nftId),
                                                JSON.parse(event.payment.description).quantity,
                                                event.payment.amount.amount,
                                                "Cirlce");

                                            logger.info('Creating PresaleBoughtNft entry for user - ' + findUser._id);
                                            console.log('Creating PresaleBoughtNft entry for user - ' + findUser._id);
                                            const createPresale = await PresaleBoughtNft.create({
                                                nftIdOwned: JSON.parse(event.payment.description).nftId,
                                                owner: JSON.parse(event.payment.description).userId,
                                                nft: ObjectId(JSON.parse(event.payment.description).nftId),
                                                quantity: JSON.parse(event.payment.description).quantity,
                                                amountSpent: (event.payment.amount.amount).toFixed(4),
                                                currency: 'USD',
                                                paymentId: JSON.parse(event.payment.description).uniqueId,
                                                paymentMode: 'Circle',
                                                promoCode: presaleNft.promoApplied
                                            });

                                            console.log(createPresale, 'create presale');
                                            logger.info('Created PresaleBoughtNft entry for user - ' + findUser._id);

                                            logger.info('Fetching PRESALE NFT details from db');
                                            const findNFT = await Nft.presalenfts.findById(JSON.parse(event.payment.description).nftId);
                                            if (findNFT) {
                                                logger.info('Start of Updating itemSold field for presaleNFT');
                                                findNFT.itemSold = parseInt(findNFT.itemSold) + parseInt(JSON.parse(event.payment.description).quantity);
                                                await findNFT.save();
                                                logger.info('End of Updating itemSold field for presaleNFT');
                                            } else {
                                                logger.info('Unable to fetch presale NFT from collection');
                                            }
                                            logger.info('Updating presaleinitiated collection with the status received from Circle' + event.payment?.status);
                                            presaleNft.paymentStatus = event.payment?.status;
                                            await presaleNft.save();
                                            logger.info('Updated status field in presaleinitiated collection');

                                            console.log(userInfo)

                                            console.log(JSON.parse(event.payment.description).nftId, JSON.parse(event.payment.description).userId, createPresale._id, "add to my reward");
                                            logger.info(JSON.parse(event.payment.description).nftId, JSON.parse(event.payment.description).userId, createPresale._id, "add to my reward");

                                            await addMyIncomeMetaMask(JSON.parse(event.payment.description).nftId, JSON.parse(event.payment.description).userId, createPresale._id).then((res) => {
                                                console.log('Added my Income under referrals');

                                            });

                                            logger.info('Added my Income under referrals');

                                            logger.info('Updating Activity status to completed');
                                            logger.info('Updating Activity status to completed');

                                            await updateActivity(
                                                JSON.parse(event.payment.description).userId,
                                                JSON.parse(event.payment.description).uniqueId,
                                                `You have completed the payment of ${event.payment.amount.amount} USD using Fiat Payment.`
                                            );

                                            logger.info('Payment Object - ' + event.payment);
                                            logger.info('Amount Object - ' + event.payment.amount);
                                            logger.info('Updated Activity status to completed');
                                            logger.info('Amount - ' + event.payment.amount.amount);

                                            logger.info('Sending Payment confirmation email to user');
                                            await sendPaymentConfirmation({
                                                email: event.payment.metadata.email,
                                                quantity: JSON.parse(event.payment.description).quantity,
                                                amount: event.payment.amount.amount,
                                            });
                                            logger.info('Sent Payment confirmation email to user');

                                            logger.info('Fetching CirclePayment data based for payment id - ' + event.payment.id);
                                            const findCirclePay = await CirclePayment.findOne({
                                                paymentId: event.payment.id,
                                            });
                                            if (!findCirclePay) {
                                                logger.info('CirclePayment data no found for payment id - ' + event.payment.id);
                                                const CirclePay = await CirclePayment.create({
                                                    paymentId: event.payment.id,
                                                    amount: (event.payment.amount.amount).toFixed(4),
                                                    nftId: JSON.parse(event.payment.description).nftId,
                                                    email: event.payment.metadata.email,
                                                    quantity: JSON.parse(event.payment.description).quantity,
                                                    status: event.payment?.status
                                                });
                                                console.log(CirclePay, 802);
                                                logger.info('Created CirclePayment object for the email - ' + event.payment.metadata.email + ' and payment id - ' + event.payment.id);
                                            } else {
                                                logger.info('Updating CirclePayment data for payment id - ' + event.payment.id);
                                                const updateCirclePay = await CirclePayment.updateOne(
                                                    { paymentId: event.payment.id },
                                                    { $set: { status: event.payment?.status } }
                                                );
                                                logger.info('Updated CirclePayment data for payment id - ' + event.payment.id);
                                            }
                                        }else{
                                            logger.info('PresaleBoughtNft already exists for the given payment id - .' + event.payment.id);
                                        }
                                    } else {
                                        logger.info('PreSaleNFT is not present for the user or has already been processed.');
                                    }
                                } else {
                                    logger.info('Fetching LaunchpadPayment object from database');
                                    const findExists = await LaunchpadPayment.findOne({
                                        paymentId: event.payment.id,
                                    });

                                    if (!findExists) {
                                        logger.info("LaunchpadPayment entry is not present for the payment id - " + event.payment.id);
                                        await LaunchpadPayment.create({
                                            userId: findUser._id,
                                            amountCommited: event.payment.amount.amount,
                                            paymentMethod: "Circle",
                                            paymentStatus: event.payment.status,
                                            paymentId: event.payment.id,
                                        });
                                        logger.info("LaunchpadPayment entry created for the payment id - " + event.payment.id);
                                    } else {
                                        logger.info("LaunchpadPayment entry exists for the payment id - " + event.payment.id);
                                        logger.info("Updating launchpadPayment entry for the payment id - " + event.payment.id);
                                        await LaunchpadPayment.updateOne(
                                            {
                                                paymentId: event.payment.id,
                                            },
                                            {
                                                userId: findUser._id,
                                                amountCommited: amount.amount,
                                                paymentMethod: "Circle",
                                                paymentStatus: event.payment.status,
                                                paymentId: event.payment.id,
                                                metadata: JSON.stringify(event.payment.metadata),
                                            }
                                        );
                                    }

                                    logger.info('Fetching LaunchpadAmount object from database');
                                    const launchpadAmount = await LaunchpadAmount.findOne({
                                        userId: findUser._id
                                    });
                                    if (!launchpadAmount) {
                                        logger.info('LaunchpadAmount object not found in database. Creating one');
                                        await LaunchpadAmount.create({
                                            userId: findUser._id,
                                            amountCommited: event.payment.amount.amount,
                                        });
                                        logger.info('Created LaunchpadAmount object');
                                    } else {
                                        logger.info('Updating LaunchpadAmount object');
                                        launchpadAmount.amountCommited = Number(launchpadAmount.amountCommited) + Number(event.payment.amount.amount);
                                        await launchpadAmount.save();
                                        logger.info('Updated LaunchpadAmount object');
                                    }
                                }
                            } else {
                                logger.info('User does not exists in the database.');
                            }
                        } else if(event.payment?.status === "failed" || event.payment?.status === "fail" ){
                            logger.info('updateActivity for the received status from Notification');
                            console.log('updateActivity for the received status from Notification');

                            logger.info('Payment status - '+ event.payment.status);
                            logger.info('Payment amount - '+ event.payment.amount.amount);
                            logger.info('Unique id amount - '+ event.payment.amount.amount);

                            await updateActivity(
                                JSON.parse(event.payment.description).userId,
                                JSON.parse(event.payment.description).uniqueId,
                                `You have ${event.payment.status} for ${event.payment.amount.amount} USD amount using Fiat Payment.`
                            );
                            console.log('Completed updateActivity for the received status from Notification');
                            logger.info('Completed updateActivity for the received status from Notification');
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


// utils api
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

module.exports = {
    createPayment,
    coinbasePayment,
    handleCoinbasePayment,

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
    circleSNSResponse,
    getKeyForCircleLaunchpadPayment,
    getCardDetailsCircleLaunchpadPayment,
    paymentsCircleLaunchpadPayment,
};