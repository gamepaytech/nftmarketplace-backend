const logger = require('../../logger')
const gameReview = require('../../models/gamepay-listing/reviews')
const user = require('../../models/User')
const games = require('../../models/gamepay-listing/game');
const userReview = require('../../models/gamepay-listing/userReview');

const getGameReview = async(req,res)=>{
  try{
    const keys = ["gameId"];
    for (i in keys) {
      if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
        res.json({ status: 400, msg: keys[i] + " are required" });
        return;
      }
    }

    const gameList = await games.findById({_id:req.body.gameId});
    if(gameList){
      const reviews = await gameReview
        .find({gameId:req.body.gameId})
        .populate({
          path: "userDetail",
          select: { username: 1, profilePic: 1 },
        })
        .sort({ createdAt: -1 })
        .limit(5);
     return res.status(200).json({
         data : reviews,
         msg: "Success"
        });
    }else{
      return res.status(400).json({
        msg: "Game Not found"
       });
    }
  }
  catch(err){
    logger.error(err)
    res.status(500).json(err)
  }
};

const addGameReview = async (req, res) => {
  try {
    let keys = [
      "userId",
      "gameId",
      "comment",
      "rating",
      "funToPlay",
      "abilityToEarn",
      "affordability",
      "easyToLearn",
    ];
    for (i in keys) {
      if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
        res.json({ status: 400, msg: keys[i] + " are required" });
        return;
      }
    }

    const users = await user.users.findById({_id:req.body.userId})
    if(!users){
      return res.json({ 
        status: 400, 
        msg: "User not found" 
      });
    }

    const game = await games.findById({_id:req.body.gameId});
    if(!game){
      return res.json({ 
        status: 400, 
        msg: "Game not found" 
      });
    }

    const addReview = new gameReview({
      userId: req.body.userId,
      gameId: req.body.gameId,
      comment: req.body.comment,
      rating: req.body.rating,
      funToPlay: req.body.funToPlay,
      abilityToEarn: req.body.abilityToEarn,
      affordability: req.body.affordability,
      easyToLearn: req.body.easyToLearn,
    });

    const data = await addReview.save();
    if(data){
      const review = new userReview({
      reviewerId: req.body.userId,
      gameId: req.body.gameId,
      comment: req.body.comment,
      reviewId: data._id,
      opinions:[]
      })
      await review.save()
    }
    return res.status(201).json({
      status: "200",
      msg: "Data saved successfully!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    logger.error(error)
    res.status(500).json(error)
  }
};

module.exports = {  getGameReview, addGameReview }
