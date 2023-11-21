const express = require('express');
const { createAccount, signIn, getFarmerDetails } = require('../controllers/farmer.controller');
const router = express.Router();

router.post('/create_account', createAccount)
router.post('/sign_in', signIn)
router.post('/details', getFarmerDetails)


module.exports = router;