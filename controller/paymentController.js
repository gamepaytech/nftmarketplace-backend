// const Nft = require("../models/Nft");
const Nft = require("../models/presaleNfts");
const models = require("../models/User");
const qs = require("qs");
const { tokenGen, reqPayment } = require("../apisaaa");
const CoinbasePayment = require("../models/coinbasePayments");
const sdk = require("api")("@circle-api/v1#j7fxtxl16lsbwx");
const { uuid } = require("uuidv4");
const axios = require("axios");
const CirclePayment = require("../models/circlePayments.js");
const TripleaPayment = require("../models/TripleaPayment.js");
const { Client, resources, Webhook } = require("coinbase-commerce-node");
const PresaleBoughtNft = require("../models/PresaleBoughtNft");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const sendPaymentConfirmation = require("../utils/sendPaymentConfirmation");

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
            quantity
            // encryptedData
        } = req.body;
        const buyNft = await Nft.presalenfts.find({ _id: nftId });
        console.log("bb ",buyNft[0].price,quantity);

        const nftAmount =
            parseFloat(buyNft[0].price / 10 ** 6) * quantity;

        if (nftAmount < 0.5) {
            return res.status(400).json({
                error: "Price is less than 0.5$",
            });
        }
        console.log("NFT AMOUNT", nftAmount.toFixed(2).toString());

        console.log("DATA ",{
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
        },"SDF");

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
                console.log("A",err);
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
            
        } = req.body;

        const buyNft = await Nft.presalenfts.findOne({ _id: nftId });
        const user = await models.users.findOne({ _id: userId });

        var nftAmount =
            parseFloat(buyNft.price / 10 ** 6) * quantity;
        nftAmount = Math.round(nftAmount);
        console.log("Price ", nftAmount);

        if (nftAmount < 0.1) {
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
                    type: "widget",
                    merchant_key: "mkey-cl1x8nff8005y34th0ktk2o2u",
                    order_currency: currency,
                    order_amount: nftAmount ,
                    notify_email: user.email,
                    notify_url:
                        `${process.env.APP_BACKEND_URL}/payment/triplea-webhook-payment`,
                    notify_secret: "Cf9mx4nAvRuy5vwBY2FCtaKr",
                    notify_txs: true,
                    payer_id: orderId,
                    payer_name: user.username,
                    payer_email: user.email,
                    payer_phone: "+6591234567",
                    payer_address:
                        "1 Parliament Place, Singapore 178880",
                    payer_poi:
                        "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
                    success_url: successUrl,
                    cancel_url: cancleUrl,
                    account_api_id: "ETH1649834142vuT",
                    cart: {
                        items: [
                            {
                                sku: buyNft.name,
                                label: "Chiky Chik",
                                quantity: quantity,
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

                axios(config)
                    .then(function (response) {
                        console.log("A r", response);
                        res.status(200).json(response.data);
                    })
                    .catch(function (error) {
                        console.log("error",error);
                        var config = {
                            method: "post",
                            url: reqPayment,
                            headers: {
                                Authorization: `Bearer ${response.data.access_token}`,
                                "Content-Type": "application/json",
                            },
                            data: dataPay,
                        };

                        axios(config)
                            .then(function (response) {
                                console.log("A ", response);
                                res.status(200).json(response.data);
                            })
                            .catch(function (error) {
                                console.log("error", error);
                                res.status(400).json({
                                    error: "Some...",
                                });
                            });
                    })
                    .catch(function (error) {
                        console.log("error");
                    });
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

//coinbase payment

const { Charge } = resources;
Client.init(process.env.COINBASE_TOKEN);

const coinbasePayment = async (req, res) => {
    const { chikId, email, userId, quantity } = req.params;
    if(!email) {
        return res.status(404).json({
            err:"USER NOT FOUND"
        })
    }

    try {
        const buyNft = await Nft.presalenfts.findOne({ _id: chikId });
        console.log(buyNft);
        if (!buyNft) {
            return res.status(404).json({
                err: "NFT not found!",
            });
        }
        const nftAmount =
            parseFloat(buyNft?.price / 10 ** 6) * quantity;
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
                quantity: quantity
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
                quantity: event.data.metadata.quantity
            });

            const coinbaseRecord = await CoinbasePayment.create({
                payId: event.data.payId,
                code: event.data.code,
                amount: event.data.pricing.local.amount,
                currency: event.data.pricing.local.currency,
                chickId: event.data.metadata.nftId,
                owner: event.data.metadata.customer_id,
                nft: event.data.metadata.nftId,
                quantity: event.data.metadata.quantity
            });
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
    const { webhook_data, event, type, payment_reference, crypto_currency, crypto_address, crypto_amount, order_currency, order_amount, exchange_rate, status, status_date, receive_amount, payment_tier, payment_currency, payment_amount, payment_crypto_amount } = req.body;

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

    // calculate signature
    let check_signature = crypto
        .createHmac("sha256", secret)
        .update(`${timestamp}.${req.body}`)
        .digest("hex");

    // current timestamp
    let curr_timestamp = Math.round(new Date().getTime() / 1000);

    if (
        signature === check_signature // verify signature
        // &&  Math.abs(curr_timestamp - timestamp) <= 300 // timestamp within tolerance
    ) {
        // signature validates ... do stuff
        console.log("___________________________ WORKING HOOOK")

        
 
        if(status == 'good') {
            const createPresale = await PresaleBoughtNft.create({
                nftIdOwned: webhook_data.nftId,
                owner: webhook_data.userId,
                nft: ObjectId(webhook_data.nftId),
                quantity: webhook_data.quantity
            });
    
            const tripleaRecord = await TripleaPayment.create({  event, type, payment_reference, crypto_currency, crypto_address, crypto_amount, order_currency, order_amount, exchange_rate, status, status_date, receive_amount, payment_tier, payment_currency, payment_amount, payment_crypto_amount,
            orderId:webhook_data.orderId });
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
    tripleAWebhook
};
