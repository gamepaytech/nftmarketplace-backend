const logger = require('../../logger');
const gamepayListing = require('../../models/gamepay-listing/listing')

const getGamepayListings = async (req, res) => {
    try {
        const type = req.body.type;
        if(type != null){
            const data = await gamepayListing.findOne({type:type});
            res.status(200).json({ data: data.data });
        }else{
            res.status(400).json({ msg: "type is Required"});
        }
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};

const getTweetListByUsername = async (req, res) => {
  try {
    const username = req.body.username;
    if (typeof username === "string" && username.trim().length === 0) {
      res.status(400).json({ msg: "username is Required" });
    } else {
      await fetch(
        "https://api.twitter.com/2/users/by?usernames=" +
          username +
          "&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld&expansions=pinned_tweet_id&tweet.fields=attachments,author_id,context_annotations,created_at,entities,geo,id,in_reply_to_user_id,lang,possibly_sensitive,public_metrics,referenced_tweets,source,text,withheld",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAAC2HYwEAAAAAJc1P4JzZxdg5R5if3VumDy12cLA%3DByec6aTcsywIG6LOJIoTrDEqMa5DFdVcIofysAHaBbCvgjTTob`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          res.status(200).json({ data: data });
        })
        .catch(function (err) {
          res.status(500).json({
            message: err,
          });
        });
    }
  } catch (err) {
    logger.info(err);
    res.status(500).json({
      err: "Internal server error!",
    });
  }
};

module.exports = {
    getGamepayListings,getTweetListByUsername
}
