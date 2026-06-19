const express = require("express");
const app = express();
const mongoose = require("mongoose");


main().then(()=>{
    console.log("connection sucessful");
}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}
 
app.get("/",(req,res)=>{
    res.send("Root is Working");
});

app.listen(8080,()=>{
    console.log("app is listening on the port 8080");
});