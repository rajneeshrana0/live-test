const mongoose = require("mongoose");
const uri = "mongodb+srv://rajputtejaswa12:MYTt1RkRabkOyhzU@cluster0.9ruyzih.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
function main() {
    mongoose.connect(uri).then(() => {
        console.log("Successful connection to MongoDB");
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
}

module.exports = { main };
