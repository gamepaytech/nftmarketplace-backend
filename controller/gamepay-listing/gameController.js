const logger = require('../../logger');
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
         gameStatus = req.body.gamestatus;
         logo = req.body.logo;
         media = req.body.media;
         thumbnail = req.body.thumbnail;
         launchDate = req.body.launchdate;
         website = req.body.website;
         trailer = req.body.trailer;
         description = req.body.description;
         price = req.body.price;
         tokenEarnings = req.body.tokenearnings;
         genre = req.body.genre;
         platforms = req.body.platforms;
         blockChains = req.body.blockchains;
         tokenContract = req.body.tokencontract;
         coinGeckoUrl = req.body.coingeckourl;
         coinMarketCapUrl = req.body.coinmarketcapurl;
         redditUrl = req.body.redditurl;
         twitterUrl = req.body.twitterurl;
         partnersAuthorised = req.body.partnersauthorised;
         twitchUrl = req.body.twitchurl;
         tnCOne = req.body.tnCOne;
         tnCTwo = req.body.tnCTwo;
         tnCThree = req.body.tnCThree;
         const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
         const check = emailRegexp.test(emailId)
         if (!check) {
            return res.send(" Invalid email")
         }
         
         const url =  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
         const image = /(http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg|webp))/i;
         const logovalidation =  image.test(logo);
         if (!logovalidation) {
            return res.send("GameLogo image url is not valid ")
         }
         const mediavalidation =  image.test(media);
         if (!mediavalidation) {
            return res.send("GameMedia image url is not valid ")
         }
         const thumbnailvalidation =  image.test(thumbnail);
         if (!thumbnailvalidation) {
            return res.send("GameThumbnail  url is not valid ")
         }
         const websitevalidation =  url.test(website);
         if (!websitevalidation) {
            return res.send("GameWebsite url is not valid ")
         }
         const trailervalidation =  url.test(trailer);
         if (!trailervalidation) {
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
         const subreddit =  url.test(redditUrl);
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
         if (!gameStatus) {
            return res.send("StatusGame is required ")
         }
         if (!launchDate) {
            return res.send("GameLaunch date is required ")
         }
         if (!description) {
            return res.send("GameDescription name is required ")
         }
         if (!price) {
            return res.send("GamePrice is required ")
         }
         if (!tokenEarnings) {
            return res.send("TokenEarnings is required ")
         }
         if (!genre) {
            return res.send("GameGenre is required ")
         }
         if (!platforms) {
            return res.send("Supported Platforms game is required ")
         }
         if (!tokenContract) {
            return res.send("TokenContracts is required ")
         }
         if (!twitterUrl) {
            return res.send("TwitterHandle is required ")
         }
         if (!partnersAuthorised) {
            return res.send("Partners Authorised is required ")
         }
         if (!tnCOne) {
            return res.send("Policy 1 is required ")
         }
         if (!tnCTwo) {
            return res.send("Policy 2 is required ")
         }
         if (!tnCThree) {
            return res.send("Policy 3 is required ")
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
               gameStatus : gameStatus,
               logo : logo,
               media : media,
               thumbnail : thumbnail,
               launchDate : launchDate,
               website : website,
               trailer : trailer,
               description : description,
               price : price,
               tokenEarnings : tokenEarnings,
               genre : genre,
               platforms: platforms,
               blockChains : blockChains,
               tokenContract : tokenContract,
               coinGeckoUrl : coinGeckoUrl,
               coinMarketCapUrl : coinMarketCapUrl,
               redditUrl : redditUrl,
               redditName: redditUrl.slice(25).replace(/\/+$/, ''),
               twitterUrl : twitterUrl,
               twitterName:twitterUrl.slice(20),
               partnersAuthorised : partnersAuthorised,
               twitchUrl : twitchUrl,
               tnCOne : tnCOne,
               tnCTwo : tnCTwo,
               tnCThree : tnCThree
        })
               await game.save()  
               return  res.send(game)
         }else if (webVersion==="web 2.0") {
               const web2game = new submitgame({
                  emailId: emailId,
                  webVersion: webVersion,
                  userName: userName,
                  gameStudioName: gameStudioName,
                  relatedGame: relatedGame,
                  gameContent: gameContent,
                  emailAddress: emailAddress,
                  address: address,
                  designation: designation,
                  gameName: gameName,
                  gameStatus: gameStatus,
                  logo: logo,
                  media: media,
                  thumbnail: thumbnail,
                  launchDate: launchDate,
                  website: website,
                  trailer: trailer,
                  description: description,
                  price: price,
                  tokenEarnings: tokenEarnings,
                  genre: genre,
                  platforms: platforms,
                  blockChains: blockChains,
                  tokenContract: tokenContract,
                  coinGeckoUrl: coinGeckoUrl,
                  coinMarketCapUrl: coinMarketCapUrl,
                  redditUrl: redditUrl,
                  redditName: redditUrl.slice(25).replace(/\/+$/, ''),
                  twitterUrl : twitterUrl,
                  twitterName:twitterUrl.slice(20),
                  partnersAuthorised: partnersAuthorised,
                  twitchUrl: twitchUrl,
                  tnCOne: tnCOne,
                  tnCTwo: tnCTwo,
                  tnCThree: tnCThree
            })
               await web2game.save()  
               return  res.send(game1)
            }

            }
            catch (error) {
               console.log(error);
               logger.error(error);
            res.status(500).json({err:"Internal Server Error"})
             }
            };
module.exports = { game }