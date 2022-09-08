const gameResearchModel = require('../../models/gamepay-listing/gameResearch')

const getGameResearch = async (req, res) => {
    try {
        const cPage = req.params.currentPage;
        const perPage = req.params.perPage;
        const data = await gameResearchModel.find().limit(perPage).skip(perPage * cPage);
        return res.status(200).json({ data: data });
    } catch (err) {
        logger.info(err);
        return  res.json({ status: 500, msg: err.toString() });
    }
};

module.exports = {
    getGameResearch,
  };
