const express = require('express');
const { getGameResearch } = require('../../controller/gamepay-listing/gameResearchController');

const router = express.Router();

router.post('/:currentPage/:perPage',getGameResearch);

module.exports = router;
