const logger = require('../../logger');
const gameNft = require('../../models/gamepay-listing/game_nft');
const games = require('../../models/gamepay-listing/game');
const sendRejectEmail = require('../../utils/sendRejectEmail');

const  getGameList = async(req,res)=>{
    try{  
      const keys = ["gameId"];
      for (i in keys) {
        if (req.body[keys[i]] === undefined || req.body[keys[i]] === "") {
          res.json({ status: 400, msg: keys[i] + " are required" });
          return;
        }
      }
   const gameList = await games.findById(req.body.gameId);
       if(gameList){
         const data = await  gameNft.find()
        return res.status(200).json({
           data : data,
           msg: "Game details fetched successfully"
          });
      }else{
        return res.status(400).json({
          msg: "Game not found"
         });
      }
    }
    catch(err){
      logger.error(err)
      res.status(500).json(err)
    }
  };


const getGameDetail = async(req,res)=>{
    try{
      const check = /^[0-9a-fA-F]{24}$/;
      const id = check.test(req.params.gameId)
        if(!id){
          return res.status(400).json({
            status : 400,
            msg :"Invalid ObjectId "
          });
        }

        const data = await games.findById(req.params.gameId).populate('reviews')
        return res.status(200).json({
               data : data,
               msg: "Game details successfully"
              });      

          }
          catch(err){
          logger.error(err)
          res.status(500).json(err)
       }
   };


   const getAllGameDetails = async(req,res)=>{
     try{
         const data = await games.find()
         return res.status(200).json({
               data : data,
               msg: "Game details successfully"
              });      
          }
           catch(err){
           logger.error(err)
           res.status(500).json(err)
        }
   };

  const getApprovalStatus = async(req,res)=>{
    try{
      if(req.body.approvalStatus==="approved"){
         const data = await games.findById(req.body.id)
          data.approvalStatus = req.body.approvalStatus;
          await data.save()
        return res.status(200).json({
          data : data,
          msg : "Approved Success"
        })
      }else if(req.body.approvalStatus==="rejected"){
        const data = await games.findById(req.body.id)
        data.approvalStatus = req.body.approvalStatus;
        await data.save()
        await sendRejectEmail({emailId:data.emailId})
           return res.status(200).json({
           data : data,
           msg : "Rejected Success"
      })
     }
    }catch(err){
      console.log(err)
      logger.error(err)
      res.status(500).json(err)
    }
  }
  

module.exports={getGameList,getGameDetail,getAllGameDetails,getApprovalStatus}


