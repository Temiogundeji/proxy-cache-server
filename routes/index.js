const { Router } = require('express');
const router = Router();
const { cacheStocks, getStocks } = require('../controller/stockController');

router.get('/stocks/:username', getStocks);
// router.get('/stockDetails/:ticker');
// router.get('/stockStatistics/:ticker');

module.exports = router;