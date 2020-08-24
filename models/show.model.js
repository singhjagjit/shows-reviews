const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const showSchema = new Schema({
  tconst: { type: String },
  primaryTitle: { type: String },
  startYear: { type: String },
  genres: { type: String },
});

const Show = mongoose.model("Show", showSchema);

module.exports = Show;
