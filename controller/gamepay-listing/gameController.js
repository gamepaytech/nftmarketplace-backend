const { Console } = require('winston/lib/winston/transports');
const submitgame = require('../../models/gamepay-listing/game');

const game = async(req,res)=>{
    try{
         emailId = req.body.emailid;
         webVersion = req.body.webversion;
         userName = req.body.username;
         gameStudioName = req.body.gamestudioname;
         relatedGame = req.body.relatedgame;
         gameContent = req.body.gamecontent;
         emailAddress = req.body.emailaddress;
         address = req.body.address;
         designation = req.body.designation;
         gameName = req.body.gamename;
         statusGame = req.body.statusgame;
         gameLogo = req.body.gamelogo;
         gameMedia = req.body.gamemedia;
         gameThumbnail = req.body.gamethumbnail;
         gameLaunchDate = req.body. gamelaunchdate;
         gameWebsite = req.body.gamewebsite;
         gameTrailer = req.body.gametrailer;
         gameDescription = req.body.gamedescription;
         gamePrice = req.body.gameprice;
         tokenEarnings = req.body.tokenearnings;
         gameGenre = req.body.gamegenre;
         platFormsGame = req.body.platformsgame;
         blockChains = req.body.blockchains;
         tokenContracts = req.body.tokencontracts;
         coinGeckoUrl = req.body.coingeckourl;
         coinMarketCapUrl = req.body.coinmarketcapurl;
         subredditUrl = req.body.subredditurl;
         twitter = req.body.twitter;
         partnersAuthorised = req.body.partnersauthorised;
         twitchUrl = req.body.twitchurl;
         policyOne = req.body.policyone;
         policyTwo = req.body.policytwo;
         policyThree = req.body.policythree;
         const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
         const check = emailRegexp.test(emailId)
         if (!check) {
            return res.send(" Invalid email")
         }
         
         const url =  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
         const image = /(http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg))/i;
         const logo =  image.test(gameLogo);
         if (!logo) {
            return res.send("GameLogo image url is not valid ")
         }
         const media =  image.test(gameMedia);
         if (!media) {
            return res.send("GameMedia image url is not valid ")
         }
         const thumbnail =  image.test(gameThumbnail);
         if (!thumbnail) {
            return res.send("GameThumbnail image url is not valid ")
         }
         const website =  url.test(gameWebsite);
         if (!website) {
            return res.send("GameWebsite url is not valid ")
         }
         const trailer =  url.test(gameTrailer);
         if (!trailer) {
            return res.send("GameTrailer url is not valid ")
         }
         const coin =  url.test(coinMarketCapUrl);
         if (!coin) {
            return res.send("CoinMarketCap url is not valid ")
         }
         const coingecko =  url.test(coinGeckoUrl);
         if (!coingecko) {
            return res.send("CoinGecko url is not valid ")
         }
         const subreddit =  url.test(subredditUrl);
         if (!subreddit) {
            return res.send("Subreddit url is not valid ")
         }   
         const twitch =  url.test(twitchUrl);
         if (!twitch) {
            return res.send("Twitch url is not valid ")
         }
         if (!gameStudioName) {
            return res.send("GameStudio name is required ")
         }
         if (!relatedGame) {
            return res.send("RelatedGame name  is required ")
         }
         if (!userName) {
            return res.send("UserName is required ")
         }
         if (!address) {
            return res.send("Organization Address is required ")
         }
         if (!designation) {
            return res.send("Designation is required ")
         }
         if (!gameName) {
            return res.send("GameName is required ")
         }
         if (!statusGame) {
            return res.send("StatusGame is required ")
         }
         if (!gameLaunchDate) {
            return res.send("GameLaunch date is required ")
         }
         if (!gameDescription) {
            return res.send("GameDescription name is required ")
         }
         if (!gamePrice) {
            return res.send("GameDetails is required ")
         }
         if (!tokenEarnings) {
            return res.send("TokenEarnings is required ")
         }
         if (!gameGenre) {
            return res.send("GameGenre is required ")
         }
         if (!platFormsGame) {
            return res.send("Supported Platforms game is required ")
         }
         if (!tokenContracts) {
            return res.send("TokenContracts is required ")
         }
         if (!twitter) {
            return res.send("TwitterHandle is required ")
         }
         if (!partnersAuthorised) {
            return res.send("Partners Authorised is required ")
         }
         if (!policyOne) {
            return res.send("Policy is required ")
         }
         if (!policyTwo) {
            return res.send("Policy is required ")
         }
         if (!policyThree) {
            return res.send("Policy is required ")
         }
        if (webVersion==="web 3.0") {
            const game = new submitgame({
               emailId : emailId,
               webVersion : webVersion,
               userName : userName,
               gameStudioName : gameStudioName,
               relatedGame : relatedGame,
               gameContent :  gameContent,
               emailAddress : emailAddress,
               address : address,
               designation : designation,
               gameName : gameName,
               statusGame : statusGame,
               gameLogo : gameLogo,
               gameMedia : gameMedia,
               gameThumbnail : gameThumbnail,
               gameLaunchDate : gameLaunchDate,
               gameWebsite : gameWebsite,
               gameTrailer : gameTrailer,
               gameDescription : gameDescription,
               gamePrice : gamePrice,
               tokenEarnings : tokenEarnings,
               gameGenre : gameGenre,
               platFormsGame : platFormsGame,
               blockChains : blockChains,
               tokenContracts : tokenContracts,
               coinGeckoUrl : coinGeckoUrl,
               coinMarketCapUrl : coinMarketCapUrl,
               subredditUrl : subredditUrl,
               twitter : twitter,
               partnersAuthorised : partnersAuthorised,
               twitchUrl : twitchUrl,
               policyOne : policyOne,
               policyTwo : policyTwo,
               policyThree : policyThree
        })
               await game.save()  
               return  res.send(game)
         }else if (webVersion==="web 2.0") {
               const game1 = new submitgame({
                  emailId : emailId,
                  webVersion : webVersion,
                  userName : userName,
                  gameStudioName : gameStudioName,
                  relatedGame : relatedGame,
                  gameContent :  gameContent,
                  emailAddress : emailAddress,
                  address : address,
                  designation : designation,
                  gameName : gameName,
                  statusGame : statusGame,
                  gameLogo : gameLogo,
                  gameMedia : gameMedia,
                  gameThumbnail : gameThumbnail,
                  gameLaunchDate : gameLaunchDate,
                  gameWebsite : gameWebsite,
                  gameTrailer : gameTrailer,
                  gameDescription : gameDescription,
                  gamePrice : gamePrice,
                  tokenEarnings : tokenEarnings,
                  gameGenre : gameGenre,
                  platFormsGame : platFormsGame,
                  tokenContracts : tokenContracts,
                  coinGeckoUrl : coinGeckoUrl,
                  coinMarketCapUrl : coinMarketCapUrl,
                  subredditUrl : subredditUrl,
                  twitter : twitter,
                  partnersAuthorised : partnersAuthorised,
                  twitchUrl : twitchUrl,
                  policyOne : policyOne,
                  policyTwo : policyTwo,
                  policyThree : policyThree  
            })
               await game1.save()  
               return  res.send(game1)
            }

            }
            catch (error) {
               console.log(error);
            res.status(500).json({err:"Internal Server Error"})
             }
            };
module.exports = { game }