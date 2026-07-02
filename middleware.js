const Listing = require("./models/listing");
const Review = require("./models/reviews");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in");
   return res.redirect("/login");
}
next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
};

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewid } = req.params;

    const review = await Review.findById(reviewid);

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You did not create this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};