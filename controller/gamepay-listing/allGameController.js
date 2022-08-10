const logger = require('../../logger');
const uploadgame = require('../../models/gamepay-listing/allgames');

const addGames = async(req,res)=>{
    try{
        const keys = ["gameName", "platforms", "gameLogoUrl", "url","token", "earn","upfront","rating","description","blockchain","genre"];
        for (i in keys) {
          if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
            res.status(400).json({ status: "error", msg: keys[i] + " are required" });
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
                res.status(500).json({err:"Internal Server Error"})
             }
            };
            
const getGameListings = async (req, res) => {
    try {
        const type = req.body.type;
        if (type != null) {
            const data = await uploadgame.find({ type: type });
            res.status(200).json({ data: data });
        } else {
            res.status(400).json({ msg: "type is Required" });
        }
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};
module.exports = { addGames,getGameListings }