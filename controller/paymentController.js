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
var crypto = require('crypto')
const sdk = require("api")("@circle-api/v1#j7fxtxl16lsbwx");
const { uuid } = require("uuidv4");
const axios = require("axios");
const mongoose = require("mongoose");
const qs = require("qs");
const { Client, resources, Webhook } = require("coinbase-commerce-node");
const ObjectId = mongoose.Types.ObjectId;

const createActivity = async (userId, price, chikId) => {
    await models.users.updateOne(
        { _id: userId },
        {
            $push: {
                activity: {
                    activity: `You have put chik #${chikId} for sale for ${price.toFixed(
                        2
                    )} USDT`,
                    timestamp: new Date(),
                },
            },
        },
        { new: true, upsert: true }
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
        console.log("bb ", buyNft[0].price, quantity);

        const nftAmount = parseFloat(buyNft[0].price / 10 ** 6) * quantity;

        if (nftAmount < 0.5) {
            return res.status(400).json({
                error: "Price is less than 0.5$",
            });
        }
        console.log("NFT AMOUNT", nftAmount.toFixed(2).toString());

        console.log(
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
                console.log("AAA ", ares);
                res.status(200).json({
                    message: "Success",
                    res: ares.data,
                });
            })
            .catch((err) => {
                console.log("A", err);
                res.status(400).json({ error: "a.Some error ocurred" });
            });
    } catch (err) {
        console.log(err);
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
        console.log("save circle pay ", err);
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
            console.log(promoCode, "promo");
            const promo = await PromoCode.findOne({ promoCode: promoCode });
            console.log(promo);
            promoDiv = promo.percentDiscount;
        }

        console.log(quantity, "quantity");

        var nftAmount =
            parseFloat(buyNft.price / 10 ** 6) * quantity * (100 - promoDiv);
        nftAmount = Math.round(nftAmount);
        console.log("Price ", nftAmount);

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
                console.log(response.data);
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

                console.log(dataPay, "239");
                axios(config)
                    .then(function (response) {
                        console.log("A ", JSON.stringify(response.data));

                        res.status(200).json(response.data);
                    })
                    .catch(function (error) {
                        console.log(error.response, "247");
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
        console.log(buyNft);
        if (!buyNft) {
            return res.status(404).json({
                err: "NFT not found!",
            });
        }
        var promoDiv = 0;
        console.log(promoCode, "promo", !promoCode);
        if (promoCode) {
            console.log(promoCode, "promo");
            const promo = await PromoCode.findOne({ promoCode: promoCode });
            console.log(promo);
            promoDiv = promo.percentDiscount;
        }
        const nftAmount =
            parseFloat(buyNft?.price / 10 ** 6) *
            quantity *
            ((100 - promoDiv) / 100);
        console.log("CHARGE DATA ", buyNft?.price / 10 ** 6);

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

        // console.log(charge);
        // for email
        // sendPaymentConfirmation(emailId, )

        res.send(charge);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            error: "Data not found",
        });
    }
};

const handleCoinbasePayment = async (req, res) => {
    const rawBody = req.rawBody;
    console.log("req body ", rawBody);
    const signature = req.headers["x-cc-webhook-signature"];
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;
    let event;

    try {
        event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
        console.log("Event ", event);

        if (event.type === "charge:pending") {
            // received order
            // user paid, but transaction not confirm on blockchain yet

            console.log("pending payment", event);
            return res.json({
                status: "Pending",
            });
        }

        if (event.type === "charge:confirmed") {
            // fulfill order
            // charge confirmed
            console.log("charge confirmed", event.data);
            //save in presale bought nft added to user account
            console.log("TEST ", {
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
            console.log("GET MY REFERRAL ", getMyreferral[0]._id);
            if (userInfo && userInfo[0].refereeCode != "") {
                const bought = await PresaleBoughtNft.findOne({
                    _id: createPresale._id,
                });
                const setting = await referralModel.appsetting.findOne({});
                console.log("bought ", bought);
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
                event.data.metadata.nftId
            );
            //create payment schema

            return res.json({
                status: "confirmed",
            });
        }

        if (event.type === "charge:failed") {
            // cancel order
            // charge failed or expired
            console.log("charge failed sdfdsf", event.data);
            return res.json({
                status: "failed",
            });
        }

        res.send(`success ${event.id}`);
    } catch (error) {
        console.log("err 00", error);
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
        console.log(req.body.email);
        await sendPaymentConfirmation(req.body);
        res.status(200).json({
            status: "Email sent",
        });
    } catch (err) {
        console.log("error", err);
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
    const secret = 'Cf9mx4nAvRuy5vwBY2FCtaKr!@#';
    // calculate signature
    let check_signature = crypto
        .createHmac("sha256", secret)
        .update(`${timestamp}.${req.body}`)
        .digest("hex");

    // current timestamp
    let curr_timestamp = Math.round(new Date().getTime() / 1000);
    console.log("___________________________ WORKING HOOOK 509");
    if (
        signature === check_signature // verify signature
        // &&  Math.abs(curr_timestamp - timestamp) <= 300 // timestamp within tolerance
    ) {
        // signature validates ... do stuff
        console.log("___________________________ WORKING HOOOK");

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
        if (status == "good") {
            const createPresale = await PresaleBoughtNft.create({
                nftIdOwned: webhook_data.nftId,
                owner: webhook_data.userId,
                nft: ObjectId(webhook_data.nftId),
                quantity: webhook_data.quantity,
            });

            const userInfo = await models.users.find({
                _id: webhook_data.userId,
            });
            const getMyreferral = await models.users.find({
                referralCode: userInfo[0].refereeCode,
            });
            console.log("GET MY REFERRAL ", getMyreferral[0]._id);
            if (userInfo && userInfo[0].refereeCode != "") {
                const bought = await PresaleBoughtNft.findOne({
                    _id: createPresale._id,
                });
                const setting = await referralModel.appsetting.findOne({});
                console.log("bought ", bought);
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
                event.data.metadata.nftId
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
            paymentStatus: "Initiated"
        });

        res.status(200).json({
            msg: "Success! Payment initiated.",
            payment: createData
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            err: "500: Internal Server Error.",
        });
    }
};

const errorLaunchpadPayment = async (req, res) => {
    try {
        let { id, error, code } = req.body;

        const createData = await LaunchpadPayment.updateOne({ _id: ObjectId(id) }, {
            userId: req.user.userId,
            paymentStatus: "Failed",
            code: code,
            error: error
        });

        res.status(200).json({
            msg: "Error! Payment failed.",
            payment: createData
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            err: "500: Internal Server Error.",
        });
    }
};

const makeLaunchpadPayment = async (req, res) => {
    try {
        let { amount, transactionHash, id } = req.body;

        const createData = await LaunchpadPayment.updateOne({ _id: ObjectId(id) }, {
            paymentStatus: "Completed",
            paymentId: transactionHash,
        });

        const findLaunchpad = await LaunchpadAmount.findOne({
            userId: req.user.userId.toString(),
        });
        if (!findLaunchpad) {
            console.log("not found", findLaunchpad);
            const createAmount = await LaunchpadAmount.create({
                userId: req.user.userId,
                amountCommited: amount,
            });
        } else {
            findLaunchpad.amountCommited =
                Number(findLaunchpad.amountCommited) + Number(amount);
            console.log("found --0", findLaunchpad);
            await findLaunchpad.save();
        }

        res.status(200).json({
            msg: "Success! Payment confirmed.",
        });
    } catch (err) {
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
                customer_id: req.user.userId,
                customer_email: req.body.email,
                amountCommited: amount,
            },
            redirect_url: `${process.env.DOMAIN}/launchpad?status=payment-success`,
            cancel_url: `${process.env.DOMAIN}/launchpad?status=payment-failed-canceled`,
        };

        console.log("CHARGE DATA ", chargeData);

        const charge = await Charge.create(chargeData);

        res.send(charge);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            error: "Data not found",
        });
    }
};
const handleCoinbaseLaunchpadHook = async (req, res) => {
    const rawBody = req.rawBody;
    console.log("req body ", rawBody);
    const signature = req.headers["x-cc-webhook-signature"];
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;
    let event;

    try {
        event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);

        if (event.type === "charge:pending") {
            // received order
            // user paid, but transaction not confirm on blockchain yet
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
            }
            return res.json({
                status: "Pending",
            });
        }

        if (event.type === "charge:confirmed") {
            // fulfill order
            // charge confirmed
            console.log("charge confirmed", event.data);
            //save in presale bought nft added to user account

            //create payment schema
            const findExists = await LaunchpadPayment.find({
                paymentId: event.data.id,
            });
            if (!findExists) {
                const createData = await LaunchpadPayment.create({
                    userId: event.data.metadata.userId,
                    amountCommited: event.data.metadata.amount,
                    paymentMethod: "Coinbase",
                    paymentStatus: "confirmed",
                    paymentId: event.data.id,
                });
            }
            const findLaunchpad = await LaunchpadAmount.findOne({
                userId: req.user.userId.toString(),
            });
            if (!findLaunchpad) {
                console.log("not found", findLaunchpad);
                const createAmount = await LaunchpadAmount.create({
                    userId: req.user.userId,
                    amountCommited: amount,
                });
            } else {
                findLaunchpad.amountCommited =
                    Number(findLaunchpad.amountCommited) + Number(amount);
                console.log("found --0", findLaunchpad);
                await findLaunchpad.save();
            }

            return res.json({
                status: "confirmed",
            });
        }

        if (event.type === "charge:failed") {
            // cancel order
            // charge failed or expired
            console.log("charge failed sdfdsf", event.data);
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
            }

            return res.json({
                status: "failed",
            });
        }

        res.send(`success ${event.id}`);
    } catch (error) {
        console.log("err 00", error);
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
        
        const orderId = uuid();

        const createData = await LaunchpadPayment.create({
            userId: req.user.userId,
            amountCommited: nftAmount,
            paymentMethod: "Triplea",
            paymentStatus: "initiated",
            paymentId: null,
            orderId: orderId,
            metadata: JSON.stringify(req.body),
        });

        await axios(config)
            .then(async function (response) {
                console.log("response {}", response);
                var dataPay = JSON.stringify({
                  type: "triplea",
                  merchant_key: `${process.env.AAA_MERCHANT_KEY}`,
                  order_currency: "USD",
                  order_amount: 1,
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
                  },
                  cart: {
                    items: [
                      {
                        amount: nftAmount,
                        quantity: 1,
                        label: "Chiky Chik",
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
                        "Content-Type": "application/json"
                    },
                    data: dataPay
                };

                // console.log("config {}", config.response , " ",  "239");
                axios(config)
                    .then(function (response) {
                        console.log("A-- ", JSON.stringify(response.data));

                        res.status(200).json(response.data);
                    })
                    .catch(function (error) {
                        console.log(error.response, "247");
                        return res.status(400).json({err:"Some error ocurred!"})
                    });
                    
                    /*const res = await axios.post(reqPayment, dataPay, { headers });
                    console.log ("res {}", res);*/   
            })
            .catch((ecr) => {
                console.log(ecr);
                res.status(400).json({
                    error: "Some error...",
                });
            });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Some error ocurred",
        });
    }
};
const tripleAWebhookLaunchpad = async (req, res) => {
    console.log("TripleA hook started");
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
    const secret = process.env.AAA_CLIENT_NOTIFYSECRET;
    // calculate signature
    let check_signature = crypto
        .createHmac("sha256", secret)
        .update(`${timestamp}.${req.body}`)
        .digest("hex");

    // current timestamp
    let curr_timestamp = Math.round(new Date().getTime() / 1000);

    console.log(signature,"___________________________ WORKING HOOOK 904",check_signature);
    console.log("905 ",signature === check_signature);
    console.log("Status" , status)
    console.log("BODY ",req.body);
    if (
        signature 
    ) {
        // signature validates ... do stuff
        console.log(
          "___________________________ WORKING HOOOK",webhook_data,
          webhook_data.order_id
        );
        const createData = await LaunchpadPayment.findOneAndUpdate({orderId:webhook_data.order_id },{
            orderId:webhook_data.order_id,
            paymentStatus: status,
            paymentId: req.body.txs[0].txid,
            metadata: JSON.stringify(req.body),
        }, {upsert:true});

        console.log("entry uopdastee",createData);
        const amount = req.body.payment_amount
        if (status == "good") {
            const findLaunchpad = await LaunchpadAmount.findOne({
              userId: req.body.webhook_data.userId,
            });
            if (!findLaunchpad) {
              console.log("not found", findLaunchpad);
              const createAmount = await LaunchpadAmount.create({
                userId: req.body.webhook_data.userId,
                amountCommited: amount,
              });
            } else {
              findLaunchpad.amountCommited =
                Number(findLaunchpad.amountCommited) + Number(amount);
              console.log("found --0", findLaunchpad);
              await findLaunchpad.save();
            }
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
        console.log("findData   ", findData);

        res.status(200).json({
            data: findData,
            status: 200,
        });
    } catch (err) {
        console.log(err);
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
        console.log("findData   ", findData);

        res.status(200).json({
            data: findData,
            status: 200,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            err: "500: Internal server error!",
        });
    }
};

const getLaunchpadActivity = async (req, res) => {
    try {
        if (!req.user.userId) {
            return res.status(404).json({
                err: "Error! user not found.",
            });
        }
        let page = req.query.page;
        let pageSize = req.query.pageSize;
        const currentDate = new Date();
        const fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 0);
        let total = await LaunchpadPayment.count({
            userId: req.user.userId,
            updatedAt: {
                $gte: fromDate,
            }
        });
        LaunchpadPayment.find({
            userId: req.user.userId,
            updatedAt: {
                $gte: fromDate,
            }
        })
            // .select("name")
            .sort({ updatedAt: -1 })
            .limit(pageSize)
            .skip(pageSize * page)
            .then((results) => {
                return res
                    .status(200)
                    .json({ status: "success", total: total, page: page, pageSize: pageSize, data: results });
            })
            .catch((err) => {
                return res.status(500).send(err);
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            err: "500: Internal server error!",
        });
    }
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
  handleCoinbaseLaunchpadHook,
  makeLaunchpadPayment,
  getCommitedAmount,
  launchpadPaymentAAA,
  tripleAWebhookLaunchpad,
  getAllCommitedAmount,
  initiateLaunchpadPayment,
  errorLaunchpadPayment,
  getLaunchpadActivity,
};
