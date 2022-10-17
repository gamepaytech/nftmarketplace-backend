const logger = require('../../logger')
const gameReview = require('../../models/gamepay-listing/reviews')
const user = require('../../models/User')
const games = require('../../models/gamepay-listing/game');
const userReview = require('../../models/gamepay-listing/userReview');

const getGameReview = async (req, res) => {
  try {
    const keys = ["gameId"];
    for (i in keys) {
      if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
        res.json({ status: 400, msg: keys[i] + " are required" });
        return;
      }
    }
    const gameList = await games.findById({ _id: req.body.gameId });
    const userId = req.body.userId;
    if (gameList) {
      const reviews = await gameReview
        .find({ gameId: req.body.gameId })
        .populate({
          path: "userDetail",
          select: { username: 1, profilePic: 1 },
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
      if (reviews.length > 0) {
        reviews.forEach(review => {
          let usefulCount = 0;
          let notUsefulCount = 0;
          review.showOpinion = false;
          const sumOfRating = review.rating + review.funToPlay + review.abilityToEarn + review.affordability + review.easyToLearn;
          review.overallRating = sumOfRating > 0 ? sumOfRating/5 : 0 ;
          const hasAddedReview = review.userId === userId;
          if (!!userId) {
            review.showOpinion = !hasAddedReview;
          }
          if (review.opinions && review.opinions.length > 0) {
            usefulCount = review.opinions.filter(opinion => opinion.isReviewHelpful).length;
            notUsefulCount = review.opinions.filter(opinion => opinion.isReviewHelpful === false).length;
            if (!!userId) {
              const hasAddedOpinion = review.opinions && (review.opinions.findIndex(opinion => opinion.userId === userId) !== -1);
              review.showOpinion = !hasAddedOpinion && !hasAddedReview;
            }
          }
          review.useful = usefulCount;
          review.notUseful = notUsefulCount;
        });
      }
      return res.status(200).json({
        data: reviews,
        msg: "Success"
      });
    } else {
      return res.status(400).json({
        msg: "Game Not found"
      });
    }
  }
  catch (err) {
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
      opinions:[]
    });

    const data = await addReview.save();
    return res.status(201).json({
      status: "200",
      msg: "Data saved successfully!",
      data: data,
    });
  } catch (error) {
    logger.error(error)
    res.status(500).json(error)
  }
};

module.exports = {  getGameReview, addGameReview }
