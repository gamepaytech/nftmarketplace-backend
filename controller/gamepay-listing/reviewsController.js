const logger = require('../../logger')
const userReview = require('../../models/gamepay-listing/reviews')
const user = require('../../models/User')
const games = require('../../models/gamepay-listing/game');

const getGameReview = async(req,res)=>{
  try{
    let keys = ["gameId"];
    for (i in keys) {
      if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
        res.json({ status: 400, msg: keys[i] + " are required" });
        return;
      }
    }

    const gameList = await games.findById({_id:req.body.gameId});

    if(gameList){
      const reviews = await userReview.find()
      .sort({ createdAt : -1})
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
    res.status(500).json({err:"Internal Server Error"})
  }
};

const addGameReview = async (req, res) => {
  try {
    let keys = [
      "userId",
      "gameId",
      "comment",
      "rating",
      "gamePlay",
      "complexity",
      "earningPotential",
      "costEffective",
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

    const addReview = new userReview({
      userId: req.body.userId,
      gameId: req.body.gameId,
      comment: req.body.comment,
      rating: req.body.rating,
      gamePlay: req.body.gamePlay,
      complexity: req.body.complexity,
      earningPotential: req.body.earningPotential,
      costEffective: req.body.costEffective,
    });

    const data = await addReview.save();
    return res.status(201).json({
      status: "200",
      msg: "Data saved successfully!",
      data: data,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      err: "Internal Server Error",
    });
  }
};

module.exports = {  getGameReview, addGameReview }
