const logger = require('../../logger')
const userReview = require('../../models/gamepay-listing/userReview')
const review = require('../../models/gamepay-listing/reviews')

const addUserOpinion = async (req, res) => {

  const keys = ["userId", "gameId", "reviewId"];
  for (i in keys) {
    if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
      res.json({ status: 400, msg: keys[i] + " are required" });
      return;
    }
  }
  try {
    const userData = await userReview.findOne({
      gameId: req.body.gameId,
      reviewId: req.body.reviewId,
    })

    if (userData) {
      await userReview.updateOne(
        {
          reviewId: req.body.reviewId,
          gameId: req.body.gameId
        },
        { $push: { opinions: { userId: req.body.userId, isReviewHelpful: req.body.isReviewHelpful } } },
        { new: true, upsert: true }
      )
      // await userData.save()
      return res.status(201).json({
        status: "200",
        msg: "Thank you for your opinion",
      });
    }
  } catch (error) {
    console.log(error)
    logger.error(error, "Error occured during review update")
  }
  res.status(500).json("Error occured during review update")

};
  
const getUserReview = async (req, res) => {
  try {
    const data = await userReview.find().populate('reviewId')
    return res.status(200).json({
      data: data,
      msg: "User details successfully"
    });
  } catch (error) {
    logger.error(error)
    res.status(500).json(error)
  }
}

module.exports = { addUserOpinion, getUserReview}