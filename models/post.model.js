var mongoose = require("mongoose");
var postSchema = new mongoose.Schema({
    title: String,
    body:String,
    topic:[]
})
module.exports = mongoose.model("post",postSchema,"posts")