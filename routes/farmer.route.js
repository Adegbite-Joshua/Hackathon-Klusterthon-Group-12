const express = require('express');
const { createAccount, signIn, getFarmerDetails, sendResetPasswordLink, verifyResetEmail, resetPassword } = require('../controllers/farmer.controller');
const router = express.Router();

router.post('/create_account', createAccount)
router.post('/sign_in', signIn)
router.post('/details', getFarmerDetails)
router.post('/request_reset_password_link', sendResetPasswordLink)
router.post('/validate_reset_password_email', verifyResetEmail)
router.post('/reset_password', resetPassword)


module.exports = router;