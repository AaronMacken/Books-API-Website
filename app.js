// Require Variables
const express = require("express"),
  app = express(),
  port = 3000,
  request = require("request"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  Review = require("./models/review"),
  Comment = require("./models/comment"),
  seedDB = require("./seeds");

  // After seeding once, be sure to comment out. It will create a new ID each time it seeds, thus making previous show routes obsolete.
  // seedDB();

// App Configure
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Connect mongodb
mongoose.connect("mongodb://localhost:27017/barneys", {
  useNewUrlParser: true
});

// Landing Page //
app.get("/", (req, res) => {
  res.render("reviews/landing");
});

// api Index //
app.get("/searchbook", (req, res) => {
  key = req.query.key;
  let URL = "https://api.itbook.store/1.0/search/" + key;

  request(URL, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.render("reviews/apiIndex", { info: info });
    }
  });
});

// review Index //
app.get("/reviews", (req, res) => {
  Review.find({}, function (err, reviews) {
    if (err) {
      console.log("Something went wrong when trying to fetch the reviews.");
    } else {
      res.render("reviews/index", { reviews: reviews });
    }
  });
});


// Create
app.post("/reviews", (req, res) => {

  Review.create(req.body.post,
    function (err, newReview) {
      if (err) {
        console.log("Something went wrong when trying to post a review!");
      } else {
        console.log("Added a review for: " + newReview.name);
        res.redirect("/reviews");
      }
    }
  );
});

// New
app.get("/reviews/new", (req, res) => {
  var data = "";
  res.render("reviews/new", { data: data });
});

// Show
app.get("/reviews/:id", (req, res) => {
  Review.findById(req.params.id).populate('comments').exec((err, foundReview) => {
    if (err) {
      console.log(err);
    } else {
      res.render("reviews/show", { review: foundReview });
    }
  });
});

// Edit
app.get("/reviews/:id/edit", (req, res) => {
  Review.findById(req.params.id, (err, foundReview) => {
    if (err) {
      res.redirect("/reviews")
    } else {
      res.render("reviews/edit", { review: foundReview });
    }
  });
});

// Update
app.put("/reviews/:id", (req, res) => {
  Review.findByIdAndUpdate(req.params.id, req.body.post, (err, updatedReview) => {
    if(err){
      res.redirect("/reviews/" + req.params.id);
    }else{
      res.redirect("/reviews/" + req.params.id);
    }
  });
});

// Destroy
app.delete("/reviews/:id", (req, res) => {
  Review.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      res.redirect("/reviews");
    }else{
      res.redirect("/reviews");
    }
  });
});

// COMMENT ROUTES //

// Comment - form
app.get("/reviews/:id/comments/new", (req, res) => {
  Review.findById(req.params.id, (err, foundReview) => {
    if(err) console.log(err);
    else{
      res.render("comments/new", {review: foundReview});
    }
  });
});

// Comment - post
app.post("/reviews/:id/comments", (req, res) => {
  Review.findById(req.params.id, (err, review) => {
    if(err) console.log(err);
    else{
      Comment.create(req.body.comment, (err, comment) => {
        review.comments.push(comment);
        review.save();
        res.redirect("/reviews/" + review._id);
      })
    }
  });
});

app.listen(port, () => console.log("Server is listeneing"));

