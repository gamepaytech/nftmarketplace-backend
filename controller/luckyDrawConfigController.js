const logger = require('../logger');
const configLuckyDraw = require("../models/LuckyDraw/LuckyDrawConfig");


const saveLuckyDrawConfig = async (req, res) => {
    const {
        FirstPrice,
        SecondPrice,
        ThirdPrice,
        info,
        startdate,
        enddate,
    } = req.body;
    try{ 
        const luckyDraw = await configLuckyDraw.create({
            FirstPrice: FirstPrice,
            SecondPrice: SecondPrice,
            ThirdPrice: ThirdPrice,
            startDate: startdate,
            endDate: enddate,
            info: info
        });
        await luckyDraw.save()
        return res.json({
            status: 200,
            data:luckyDraw,
            msg: "Success"
        });

    }
    catch (err) {
        res.status(500).json({
            err: "Internal server error!",
        });
    }
}
module.exports = {
    saveLuckyDrawConfig,
}