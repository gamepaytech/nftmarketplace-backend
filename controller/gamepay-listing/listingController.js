const logger = require('../../logger');
const gamepayListing = require('../../models/gamepay-listing/listing')
const games = require('../../models/gamepay-listing/game');
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

const getGamepayListingByFilter = async (req, res) => {
  try {
      const type = req.body.type;
      if(type != null){
          const data = await games.find({ type:{$elemMatch:{"$in":type, "$exists":true}}});
          res.status(200).json({ data: data });
      }else{
          const data = await games.find();
          res.status(200).json({ data: data }); 
      }
  } catch (err) {
      logger.info(err);
      res.status(500).json({
          err: "Internal server error!",
      });
  }
};

const getAllGameBySearch = async (req, res) => {
  try {
      const search = req.body.search;
      if(search != null && search != ''){
          const data = await games.find({gameName: { $regex: search, $options: "i" }});
          res.status(200).json({ data: data });
      }else{
          const data = await games.find();
          res.status(200).json({ data: data }); 
      }
  } catch (err) {
      console.log(err);
      logger.info(err);
      res.status(500).json({
          err: "Internal server error!",
      });
  }
};

const getGamepayListingAllGames = async (req, res) => {
  try {
    const mostProfitable = await games.find({ type:{$elemMatch:{"$in":['mostprofitable'], "$exists":true}}});
    const mostRated = await games.find({ type:{$elemMatch:{"$in":['mostrated'], "$exists":true}}});
    const newTrending = await games.find({ type:{$elemMatch:{"$in":['new','trending'], "$exists":true}}});
    res.status(200).json({ 
      status:200,
      mostProfitable:mostProfitable,
      mostRated:mostRated,
      newTrending:newTrending
     });
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
    let tweetList = [];
    if (typeof username === "string" && username.trim().length === 0) {
      res.status(400).json({ msg: "username is Required" });
    } else {
      await fetch(
        "https://api.twitter.com/2/tweets/search/recent?query=from:"+username+"&expansions=author_id,attachments.media_keys&user.fields=created_at,description,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld&media.fields=duration_ms,height,media_key,preview_image_url,public_metrics,type,url,width,alt_text&tweet.fields=attachments,author_id,created_at,id,lang,public_metrics,source,text,withheld",
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
          if(data.data){
            tweetList = data.data;
            tweetList.forEach(element => {
              element.username = data.includes.users[0].username
              element.profile_image_url = data.includes.users[0].profile_image_url
              element.url = data.includes.users[0].url
              element.name = data.includes.users[0].name
              element.viewPost = "https://twitter.com/"+data.includes.users[0].username+"/status/"+element.id
            });
          }
          res.status(200).json({ data: tweetList });
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

const getRedditListByUsername = async (req, res) => {
  try {
    const username = req.body.username;
    let redditList = [];
    if (typeof username === "string" && username.trim().length === 0) {
      res.status(400).json({ msg: "username is Required" });
    } else {
      getRedditUserInfo = await fetch(
        "https://www.reddit.com/r/" + username + "/about.json"
      );
      let redditUserInfo = await getRedditUserInfo.json();
      if (redditUserInfo.data.title) {
        await fetch("https://www.reddit.com/r/"+username+".json?limit=10")
          .then((response) => response.json())
          .then((data) => {
            if (data.data) {
              redditList = data.data;
              redditList.children.forEach(element => {
                element.data.userProfileImg = getUrl(redditUserInfo.data.community_icon)
                element.data.banner_background_image = getUrl(redditUserInfo.data.banner_background_image)
              });
            }
            res.status(200).json({ data: redditList });
          })
          .catch(function (err) {
            res.status(500).json({
              message: err,
            });
          });
      } else {
        res.status(200).json({
          message: "user Not Found",
          data: [],
        });
      }
    }
  } catch (err) {
    logger.info(err);
    res.status(500).json({
      err: "Internal server error!",
    });
  }
};

const getUrl = (imgUrl) => {
  let img = imgUrl || '';
  let encoded = img.replace('amp;s', 's')
  let doubleEncoded = encoded.replace('amp;', '')
  let tripleEncoded1 = doubleEncoded.replace('amp;', '')
  let tripleEncoded = tripleEncoded1.replace('amp;', '')
  return tripleEncoded
}



module.exports = {
  getGamepayListings,
  getTweetListByUsername,
  getRedditListByUsername,
  getGamepayListingByFilter,
  getAllGameBySearch,
  getGamepayListingAllGames,
};
