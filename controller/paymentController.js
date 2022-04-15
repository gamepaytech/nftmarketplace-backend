const Nft = require("../models/Nft");
const models = require("../models/User");
const qs = require("qs");
const { tokenGen, reqPayment } = require("../apisaaa");
const CoinbasePayment = require("../models/coinbasePayments");
const sdk = require("api")("@circle-api/v1#j7fxtxl16lsbwx");
const { uuid } = require("uuidv4");
const axios = require("axios");
const CirclePayment = require("../models/circlePayments.js");
const { Client, resources, Webhook } = require("coinbase-commerce-node");
const PresaleBoughtNft = require("../models/PresaleBoughtNft");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const createActivity = async (userId,price,chikId) => {
    await models.users.updateOne(
        { _id: userId },
        { $push: { activity: { activity: `You have put chik #${chikId} for sale for ${(price).toFixed(2)} BNB`, timestamp: new Date() } } },
        { new: true, upsert: true }
    )
}

const createPayment = async (req, res) => {
    try {
        axios
            .get(
                `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`
            )
            .then(async (price) => {
                // console.log(price.data["matic-network"]); //in currency
                binancePrice = price.data["binancecoin"].usd;
                console.log(binancePrice);

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
                    // encryptedData
                } = req.body;
                const buyNft = await Nft.find({ _id: nftId });
                // console.log("bb ",buyNft);

                const nftAmount =
                    binancePrice * parseFloat(buyNft[0].price / 10 ** 18);

                if (nftAmount < 0.5) {
                    return res.status(400).json({
                        error: "Price is less than 0.5$",
                    });
                }
                console.log("NFT AMOUNT", nftAmount.toFixed(2).toString());
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
                        console.error(err);
                        res.status(400).json({ error: "a.Some error ocurred" });
                    });
            })
            .catch((err) => {
                console.log(err.message);
                res.status(400).json({
                    error: "b.Some error ocurred...",
                });
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
        const { email, amount, status, nftId, paymentId } = req.body;

    const createObj = { email, amount, status, nftId, paymentId };

    const storeData = await CirclePayment.create(createObj);

    res.status(200).json({
        message: "Data saved successfully",
    });
    }
    catch(err) {
        console.log("save circle pay ",err);
        res.status(400).json({
            error:"Error ocurred while saving circle pay."
        })
    }
};

const createPaymentAAA = async (req, res) => {
    try {
        axios
            .get(
                `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`
            )
            .then(async (price) => {
                // console.log(price.data["matic-network"]); //in currency
                binancePrice = price.data["binancecoin"].usd;

                const {
                    userId,
                    nftId,
                    successUrl,
                    cancleUrl,
                    quantity,
                    currency
                } = req.body;

                const buyNft = await Nft.findOne({ _id: nftId });
                const user = await models.users.findOne({ _id: userId });

                var nftAmount =
                    binancePrice * parseFloat(buyNft.price / 10 ** 18);
                nftAmount = Math.round(nftAmount);

                if (nftAmount < 0.5) {
                    return res.status(400).json({
                        error: "Price is less than 0.5$",
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
                    data : bodyData
                  };
                  
                 await  axios(config)
                  .then(async function (response) {

                    console.log(response.data)
                    var dataPay = JSON.stringify({
                      "type": "widget",
                      "merchant_key": "mkey-cl1x8nff8005y34th0ktk2o2u",
                      "order_currency": currency,
                      "order_amount": nftAmount*quantity,
                      "notify_email": "1a2d24e8-1594-4569-bc35-079049e4d805@email.webhook.site",
                      "notify_url": "https://webhook.site/1a2d24e8-1594-4569-bc35-079049e4d805",
                      "notify_secret": "Cf9mx4nAvRuy5vwBY2FCtaKr",
                      "notify_txs": true,
                      "payer_id": "TRE1787238200",
                      "payer_name": user.username,
                      "payer_email": user.email,
                      "payer_phone": "+6591234567",
                      "payer_address": "1 Parliament Place, Singapore 178880",
                      "payer_poi": "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
                      "success_url": successUrl,
                      "cancel_url": cancleUrl,
                      "account_api_id": "ETH1649834142vuT",
                      "cart": {
                        "items": [
                          {
                            "sku": buyNft.name,
                            "label": "Chiky Chik",
                            "quantity": quantity,
                            "amount": nftAmount
                          }
                        ],
                        "shipping_cost": 0,
                        "shipping_discount": 0,
                        "tax_cost": 0
                      },
                      "webhook_data": {
                        "order_id": uuid()
                      }
                    });
                      var config = {
                        method: 'post',
                        url: reqPayment,
                        headers: { 
                          'Authorization': `Bearer ${response.data.access_token}`, 
                          'Content-Type': 'application/json'
                        },
                        data : dataPay
                      };
                      
                      axios(config)
                      .then(function (response) {
                        res.status(200).json(response.data)
                      })
                      .catch(function (error) {
                        console.log("error");
                        res.status(400).json({
                            error: "Some...",
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
                                res.status(200).json(response.data);
                            })
                            .catch(function (error) {
                                console.log("error");
                                res.status(400).json({
                                    error: "Some...",
                                });
                            });
                    })
                    .catch(function (error) {
                        console.log("error");
                    })
                  })
                  .catch((ecr) => {
                      console.log(ecr)
                      res.status(400).json({
                        error: "Some error...",
                    });
                  } )
            }).catch((err) => {
                console.log(err);
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
    const { chikId, email, userId } = req.params;
    axios
        .get(
            `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`
        )
        .then(async (price) => {
            // console.log(price.data["binancecoin"]); //in currency
            binancePrice = price.data["binancecoin"].usd;
            const buyNft = await Nft.findOne({ _id: chikId });
            // console.log(buyNft);
            const nftAmount =
                binancePrice * parseFloat(buyNft.price / 10 ** 18);
            const chargeData = {
                name: buyNft.name,
                description: buyNft.description,
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
                },
                redirect_url: `${process.env.DOMAIN}/profile`,
                cancel_url: `${process.env.DOMAIN}/chik/${chikId}?status=payment-failed-canceled`,
            };
            const charge = await Charge.create(chargeData);

            // console.log(charge);

            res.send(charge);
        })
        .catch((err) => {
            console.log(err);
            res.status(404).json({
                error: "Data not found",
            });
        });
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
            });

            const coinbaseRecord = await CoinbasePayment.create({
                payId: event.data.payId,
                code: event.data.code,
                amount: event.data.pricing.local.amount,
                currency: event.data.pricing.local.currency,
                chickId: event.data.metadata.nftId,
                owner: event.data.metadata.customer_id,
                nft: event.data.metadata.nftId,
            });
            await createActivity(owner, event.data.pricing.local.amount, event.data.metadata.nftId)
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
module.exports = {
    createPayment,
    coinbasePayment,
    handleCoinbasePayment,
    coinbaseSuccess,
    coinbaseFail,
    createPaymentAAA,
    saveCirclePaymentData,
};
