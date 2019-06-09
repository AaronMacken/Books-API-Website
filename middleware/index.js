var Review = require("../models/review");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkPostOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Review.findById(req.params.id, (err, foundReview) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundReview.author.id.equals(req.user._id)) {
          next();
          // res.render("reviews/edit", { review: foundReview });
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

module.exports = middlewareObj;
