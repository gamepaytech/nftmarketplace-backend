require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
var bodyParser = require('body-parser')
// Database
const DBConnect = require("./database");
// Other
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
// Routers
const authRouter = require("./routes/authRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const nftRouter = require("./routes/nftRoutes");
const userRouter = require("./routes/userRoute");
const gamePayTokenRouter = require("./routes/tokensRoute");
const paymentRouter = require("./routes/paymentRoute");
const promoRouter = require("./routes/promoRoutes");
const referralRouter = require("./routes/referralRoute");
const claimRouter = require('./routes/claimRoutes');
const preSaleTier = require('./routes/presaleTier');
const launchPad = require('./routes/launchPadRoute');
const kyc = require('./routes/kycRoute');
const vestingRouter = require('./routes/vestingRoute');
const systemRouter = require("./routes/systemRoute");
const luckyDrawRouter = require("./routes/luckyDrawRoute");

const gamepayListingRouter = require("./routes/gamepay-listing/listingRoute");
const gameRouter = require("./routes/gamepay-listing/gameRoutes");
const reviewsRouter = require("./routes/gamepay-listing/reviewsRoute")
const gameNFTRouter = require("./routes/gamepay-listing/gameNftRoute")
const gameNftRouter = require("./routes/gamepay-listing/gameNftRoutes")
const feedbackRouter = require("./routes/gamepay-listing/feedbackRoutes")
const userReviewRouter = require("./routes/gamepay-listing/userReviewRoutes")
const gameResearchRouter = require("./routes/gamepay-listing/gameResearch")
const userSteamInfo = require("./routes/userSteamInfoRoute")
const questsRouter = require("./routes/questsRoute");
const leaderBoardRouter = require("./routes/leaderBoardRouter");
const StoreRouter = require("./routes/StoreRoute");

const allgameRouter= require('./routes/allGameRoute');
// const nftPresaleRouter = require('./routes/nftPresaleRoute');

// Database connection
DBConnect();

app.disable('etag');

app.set("trust proxy", 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 400,
    })
);
app.use(
    express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf;
      },
    })
  );
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
app.use(bodyParser.json({limit: "50mb" }));
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));

// app.use(notFound)
// app.use(errorHandler)

// Routes
app.use("/auth", authRouter);
app.use("/nft", nftRouter);
app.use('/preSaleTier', preSaleTier)
app.use('/referral', referralRouter)
app.use('/launchPad', launchPad)
app.use('/kyc', kyc)
app.use("/users", userRouter);
app.use("/gamePayToken", gamePayTokenRouter);
app.use("/payment", paymentRouter);
app.use("/promo",promoRouter);
app.use("/claim", claimRouter);
app.use("/vesting",vestingRouter);
app.use("/system",systemRouter);
app.use("/luckydraw", luckyDrawRouter);
app.use("/gamepay-listing", gamepayListingRouter);
app.use("/gamepay-listing/game", gameRouter);
app.use("/gamepay-listing/review", reviewsRouter)
app.use("/game-nft", gameNFTRouter)
app.use("/gamepay-listing", gameNftRouter)
app.use("/gamepay-listing", feedbackRouter)
app.use("/gamepay-listing/allgame", allgameRouter)
app.use("/gamepay-listing", userReviewRouter)
app.use("/game-research", gameResearchRouter)
app.use("/user-steam-info", userSteamInfo)
app.use("/quests",questsRouter)
app.use("/leader-board",leaderBoardRouter)
app.use("/store",StoreRouter)

// app.use('/nftPresale',nftPresaleRouter)
 
//  Listening
app.listen(PORT, () => {
    console.log(` App successfully started on port 1: ${PORT}`);
});
