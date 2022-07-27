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

module.exports = {
    getGamepayListings
}
