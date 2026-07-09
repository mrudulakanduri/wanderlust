const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport=require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup",userController.getSignUp);

router.post("/signup",userController.postSignUp);

router.get("/login",userController.getLogin);

router.post("/login",saveRedirectUrl,passport.authenticate("local",
    {failureRedirect:"/login",
    failureFlash:true}),userController.postLogin);

router.get("/logout",userController.getLogout);


module.exports = router;