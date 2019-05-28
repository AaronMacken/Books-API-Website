var mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  author: String,
  image: String,
  name: String,
  review: String,
  comments: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
      }
  ]
});
module.exports = mongoose.model("Review", reviewSchema);