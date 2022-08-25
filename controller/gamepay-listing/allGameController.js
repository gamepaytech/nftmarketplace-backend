const logger = require('../../logger');
const uploadgame = require('../../models/gamepay-listing/allgames');
const games = require('../../models/gamepay-listing/game');


const addGames = async(req,res)=>{
    try{
        const keys = ["gameName", "platforms","type", "gameLogoUrl", "url","token", "earn","upfront","rating","description","blockchain","genre"];
        for (i in keys) {
          if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
            return res.status(400).json({ status: "error", msg: keys[i] + " is required" });
          }
        }
         gameName = req.body.gameName;
         platforms = req.body.platforms;
         gameLogoUrl = req.body.gameLogoUrl;
         type=req.body.type;
         url = req.body.url;
         token = req.body.token;
         earn = req.body.earn;
         upfront = req.body.upfront;
         rating = req.body.rating;
         description = req.body.description;
         blockchain=req.body.blockchain;
         genre=req.body.genre;


         const game = new uploadgame({
             gameName: gameName,
             platforms: platforms,
             gameLogoUrl: gameLogoUrl,
             type:type,
             blockchain:blockchain,
             url: url,
             token:token,
             earn: earn,
             upfront: upfront,
             rating: rating,
             description: description,
             genre:genre
        })    
             
               await game.save()  
               return  res.send(game)
         

            }
            catch (error) {
               logger.error(error);
               return  res.json({ status: 500, msg: error.toString() });
             }
            };
            
const getGameListingsByType = async (req, res) => {
    try {
        const type = req.body.type;
        if (type != null) {
            const data = await uploadgame.find({ type: type });
            return res.status(200).json({ data: data });

        } else {
            return res.status(400).json({ msg: "type is Required" });
        }
    } catch (err) {
        logger.info(err);
        return  res.json({ status: 500, msg: err.toString() });
    }
};
const getAllGameListings = async (req, res) => {
    try {
            const data = await games.find({});
            return res.status(200).json({ data: data });
    } catch (err) {
        console.log(err);
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};
module.exports = { addGames,getGameListingsByType,getAllGameListings }