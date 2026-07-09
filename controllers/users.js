const User = require("../models/user.js");

module.exports.getSignUp = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.postSignUp =async(req,res,next)=>{
    try{
    let {Username,Email,Password} = req.body;
    const newUser = new User({username:Username,email:Email});
    const registeredUser = await User.register(newUser,Password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    });
   
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
  
};

module.exports.getLogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.postLogin =  async(req,res)=>{
    req.flash("success","welcome back to wanderlust!!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.getLogout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    });

};