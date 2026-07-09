const Listing = require("../models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    const alllists=await Listing.find({});
    res.render("listings/index.ejs",{alllists});
};

module.exports.addNewListing = async (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showEachListing = async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id).populate({
        path:"review",
        populate:{ path:"author" },
        }).populate("owner");
    if(!list){
        req.flash("error","The Listing you are requesting for is not available!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
};

module.exports.postNewListing = async(req,res)=>{
   let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
   }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    let {listing} = req.body;
    let newlisting = new Listing(listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    newlisting.geometry = response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
};

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
     if(!list){
        req.flash("error","The Listing you are requesting for is not available!");
        return res.redirect("/listings");
    }
    let originalUrl = list.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{list,originalUrl});
};

module.exports.postEditListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,req.body.listing);
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
};