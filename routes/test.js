const express = require("express");
const router = express.Router();
const authController = require("../controller/Auth");
const resetPassword = require("../controller/ResetPassword");

// Route for sending OTP
router.post("/sendOTP", authController.sendOTP);

// Route for signing up
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/changepassword", authController.changePassword);
router.post("/resetpassword", resetPassword.resetPasswordToken);
router.post('/update-password/:token', resetPassword.resetPassword);

module.exports = router;
