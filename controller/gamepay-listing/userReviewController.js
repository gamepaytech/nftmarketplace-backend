const logger = require('../../logger')
const userReview = require('../../models/gamepay-listing/userReview')

const addUserReview = async (req, res) => {
    try {
     const addData = new userReview({
        userId : req.body.userId,
        gameId: req.body.gameId,
        reviewId: req.body.reviewId,
        isReviewHelpful: req.body.isReviewHelpful,
      });

      
      const keys = ["userId","gameId","reviewId"];
      for (i in keys) {
        if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
          res.json({ status: 400, msg: keys[i] + " are required" });
          return;
        }
      }
      
          const data = await addData.save();
          return res.status(201).json({
          status: "200",
          data: data,
          msg: "Data saved successfully!",
         });
         }catch (error) {
              logger.error(error)
              res.status(500).json(error)
      }
  };
  
  module.exports = { addUserReview }