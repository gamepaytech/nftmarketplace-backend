const logger = require('../../logger');
// const submitgame = require('../../models/gamepay-listing/game');
const submitgame = require('../../models/gamepay-listing/submitgame')
const sendSubmitEmail = require('../../utils/sendSubmitEmail');

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
         gameMetrics=req.body.gameMetrics;
         const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
         const check = emailRegexp.test(emailId)
         if (!check) {
            return res.status(400).json({
               error : "Invalid email"
              });
         }
         
         const url =  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
         const image = /(http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg|webp))/i;
         const logovalidation =  image.test(logo);
         if (!logovalidation) {
            return res.status(400).json({
               error : "GameLogo image url is not valid"
              });
         }
         const mediavalidation =  image.test(media);
         if (!mediavalidation) {
            return res.status(400).json({
               error : "GameMedia image url is not valid "
              });
         }
         const thumbnailvalidation =  image.test(thumbnail);
         if (!thumbnailvalidation) {
            return res.status(400).json({
               error : "GameThumbnail  url is not valid"
              });
         }
         const websitevalidation =  url.test(website);
         if (!websitevalidation) {
            return res.status(400).json({
               error : "GameWebsite url is not valid"
              });
         }
         const trailervalidation =  url.test(trailer);
         if (!trailervalidation) {
            return res.status(400).json({
               error : "GameTrailer url is not valid "
              });
         }
         const coin =  url.test(coinMarketCapUrl);
         if (!coin) {
            return res.status(400).json({
               error : "CoinMarketCap url is not valid"
              });
         }
         const subreddit =  url.test(redditUrl);
         if (!subreddit) {
            return res.status(400).json({
               error : "Subreddit url is not valid"
              });
         }   
         if (!gameStudioName) {
            return res.status(400).json({
               error : "GameStudio name is required"
              });
         }
         if (!relatedGame) {
            return res.status(400).json({
               error : "RelatedGame name  is required"
              });
         }
         if (!userName) {
            return res.status(400).json({
               error : "UserName is required"
              });
         }
         if (!address) {
            return res.status(400).json({
               error : "Organization Address is required"
              });
         }
         if (!designation) {
            return res.status(400).json({
               error : "Designation is required"
              });
         }
         if (!gameName) {
            return res.status(400).json({
               error : "GameName is required"
              });
         }
         if (!gameStatus) {
            return res.status(400).json({
               error : "StatusGame is required"
              });
         }
         if (!launchDate) {
            return res.status(400).json({
               error : "GameLaunch date is required "
              });
         }
         if (!description) {
            return res.status(400).json({
               error : "GameDescription name is required"
              });
         }
         if (!price) {
            return res.status(400).json({
               error : "GamePrice is required"
              });
         }
         if (!tokenEarnings) {
            return res.status(400).json({
               error : "TokenEarnings is required"
              });
         }
         if (!genre) {
            return res.status(400).json({
               error : "GameGenre is required "
              });
         }
         if (!platforms) {
            return res.status(400).json({
               error : "Supported Platforms game is required "
              });
         }
         if (!tokenContract) {
            return res.status(400).json({
               error : "TokenContracts is required "
              });
         }
         if (!twitterUrl) {
            return res.status(400).json({
               error : "TwitterHandle is required"
              });
         }
         if (!partnersAuthorised) {
            return res.status(400).json({
               error : "Partners Authorised is required"
              });
         }
         if (!tnCOne) {
            return res.status(400).json({
               error : "Policy 1 is required"
              });
         }
         if (!tnCTwo) {
            return res.status(400).json({
               error : "Policy 2 is required"
              });
         }
         if (!tnCThree) {
            return res.status(400).json({
               error : "Policy 3 is required"
              });
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
               tnCThree : tnCThree,
               gameMetrics:gameMetrics,
        })
              const data = await game.save()  
              await sendSubmitEmail({emailId:data.emailId,userName:data.userName})
              return  res.send(data)
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
                  tnCThree: tnCThree,
                  gameMetrics:gameMetrics

            })
              const data = await web2game.save()  
               await sendSubmitEmail({emailId:data.emailId,userName:data.userName})
               return  res.send(data)  
            }

            }
            catch (error) {
               console.log(error)
               logger.error(error);
            res.status(500).json({err:"Internal Server Error"})
             }
            };
module.exports = { game }