const express = require('express');

const { gpyStore,Purchase,getStore } = require('../controller/StoreController');

const router = express.Router();
router.post('/add',gpyStore);
router.post('/point',Purchase);
router.get('/view',getStore);



module.exports = router;