const express = require("express");
const Listing = require("../models/listing");
const router = express.Router({mergeParams:true});
const asyncwrap = require("../utils/asyncwrap.js");
const expresserror = require("../utils/expresserror.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const {isLoggedIn,isOwner} = require("../middleware");
const { populate } = require("../models/user.js");




const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expresserror(404,error);
    }
    else
        next();

}


//all listings
router.get("/",asyncwrap(async(req,res)=>{
    const alllists=await Listing.find({})
    res.render("listings/index.ejs",{alllists});
}));

//add new listing
router.get("/new",isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
});

//show each listing
router.get("/:id",asyncwrap(async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id).populate({
        path:"review",
        populate:{
            path:"author"
        },
        })
        .populate("owner");
    if(!list){
        req.flash("error","The Listing you are requesting for is not available!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});

}));

//added new listing
router.post("/",validateListing,asyncwrap(async(req,res)=>{
    let {listing} = req.body;
    let newlisting = new Listing(listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
}));

//edit listing
router.get("/:id/edit",isLoggedIn,isOwner,asyncwrap(async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
     if(!list){
        req.flash("error","The Listing you are requesting for is not available!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs",{list});
   
}));

//edited listing
router.put("/:id",isLoggedIn,isOwner,validateListing,asyncwrap(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
     req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}));

//delete listing
router.delete("/:id",isLoggedIn,isOwner,asyncwrap(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}));


module.exports = router;