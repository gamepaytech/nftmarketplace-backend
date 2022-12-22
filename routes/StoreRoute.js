const express = require('express');

const { gpyStore,Purchase,getStore,getStoreId } = require('../controller/StoreController');

const router = express.Router();
router.post('/add',gpyStore);
router.post('/point',Purchase);
router.get('/view',getStore);
router.get('/getId',getStoreId);



module.exports = router;