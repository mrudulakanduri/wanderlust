const express = require("express");
const router = express.Router({mergeParams:true});
const asyncwrap = require("../utils/asyncwrap.js");
const expresserror = require("../utils/expresserror.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing");
const review = require("../models/reviews.js");
const {isLoggedIn,isAuthor,validateReview} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



//review listing
router.post("/",isLoggedIn,validateReview,asyncwrap(reviewController.createReview));

//delete review 
router.delete("/:reviewid",isLoggedIn,isAuthor,asyncwrap(reviewController.deleteReview));

module.exports = router;