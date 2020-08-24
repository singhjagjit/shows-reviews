const router = require("express").Router();

const auth = require("../middleware/auth");
let Show = require("../models/show.model");
let Review = require("../models/review.model");

router.post("/search/", auth, async (req, res) => {
  try {
    const searchedKeyword = req.body.keyword;
    const shows = await Show.find({
      $or: [
        {
          primaryTitle: {
            $regex: ".*" + searchedKeyword + ".*",
            $options: "i",
          },
        },
        { startYear: { $regex: ".*" + searchedKeyword + ".*", $options: "i" } },
        { genres: { $regex: ".*" + searchedKeyword + ".*", $options: "i" } },
      ],
    }).limit(50);

    if (shows.length <= 0) throw Error("Sorry, no show found!");

    res.status(200).json(shows);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.get("/show/:id", auth, async (req, res) => {
  try {
    const tconst = req.params.id;
    const show = await Show.findOne({
      tconst: tconst,
    });
    if (!show) throw Error("No such show found");
    res.status(200).json(show);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.get("/showReviews/:id", auth, async (req, res) => {
  try {
    const tconst = req.params.id;
    const reviews = await Review.find({
      tconst: tconst,
    });
    if (!reviews) throw Error("No review!");
    res.status(200).json(reviews);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post("/addReview", auth, async (req, res) => {
  const review = req.body.review;
  const stars = req.body.stars;
  const username = req.body.username;
  const tconst = req.body.tconst;

  try {
    const user = await Review.findOne({ tconst: tconst, username: username });
    if (user) throw Error("User can only add one review for a show");

    const newReview = new Review({
      tconst,
      review,
      stars,
      username,
    });

    const savedReview = await newReview.save();
    if (!savedReview) throw Error("Something went wrong saving the review");

    res.status(200).json({
      msg: "Review added successfully",
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
