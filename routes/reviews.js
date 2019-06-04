var express = require("express"),
  router = express.Router();

var Review = require("../models/review");

// Review Index
router.get("/", (req, res) => {
  Review.find({}, function(err, reviews) {
    if (err) {
      console.log("Something went wrong when trying to fetch the reviews.");
    } else {
      res.render("reviews/index", { reviews: reviews });
    }
  });
});

// New - Show new review form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("reviews/new", { currentUser: req.user });
});

// Create - new review POST route
router.post("/", isLoggedIn, (req, res) => {
  var author = {id: req.user._id, username: req.user.username}
  var reviewObj = {
    name: req.body.review.name,
    image: req.body.review.image,
    review: req.body.review.review,
    author: author
  }
  Review.create(reviewObj, function(err, newReview) {
    if (err) {
      console.log("Something went wrong when trying to post a review!");
      console.log(err);
    } else {
      console.log("Added a review for: " + newReview.name);
      res.redirect("/reviews");
    }
  });
});

// Show
router.get("/:id", (req, res) => {
  Review.findById(req.params.id)
    .populate("comments")
    .exec((err, foundReview) => {
      if (err) {
        console.log(err);
      } else {
        res.render("reviews/show", { review: foundReview });
      }
    });
});

// Edit - Show edit review form
router.get("/:id/edit", isLoggedIn, (req, res) => {
  Review.findById(req.params.id, (err, foundReview) => {
    if (err) {
      res.redirect("/reviews");
    } else {
      res.render("reviews/edit", { review: foundReview });
    }
  });
});

// Update - Edit review PUT route
router.put("/:id", isLoggedIn, (req, res) => {
  Review.findByIdAndUpdate(
    req.params.id,
    req.body.review,
    (err, updatedReview) => {
      if (err) {
        res.redirect("/reviews/" + req.params.id);
      } else {
        res.redirect("/reviews/" + req.params.id);
      }
    }
  );
});

// Destroy
router.delete("/:id", isLoggedIn, (req, res) => {
  Review.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/reviews");
    } else {
      res.redirect("/reviews");
    }
  });
});

// Middleware for verifying a logged in user
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
