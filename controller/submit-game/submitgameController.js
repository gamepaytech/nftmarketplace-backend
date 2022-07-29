const submitgame = require('../../models/submit-game/submitgame');

const game = async(req,res)=>{
    console.log(req.body)
    try{
         //  step-1
         email_id = req.body.email_id;
         webversion = req.body.webversion;

          //  step-2
         gamestudioname = req.body.gamestudioname;
         games = req.body.games;
         submitting = req.body.submitting;
         gamecontent = req.body.gamecontent;         
         username = req.body.username;
         address = req.body.address;
         emailaddress = req.body.emailaddress;
          //  step-3
         gamename = req.body.gamename;
         gamestatus = req.body.gamestatus;
         gamelogo = req.body.gamelogo;
         gamemedia = req.body.gamemedia;
         gamewebsite = req.body.gamewebsite;
         gamelaunchdate = req.body. gamelaunchdate;
         gamethumbnail = req.body.gamethumbnail;
         gametrailer = req.body.gametrailer;
        // //   //  step-4
         gamedescription = req.body.gamedescription;
         blockchains = req.body.blockchains;
         gamedetails = req.body.gamedetails;
         gametoken = req.body.gametoken;
         coinurl = req.body.coinurl;
         gamegenre = req.body.gamegenre;
         platformsgame = req.body.platformsgame;
         tokens = req.body.tokens;
         coingeckourl = req.body.coingeckourl;
         subredditurl = req.body.subredditurl;
        // //   //  step-5
         twitchurl = req.body.twitchurl;
         twitter = req.body.twitter;
         partners = req.body.partners;
         policyone = req.body.policyone;
        // // //  step-6
         policytwo = req.body.policytwo;
         policythree = req.body.policythree;


         const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
         const check = emailRegexp.test(email_id)
         console.log(emailRegexp.test(email_id));
         if (!check) {
            return res.send("please a valid email")
         }
         
         const url =  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        
         const logo =  url.test(gamelogo);
         if (!logo) {
            return res.send("game logo url is not valid ")
         }
         const media =  url.test(gamemedia);
         if (!media) {
            return res.send("game media url is not valid ")
         }
         const thumbnail =  url.test(gamethumbnail);
         if (!thumbnail) {
            return res.send("game thumbnail url is not valid ")
         }
         const coin =  url.test(coinurl);
         if (!coin) {
            return res.send("coin url is not valid ")
         }
         const coingecko =  url.test(coingeckourl);
         if (!coingecko) {
            return res.send("coingecko url is not valid ")
         }
         const subreddit =  url.test(subredditurl);
         if (!subreddit) {
            return res.send("subreddit url is not valid ")
         }   
         const twitch =  url.test(twitchurl);
         if (!twitch) {
            return res.send("twitch url is not valid ")
         }
         if (!gamestudioname) {
            return res.send("game studio name is required ")
         }
         if (!games) {
            return res.send("game name  is required ")
         }
         if (!submitting) {
            return res.send("submitting the game for required ")
         }
         if (!gamecontent) {
            return res.send("game content is required ")
         }
         if (!username) {
            return res.send("user name is required ")
         }
         if (!address) {
            return res.send("organization is required ")
         }
         if (!gamename) {
            return res.send("game name is required ")
         }
         if (!gamestatus) {
            return res.send("game status is required ")
         }
         if (!gamewebsite) {
            return res.send("game website is required ")
         }
         if (!gamelaunchdate) {
            return res.send("game launch date required ")
         }
         if (!gametrailer) {
            return res.send("game trailer is required ")
         }
         if (!gamedescription) {
            return res.send("gamedescription name is required ")
         }
         if (!gamedetails) {
            return res.send("game details is required ")
         }
         if (!gametoken) {
            return res.send("Token is required ")
         }
         if (!gamegenre) {
            return res.send("gamegenre is required ")
         }
         if (!platformsgame) {
            return res.send("supported platforms is required ")
         }
         if (!tokens) {
            return res.send("Token is required ")
         }
         if (!twitter) {
            return res.send("twitter handle is required ")
         }
         if (!partners) {
            return res.send("partners is required ")
         }
         if (!policyone) {
            return res.send("policy is required ")
         }
         if (!policytwo) {
            return res.send("policy is required ")
         }
         if (!policythree) {
            return res.send("policy is required ")
         }
        if (webversion==="web 3.0") {
            const game = new submitgame({
                // step-1
               email_id : email_id,
               webversion : webversion,
                // step-2
               gamestudioname : gamestudioname,
               games : games,
               submitting : submitting,
               gamecontent :  gamecontent,
               username : username,
               address : address,
               emailaddress : emailaddress,
                // step-3
               gamename : gamename,
               gamestatus :  gamestatus,
               gamelogo : gamelogo,
               gamemedia : gamemedia,
               gamewebsite : gamewebsite,
               gamelaunchdate : gamelaunchdate,
               gamethumbnail : gamethumbnail,
               gametrailer : gametrailer,
               // //  // step-4
               gamedescription : gamedescription,
               blockchains : blockchains,
               gamedetails : gamedetails,
               gametoken : gametoken,
               coinurl : coinurl,
               gamegenre : gamegenre,
               platformsgame : platformsgame,
               tokens : tokens,
               coingeckourl : coingeckourl,
               subredditurl : subredditurl,
               // //  // step-5
               twitchurl : twitchurl,
               twitter : twitter,
               partners : partners,
               policyone : policyone,
   
                 // step-6
               policytwo : policytwo,
               policythree : policythree
        })
        await game.save()  
        return  res.send(game)
    }else if (webversion==="web 2.0") {
         const game1 = new submitgame({
        // step-1
       email_id : email_id,
       webversion : webversion,
        // step-2
       gamestudioname : gamestudioname,
       games : games,
       submitting : submitting,
       gamecontent :  gamecontent,
       username : username,
       address : address,
       emailaddress : emailaddress,
        // step-3
       gamename : gamename,
       gamestatus :  gamestatus,
       gamelogo : gamelogo,
       gamemedia : gamemedia,
       gamewebsite : gamewebsite,
       gamelaunchdate : gamelaunchdate,
       gamethumbnail : gamethumbnail,
       gametrailer : gametrailer,
       // //  // step-4
       gamedescription : gamedescription,
       gamedetails : gamedetails,
       gametoken : gametoken,
       coinurl : coinurl,
       gamegenre : gamegenre,
       platformsgame : platformsgame,
       tokens : tokens,
       coingeckourl : coingeckourl,
       subredditurl : subredditurl,
       // //  // step-5
       twitchurl : twitchurl,
       twitter : twitter,
       partners : partners,
       policyone : policyone,

         // step-6
       policytwo : policytwo,
       policythree : policythree
         
    })
    await game1.save()  
    return  res.send(game1)
}

    }
    catch (error) {
        res.status(500).json({err:"Internal Server Error"})
    }
};
module.exports = { game }