const mongoose = require("mongoose");
const review = require("./reviews.js");
const { listingSchema } = require("../schema");
const user = require("./user.js");

const ListingSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
     image: {
        filename: { type: String },
        url: {type:String},
    },
   
    price:Number,
    location:String,
    country:String,
    review:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "review",
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:["Number"],
            required:true
        },
    },
});

ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({
            _id: { $in: listing.review }
        });
         
    }
});
 
const Listing = mongoose.model("Listing",ListingSchema);

module.exports=Listing;

