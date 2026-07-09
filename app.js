const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride=require("method-override");
const ejsmate = require("ejs-mate");
const expresserror = require("./utils/expresserror.js");
const session = require("express-session");

const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport=require("passport");
const Localstrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const sessionOptions={
    secret : "mysecretsuperkey",
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now() + 7 * 24 *60*60*1000,
        maxAge:7 * 24 *60*60*1000,
        httpOnly : true

    },
    
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success =  req.flash("success");
    res.locals.error =  req.flash("error");
    res.locals.currUser = req.user;
    next();
});
 
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");

app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.engine("ejs",ejsmate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));




main().then(()=>{
    console.log("connection sucessful");
}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


 

app.all("*splat",(req,res,next)=>{
    next(new expresserror(404,"page not found!!"));
});


app.use((err, req, res, next) => {
    console.error(err);          // Print the full error
    console.error(err.stack);    // Print the stack trace

    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error.ejs", { message });
});

// app.use((err, req, res, next) => {
//     let { status = 500, message = "something went wrong" } = err;
//     res.render("listings/error.ejs",{message});
// });

app.listen(8080,()=>{
    console.log("app is listening on the port 8080");
});

