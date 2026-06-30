const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride=require("method-override");
const ejsmate = require("ejs-mate");
const expresserror = require("./utils/expresserror.js");
const session = require("express-session");
const flash = require("connect-flash");

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
 
 
const listings = require("./routes/listing");
const reviews = require("./routes/reviews");

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

app.use((req,res,next)=>{
    res.locals.success =  req.flash("success");
    res.locals.error =  req.flash("error");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


app.get("/", (req, res) => {
    res.send("This is the Root");
});

app.all("*splat",(req,res,next)=>{
    next(new expresserror(404,"page not found!!"));
});


app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.render("listings/error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("app is listening on the port 8080");
});

