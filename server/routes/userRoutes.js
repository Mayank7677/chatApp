const userController = require("../controllers/userController");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.get("/checkAuth", auth, userController.checkAuth);
router.put("/updateProfile", auth, userController.updateProfile);
router.get("/logout", auth, userController.logout);
router.post("/forgotPass", userController.forgotPass);
router.post("/sendOtp", userController.checkMailAndSendOTP);
router.post("/verifyOtp", userController.verifyOTP);

module.exports = router;
 