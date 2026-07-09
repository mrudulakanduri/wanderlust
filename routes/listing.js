if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const router = express.Router({mergeParams:true});
const asyncwrap = require("../utils/asyncwrap.js");
const expresserror = require("../utils/expresserror.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/",asyncwrap(listingController.index));
router.get("/new",isLoggedIn, listingController.addNewListing );
router.get("/:id",asyncwrap(listingController.showEachListing));
router.post("/",upload.single("listing[image]"),validateListing,asyncwrap(listingController.postNewListing));
router.get("/:id/edit",isLoggedIn,isOwner,asyncwrap(listingController.editListing));
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,asyncwrap(listingController.postEditListing));
router.delete("/:id",isLoggedIn,isOwner,asyncwrap(listingController.deleteListing));

module.exports = router;