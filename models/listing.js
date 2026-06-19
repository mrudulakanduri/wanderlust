const mongoose = require("mongoose");

const listingSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
     image: {
        filename: { type: String },
        url: {
            type: String,
            default: "https://www.dreamstime.com/stock-photo-nature-river-side-photography-nd-some-random-clicks-image78857225",
            set: (v) =>
                v === ""
                ? "https://www.dreamstime.com/stock-photo-nature-river-side-photography-nd-some-random-clicks-image78857225"
                : v,
        },
    },
   
    price:Number,
    location:String,
    country:String,
});


const listing = mongoose.model("listing",listingSchema);

module.exports=listing;