const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rateController');

router.get('/', ctrl.getRates)
router.put('/', ctrl.updateRates)

module.exports = router
