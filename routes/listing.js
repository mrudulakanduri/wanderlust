if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const Listing = require("../models/listing");
const router = express.Router({mergeParams:true});
const asyncwrap = require("../utils/asyncwrap.js");
const expresserror = require("../utils/expresserror.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware");
const { populate } = require("../models/user.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });





//all listings
router.get("/",asyncwrap(listingController.index));

//add new listing
router.get("/new",isLoggedIn, listingController.addNewListing );

//show each listing
router.get("/:id",asyncwrap(listingController.showEachListing));

//added new listing
router.post("/",upload.single("listing[image]"),validateListing,asyncwrap(listingController.postNewListing));

//edit listing
router.get("/:id/edit",isLoggedIn,isOwner,asyncwrap(listingController.editListing));

//edited listing
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,asyncwrap(listingController.postEditListing));

//delete listing
router.delete("/:id",isLoggedIn,isOwner,asyncwrap(listingController.deleteListing));


module.exports = router;