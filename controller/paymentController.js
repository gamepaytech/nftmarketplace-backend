const Nft = require("../models/Nft");
const sdk = require("api")("@circle-api/v1#j7fxtxl16lsbwx");
const { uuid } = require("uuidv4");
const axios = require('axios');

const createPayment = async (req, res) => {
    try {
        axios
            .get(
                `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`
            )
            .then(async (price) => {
                // console.log(price.data["matic-network"]); //in currency
                binancePrice = price.data["binancecoin"].usd;
                console.log(binancePrice)

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
                
                const nftAmount = binancePrice* parseFloat(buyNft[0].price / 10**18)

                if(nftAmount < 0.5) {
                  return res.status(400).json({
                    error:"Price is less than 0.5$"
                  })
                }
                console.log("NFT AMOUNT",nftAmount,buyNft[0].price / 10**18);
                sdk.auth(process.env.CIRCLE_TOKEN);
                sdk.createPayment({
                    metadata: {
                        email: email,
                        sessionId: sessionId,
                        ipAddress: "172.33.222.1",
                    },
                    amount: { amount: (nftAmount.toFixed(2)).toString(), currency: "USD" },
                    autoCapture: true,
                    source: { id: cardId, type: "card" },
                    idempotencyKey: uuid(),
                    verification: "none",
                    encryptedData: cvvEncrpytion.encryptedMessage,
                    keyId: "key1",
                })
                    .then((ares) => {
                        // console.log("AAA ", ares);
                        res.status(200).json({
                            message: "Success",
                            res: ares.data,
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(400).json({ error: "Some error ocurred" });
                    });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({
                    error: "Some error ocurred...",
                });
            });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Some error ocurred",
        });
    }
};
module.exports = { createPayment };
