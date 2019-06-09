var express = require("express");
var router = express.Router({mergeParams: true});

var Review = require("../models/review");
var Comment = require("../models/comment");  
var middleware = require("../middleware");

  

// Comment - Show new comment form
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
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

// Edit - show edit page
router.get("/:comment_id/edit",  middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {review_id:req.params.id, comment:foundComment});
    }
  });
});

// Update - comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,
    (err, updatedComment) => {
      if(err) {
        res.redirect("back");
      } else {
        res.redirect("/reviews/" + req.params.id);
      }
    });
});

// Destroy - comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err, deletedComment) => {
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/reviews/" + req.params.id);
    }
  });
});


module.exports = router;
