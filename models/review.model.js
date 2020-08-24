const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  tconst: { type: String, required: true },
  review: { type: String, required: true },
  stars: { type: String, required: true },
  username: { type: String, required: true },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
