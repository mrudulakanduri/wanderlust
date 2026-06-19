const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


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

app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/show.ejs",{list});

});

app.get("/",(req,res)=>{
    res.send("Root is Working");
});

app.listen(8080,()=>{
    console.log("app is listening on the port 8080");
});