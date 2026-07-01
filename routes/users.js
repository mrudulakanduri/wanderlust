const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport=require("passport");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
    let {Username,Email,Password} = req.body;
    const newUser = new User({username:Username,email:Email});
    const registeredUser = await User.register(newUser,Password);
    req.flash("success","Welcome to Wanderlust");
    res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
  
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local",
    {failureRedirect:"/login",
    failureFlash:true}),
 async(req,res)=>{
    req.flash("success","welcome back to wanderlust!!");
    res.redirect("/listings");
});

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    });

});


module.exports = router;