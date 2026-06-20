const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodoverride=require("method-override");
const ejsmate = require("ejs-mate");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.engine("ejs",ejsmate);

main().then(()=>{
    console.log("connection sucessful");
}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}


app.get("/listings",async(req,res)=>{
    const alllists=await Listing.find({})
    res.render("listings/index.ejs",{alllists});
});

app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/show.ejs",{list});

});

app.post("/listings",async(req,res)=>{
    let {listing} = req.body;
    let newlisting = new Listing(listing);
    await newlisting.save();
    res.redirect("/listings");
});

app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
   
});

app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.get("/",(req,res)=>{
    res.send("Root is Working");
});

app.listen(8080,()=>{
    console.log("app is listening on the port 8080");
});