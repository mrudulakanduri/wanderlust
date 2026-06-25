const mongoose = require("mongoose");

const ListingSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
     image: {
        filename: { type: String },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
            set: (v) =>
                v === ""
                ? "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
                : v,
        },
    },
   
    price:Number,
    location:String,
    country:String,
});


const Listing = mongoose.model("Listing",ListingSchema);

module.exports=Listing;