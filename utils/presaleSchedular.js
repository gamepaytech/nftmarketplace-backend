const models = require("../models/presaleTier");
const nftModels = require("../models/presaleNfts");
const logger = require("../logger");

const schedulePreSale = async () => {
  try {
    logger.info("START SCHEDULE PRESALE");
    let isPresaleStart = await nftModels.settingpresalenfts.find({});
    if (isPresaleStart[0].event_start) {
      let getPreSaleTier = await models.presaletiers.find({});
      let getPresaleNFT = await nftModels.presalenfts.find({});
      let presale_status = [];
      getPresaleNFT.forEach(async (nft) => {
        logger.info("CHECK ALL PRESALE NFT");
        let isSupplyCount = nft.nftTotalSupply <= nft.itemSold;
        if (!isSupplyCount) {
          if (nft.tier_type) {
            presale_status.push(nft.presale_status);
            getCurrentPSTier = getPreSaleTier.find(
              (el) => el.tier_type === nft.tier_type
            );
            var isFutureDate = futureDate(
              addDays(nft.presale_start_date, getCurrentPSTier.duration_in_days)
            );
            logger.info("CHECK ALL PRESALE FUTURE DATE");
            if (!isFutureDate) {
              var index = getPreSaleTier.findIndex(
                (el) => el.tier_type === nft.tier_type
              );
              if (index != getPreSaleTier.length - 1) {
                var activePresale1 = getPreSaleTier[index + 1];
                if (activePresale1) {
                  await nftModels.presalenfts.updateOne(
                    {
                      _id: nft.id,
                    },
                    [
                      {
                        $set: {
                          price: activePresale1.price,
                          tier_type: activePresale1.tier_type,
                          presale_start_date: new Date(
                            Date.now()
                          ).toISOString(),
                        },
                      },
                    ],
                    { upsert: false }
                  );
                }
              }
            } else {
              var crossed = filterQuantityPresale(getPreSaleTier, nft.itemSold);
              var pastPresale =
                crossed.length === 0
                  ? getPreSaleTier.filter(
                      (el) => el.tier_type === nft.tier_type
                    )
                  : crossed;
              var totalCount = pastPresale.reduce(function (prev, cur) {
                return prev + parseInt(cur.quantity);
              }, 0);
              logger.info("CHECK ITEM SOLD");
              if (nft.itemSold >= totalCount) {
                var activePresale =
                  getPreSaleTier[crossed.length == 0 ? 0 : crossed.length - 1];
                await nftModels.presalenfts.updateOne(
                  {
                    _id: nft.id,
                  },
                  [
                    {
                      $set: {
                        price: activePresale.price,
                        tier_type: activePresale.tier_type,
                        presale_status: "started",
                        presale_start_date: new Date(Date.now()).toISOString(),
                      },
                    },
                  ],
                  { upsert: false }
                );
              }
            }
          }
        } else {
          await nftModels.presalenfts.updateOne(
            {
              _id: nft.id,
            },
            [
              {
                $set: {
                  presale_status: "ended",
                },
              },
            ],
            { upsert: false }
          );
        }
      });
      var status = presale_status.every((v) => v === "ended");
      if (status) {
        await nftModels.settingpresalenfts.updateMany(
          {},
          [
            {
              $set: {
                event_start: false,
              },
            },
          ],
          { upsert: false }
        );
      }
      logger.info("PRESALE SCHEDULE ENDED");
    } else {
      logger.info("PRESALE EVENT NOT STARTED");
    }
  } catch (error) {
    console.log(error)
    logger.info("PRESALE SCHEDULE ERROR" + error);
  }
};


const futureDate = (value) => {
  var now = new Date();
  return new Date(now.toISOString()) < new Date(value);
};

const addDays = (str, days) => {
  var myDate = new Date(str);
  myDate.setDate(myDate.getDate() + parseInt(days));
  return myDate;
};

const filterQuantityPresale = (arr, min) => {
  var total = 0;
  let arrList = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    logger.info(total + " < " + min, "total > min");
    if (total <= min) {
      arrList.push(arr[i]);
      total += parseInt(arr[i].quantity);
    }
  }
  return arrList;
};  
module.exports = schedulePreSale;
