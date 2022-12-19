const express = require('express');

const { gpyStore } = require('../controller/StoreController');

const router = express.Router();
router.post('/add',gpyStore);



module.exports = router;