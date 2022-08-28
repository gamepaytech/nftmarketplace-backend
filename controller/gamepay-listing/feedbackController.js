const logger = require('../../logger')
const feedback = require('../../models/gamepay-listing/feedback')

const addFeedback = async (req, res) => {
    try {
     const addData = new feedback({
        email: req.body.email,
        feedback: req.body.feedback,
        comments: req.body.comments,
        imageupload: req.body.imageupload,
      });

      
      const keys = ["email","feedback","comments"];
      for (i in keys) {
        if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
          res.json({ status: 400, msg: keys[i] + " are required" });
          return;
        }
      }
          const data = await addData.save();
          return res.status(201).json({
          status: "200",
          msg: "Data saved successfully!",
          data: data,
         });
         }catch (error) {
              logger.error(error)
              res.status(500).json(error)
      }
  };
  
  module.exports = { addFeedback }