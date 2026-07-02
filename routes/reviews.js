const express = require("express");
const router = express.Router({mergeParams:true});
const asyncwrap = require("../utils/asyncwrap.js");
const expresserror = require("../utils/expresserror.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing");
const review = require("../models/reviews.js");
const {isLoggedIn,isAuthor} = require("../middleware.js");


const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expresserror(404,error);
    }
    else
        next();

}

//review listing
router.post("/",isLoggedIn,validateReview,asyncwrap(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
   await newReview.save();
   console.log(newReview);
   await listing.save();
        req.flash("success","New Review Added");
    res.redirect(`/listings/${listing._id}`)
}));

//delete review 
router.delete("/:reviewid",isLoggedIn,isAuthor,asyncwrap(async(req,res)=>{
    let {id,reviewid}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
    await review.findByIdAndDelete(reviewid);
         req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;