var express = require("express");
var router = express.Router({mergeParams: true});

var Review = require("../models/review");
var Comment = require("../models/comment");  

  

// Comment - Show new comment form
router.get("/new", isLoggedIn, (req, res) => {
  Review.findById(req.params.id, (err, foundReview) => {
    if (err) console.log(err);
    else {
      res.render("comments/new", {
        review: foundReview,
        currentUser: req.user
      });
    }
  });
});

// Comment - New comment POST route
router.post("/", isLoggedIn, (req, res) => {
  Review.findById(req.params.id, (err, review) => {
    if (err) console.log(err);
    else {
      Comment.create(req.body.comment, (err, comment) => {

        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        
        review.comments.push(comment);
        review.save();
        res.redirect("/reviews/" + review._id);
      });
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
