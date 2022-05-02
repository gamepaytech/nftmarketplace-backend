
const models = require("../models/presaleTier")
const nftModels = require("../models/presaleNfts");
const { mapReduce } = require("../models/Token");


const startPresale = async (req, res) => {
  try {
    await nftModels.settingpresalenfts.updateMany(
      {},
      [
        {
          $set: {
            event_start : true
          },
        },
      ],
      { upsert: false }
    );
    let getPreSaleTier = await models.presaletiers.find({}).sort({ price:1 });
    let getPresaleNFT = await nftModels.presalenfts.find({});
    getPresaleNFT.forEach(async (nft) => {
      let isSupplyCount = nft.nftTotalSupply <= nft.itemSold
      if(!isSupplyCount){
        if(nft.tier_type !== "hatch0"){
          getCurrentPSTier = await models.presaletiers.findOne({tier_type:nft.tier_type}); 
          var isFutureDate = futureDate(addDays(nft.presale_start_date,getCurrentPSTier.duration_in_days));
            if(!isFutureDate){
              var index =   getPreSaleTier.findIndex((el) =>  el.tier_type === nft.tier_type );
              if(index != getPreSaleTier.length - 1){
                var activePresale1 = getPreSaleTier[index + 1]
                if(activePresale1){
                  await nftModels.presalenfts.updateOne(
                    {
                      _id:nft.id
                    },
                    [
                      {
                        $set: {
                          price: activePresale1.price,
                          tier_type: activePresale1.tier_type,
                          presale_status: "started",
                          presale_start_date:new Date(Date.now()).toISOString()
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
                  console.log(totalCount,"totalcount");
              if(nft.itemSold >= totalCount){
                var activePresale = getPreSaleTier[crossedPresale.length];
                await nftModels.presalenfts.updateOne(
                  {
                    _id:nft.id
                  },
                  [
                    {
                      $set: {
                        price: activePresale.price,
                        tier_type: activePresale.tier_type,
                        presale_status: "started",
                        presale_start_date:new Date(Date.now()).toISOString()
                      },
                    },
                  ],
                  { upsert: false }
                );
              }else{
                var crossed = filterQuantityPresale(getPreSaleTier,nft.itemSold);
                console.log(crossed)
                var activePresale = getPreSaleTier[crossed.length == 0 ? 0 : crossed.length - 1];
                await nftModels.presalenfts.updateOne(
                  {
                    _id:nft.id
                  },
                  [
                    {
                      $set: {
                        price: activePresale.price,
                        tier_type: activePresale.tier_type,
                        presale_status: "started",
                        presale_start_date:new Date(Date.now()).toISOString()
                      },
                    },
                  ],
                  { upsert: false }
                );
              }
            }
        }else{
          var crossed = filterQuantityPresale(getPreSaleTier, nft.itemSold);
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
      }else{
        await nftModels.presalenfts.updateOne(
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
    res.status(200).json({
      status:"success",
      msg: "Presale Tier Started",
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      status:"Error",
      msg: error,
    });
  }    
};


const stopPresale = async(req,res) => {
  try {
    await nftModels.presalenfts.updateMany(
      {},
      [
        {
          $set: {
            presale_status: "ended",
          },
        },
      ],
      { upsert: false }
    );
  
    await nftModels.settingpresalenfts.updateMany(
      {},
      [
        {
          $set: {
            event_start : false
          },
        },
      ],
      { upsert: false }
    );

    res.status(201).json({
      status:"success",
      msg: "Success! Stoped all presale tier",
    });
  
  } catch (error) {
    res.status(201).json({
      status:"error",
      msg: "Can't Stop presale",
    });
  }
}

const schedulePreSale = async(req,res) =>{
  try {
    let isPresaleStart = await nftModels.settingpresalenfts.find({})
    if(isPresaleStart[0].event_start){
      let getPreSaleTier = await models.presaletiers.find({}).sort({ price:1 });
      let getPresaleNFT = await nftModels.presalenfts.find({});
      let presale_status = [];
      getPresaleNFT.forEach(async (nft) => {
        let isSupplyCount = nft.nftTotalSupply <= nft.itemSold
        if(!isSupplyCount){
          if(nft.tier_type !== "hatch0"){
            presale_status.push(nft.presale_status);
            getCurrentPSTier = await models.presaletiers.findOne({tier_type:nft.tier_type}); 
            var isFutureDate = futureDate(addDays(nft.presale_start_date,getCurrentPSTier.duration_in_days));
            if(!isFutureDate){
            var index =   getPreSaleTier.findIndex((el) =>  el.tier_type === nft.tier_type );
            if(index != getPreSaleTier.length - 1){
              var activePresale1 = getPreSaleTier[index + 1]
              if(activePresale1){
                await nftModels.presalenfts.updateOne(
                  {
                    _id:nft.id
                  },
                  [
                    {
                      $set: {
                        price: activePresale1.price,
                        tier_type: activePresale1.tier_type,
                        presale_start_date:new Date(Date.now()).toISOString()
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
                await nftModels.presalenfts.updateOne(
                  {
                    _id:nft.id
                  },
                  [
                    {
                      $set: {
                        price: activePresale.price,
                        tier_type: activePresale.tier_type,
                        presale_start_date:new Date(Date.now()).toISOString()
                      },
                    },
                  ],
                  { upsert: false }
                );
              }
            }
          }else{
            var crossed = filterQuantityPresale(getPreSaleTier, nft.itemSold);
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
          res.status(200).json({
            status:"success",
            msg: "Presale Tier Updated",
          });
    
        }else{
          await nftModels.presalenfts.updateOne(
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
      var status = presale_status.every(v => v === "ended")
      if(status){
        await nftModels.settingpresalenfts.updateMany(
          {},
          [
            {
              $set: {
                event_start : false
              },
            },
          ],
          { upsert: false }
        );
      }

      res.status(200).json({
        status:"success",
        msg: "Presale Tier Updated",
      });

    }else{
      res.status(200).json({
        status:"success",
        msg: "Presale Tier Event not Started",
      });
    }
    
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status:"Error",
      msg: error,
    });
  }
}


const getPresale = async (req, res) => {
    let page = req.query.page;
    let pageSize = req.query.pageSize;
    let total = await models.presaletiers.count({});
    models.presaletiers.find({})
      // .select("name")
      .sort({ price:1 })
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


const filterPresale = (arr, type) => {
  let activeTiers = [];
  for (let i = 0; i <= arr.findIndex((el) =>  el.tier_type === type); i++) {
    activeTiers.push(arr[i]);
  }
  return activeTiers;
}

const filterQuantityPresale = (arr, min) => {
  var total = 0
  let arrList = [];
  for (let i = 0; i <= arr.length; i++) {
    console.log(total+ " < " +min , "total > min")
    if(total <= min){
      arrList.push(arr[i]);
      total += parseInt(arr[i].quantity)
    }
  }
  return arrList;
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

  function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
  }

  const getPreSaleTierById = async(req, res) => {
    const id = req.params.id;
    models.presaletiers.findById(id)
        .then(data => {
            if (!data)
                res.status(200).json({status:"error", message: "Not found Campaign with id " + id });
            else res.status(200).json({status:"success", data:data});
        })
        .catch(err => {
            res
                .status(500)
                .json({status:"error", message: "Error retrieving Campaign with id=" + id });
        });
  }

  const createPreSaleTier = async(req, res) => {
    try { 

      const keys = ["tier_type", "quantity", "price", "duration_in_days"];
      for (i in keys) {
        if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
          res.json({ status: "error", msg: keys[i] + " are required" });
          return;
        }
      } 
      const checkType = await models.presaletiers.findOne({tier_type:req.body.tier_type})
      if (checkType) {
          res.json({ status: 400, msg: 'Presale Tier already updated' })
          return
      }
      const query = {
        tier_type: req.body.tier_type,
        quantity: req.body.quantity,
        price: req.body.price,
        duration_in_days: req.body.duration_in_days,
      };
      const createPresale = new models.presaletiers(query);
      const presaleInfo = await createPresale.save();
      res.status(201).json({
        status: "success",
        msg: "Success! campaign created",
        data: presaleInfo,
      });
      return;
      
    } catch (error) {
      res.json({
        status: 400,
        msg: error.toString(),
      });
      return;
    }
    
  }


  const updatePresale = async(req, res) => {
    try {
        const keys = ['id','tier_type', 'quantity','price','duration_in_days'];
        for (i in keys) {
            if (req.body[keys[i]] == undefined || isEmptyOrSpaces(req.body[keys[i]])) {
                res.json({ status: "error", msg: keys[i] + ' are required' })
                return
            }
        }
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


module.exports = {startPresale,stopPresale,schedulePreSale,getPresale,createPreSaleTier,getPreSaleTierById,updatePresale}


