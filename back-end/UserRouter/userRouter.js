const express = require('express');
const router = express.Router();
const userController = require('../UserController/userController');


router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/request-otp', userController.requestOTPForPasswordReset);

router.post('/reset-password', userController.resetPasswordWithOTP);



module.exports = router;
