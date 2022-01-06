const mongoose = require("mongoose");

try {
    mongoose.connect("mongodb://127.0.0.1:27027/ArcCal",{useNewUrlParser: true, useUnifiedTopology: true})
    console.log("Connected successfully !");
} catch (err) {
    console.log(err);
    throw err;

}