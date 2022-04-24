
const models = require("../models/presaleTier")
const nftModels = require("../models/presaleNftTiers");
const { mapReduce } = require("../models/Token");

const getPresale = async (req, res) => {
    let page = req.query.page;
    let pageSize = req.query.pageSize;
    let total = await models.presaletiers.count({});
    models.presaletiers.find({})
      // .select("name")
      .sort({ name: "asc" })
      .limit(pageSize)
      .skip(pageSize * page)
      .then((results) => {
        return res
          .status(200)
          .json({ status:"success", total: total, page: page, pageSize: pageSize, data: results });
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  };

  const startPresale = async (req, res) => {
    try {
      let isPresaleStart = await nftModels.settingpresalenftsale.find({})
      console.log(isPresaleStart,"setting sale");
      if(isPresaleStart[0].event_start){
        let getPreSale = await models.presaletiers.findOne({tier_type:'hatch1'});
        if(getPreSale){
          await nftModels.presalenftsales.updateMany(
            {},
            [
              {
                $set: {
                  price: getPreSale.price,
                  tier_type: getPreSale.tier_type,
                  itemSold: 0,
                  presale_status: "started",
                  start_date:new Date(Date.now()).toISOString()
                },
              },
            ],
            { upsert: false }
          );
        }
        res.status(201).json({
          status:"success",
          msg: "Success! Start presale tier",
        });
      }else{
        res.status(201).json({
          status:"success",
          msg: "Presale Tier Event not Started",
        });
      }

    } catch (error) {
      res.status(201).json({
        status:"Error",
        msg: error,
      });
    }    
  };

  const schedulePreSale = async(req,res) =>{
    try {
      let isPresaleStart = await nftModels.settingpresalenftsale.find({})
      if(isPresaleStart[0].event_start){
        let getPreSaleTier = await models.presaletiers.find({});
        let getPresaleNFT = await nftModels.presalenftsales.find({});

        getPresaleNFT.forEach(async (nft) => {
          let isSupplyCount = nft.nftTotalSupply <= nft.itemSold
          if(!isSupplyCount){
            getCurrentPSTier = await models.presaletiers.findOne({tier_type:nft.tier_type}); 
            var isFutureDate = futureDate(addDays(nft.start_date,getCurrentPSTier.duration_in_days));
            if(!isFutureDate){
            var index =   getPreSaleTier.findIndex((el) =>  el.tier_type === nft.tier_type );
            if(index != getPreSaleTier.length - 1){
              var activePresale1 = getPreSaleTier[index + 1]
              if(activePresale1){
                await nftModels.presalenftsales.updateOne(
                  {
                    _id:nft.id
                  },
                  [
                    {
                      $set: {
                        price: activePresale1.price,
                        tier_type: activePresale1.tier_type,
                        start_date:new Date(Date.now()).toISOString()
                      },
                    },
                  ],
                  { upsert: false }
                );
              }
            }
            }else{
              var crossedPresale = filterPresale(getPreSaleTier,nft.tier_type); 
              var pastPresale =
                crossedPresale.length == 0
                  ? getPreSaleTier.filter((el) =>  el.tier_type === nft.tier_type )
                  : crossedPresale;
                  var totalCount = pastPresale.reduce(function(prev, cur) {
                    return prev + parseInt(cur.quantity);
                  }, 0);
              if(nft.itemSold >= totalCount){
                var activePresale = getPreSaleTier[crossedPresale.length];
                await nftModels.presalenftsales.updateOne(
                  {
                    _id:nft.id
                  },
                  [
                    {
                      $set: {
                        price: activePresale.price,
                        tier_type: activePresale.tier_type,
                        start_date:new Date(Date.now()).toISOString()
                      },
                    },
                  ],
                  { upsert: false }
                );
              }
            }
          }else{
            await nftModels.presalenftsales.updateOne(
              {
                _id:nft.id
              },
              [
                {
                  $set: {
                    presale_status:"ended",
                  },
                },
              ],
              { upsert: false }
            );
          }
        });

        res.status(201).json({
          status:"success",
          msg: "Presale Tier Updated",
        });

      }else{
        res.status(201).json({
          status:"success",
          msg: "Presale Tier Event not Started",
        });
      }
      
    } catch (error) {
      res.status(201).json({
        status:"Error",
        msg: error,
      });
    }
  }

  
const filterPresale = (arr, type) => {
  let activeTiers = [];
  for (let i = 0; i <= arr.findIndex((el) =>  el.tier_type === type); i++) {
    activeTiers.push(arr[i]);
  }
  return activeTiers;
}

const futureDate =(value) =>{
  var now = new Date();
  return (new Date(now.toISOString()) < new Date(value));
}

const addDays = (str, days) => {
var myDate = new Date(str);
myDate.setDate(myDate.getDate() + parseInt(days));
return myDate;
}

  const updatePresale = async(req, res) => {
    try {
        const data = await models.presaletiers.updateOne(
          {
            _id: req.body.id,
          },
          {
            $set: {
              tier_type: req.body.tier_type,
              quantity: req.body.quantity,
              price: req.body.price,
              duration_in_days: req.body.duration_in_days,
            },
          }
        );
        res.json({
            status:"success",
            msg: 'Success',
            data: data,
        })

        return
    } catch (err) {
        console.log(err)
        res.json({ status: 400, msg: 'Something went wrong' })
        return
    }
}


  module.exports = {getPresale,updatePresale,startPresale,schedulePreSale}


