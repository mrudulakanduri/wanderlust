const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connection sucessful");
}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

const initDB =async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:"6a44d812baa09aac14596a2d"}));
    await Listing.insertMany(initdata.data);
    console.log("data is sucessfully initialized");
    
};


initDB();