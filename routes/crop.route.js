const express = require('express');
const { getCropPrediction } = require('../controllers/crop.controller');
const router = express.Router();

router.post('/get_prediction', getCropPrediction)

module.exports = router;