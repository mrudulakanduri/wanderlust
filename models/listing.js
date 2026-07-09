const mongoose = require("mongoose");;

const reviewSchema = new mongoose.Schema({
    comment:{
        type:String,
    },
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
});

const review = new mongoose.model("review",reviewSchema);

module.exports = review;