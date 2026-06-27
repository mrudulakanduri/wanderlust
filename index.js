const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodoverride=require("method-override");
const ejsmate = require("ejs-mate");
const asyncwrap = require("./utils/asyncwrap.js");
const expresserror = require("./utils/expresserror.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const review = require("./models/reviews.js");



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

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expresserror(404,error);
    }
    else
        next();

}

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expresserror(404,error);
    }
    else
        next();

}

//all listings
app.get("/listings",asyncwrap(async(req,res)=>{
    const alllists=await Listing.find({})
    res.render("listings/index.ejs",{alllists});
}));

//add new listing
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

//show each listing
app.get("/listings/:id",asyncwrap(async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id).populate("review");
    res.render("listings/show.ejs",{list});

}));

//added new listing
app.post("/listings",validateListing,asyncwrap(async(req,res)=>{
    let {listing} = req.body;
    let newlisting = new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
}));

//edit listing
app.get("/listings/:id/edit",asyncwrap(async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
   
}));

//edited listing
app.put("/listings/:id",validateListing,asyncwrap(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect(`/listings/${id}`);
}));

//delete listing
app.delete("/listings/:id",asyncwrap(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//review listing
app.post("/listings/:id/reviews",validateReview,asyncwrap(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    listing.review.push(newReview);
   await newReview.save();
   await listing.save();
    res.redirect(`/listings/${listing._id}`)
}));

//delete review 
app.delete("/listings/:id/reviews/:reviewid",asyncwrap(async(req,res)=>{
    let {id,reviewid}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
    await review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}));

app.get("/", (req, res) => {
    res.redirect("/listings");
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

