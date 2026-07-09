const Listing = require("../models/listing");
const review = require("../models/reviews");
 


module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
   await newReview.save();
   console.log(newReview);
   await listing.save();
        req.flash("success","New Review Added");
    res.redirect(`/listings/${listing._id}`)
};

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewid}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
    await review.findByIdAndDelete(reviewid);
         req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
};