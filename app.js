// Require Variables
const express = require("express"),
  app = express(),
  port = 3000,
  request = require("request"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override");


// App Configure
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


// Mongo DB Setup 
mongoose.connect("mongodb://localhost:27017/barneys", {
  useNewUrlParser: true
});
const reviewSchema = new mongoose.Schema({
  image: String,
  name: String,
  review: String
});
let Review = mongoose.model("Review", reviewSchema);


// Landing Page //
app.get("/", (req, res) => {
  res.render("landing");
});

// api Index //
app.get("/searchbook", (req, res) => {
  key = req.query.key;
  let URL = "https://api.itbook.store/1.0/search/" + key;

  request(URL, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.render("apiIndex", { info: info });
    }
  });
});

// review Index //
app.get("/reviews", (req, res) => {
  Review.find({}, function (err, reviews) {
    if (err) {
      console.log("Something went wrong when trying to fetch the reviews.");
    } else {
      res.render("index", { reviews: reviews });
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
  res.render("new", { data: data });
});

// Show
app.get("/reviews/:id", (req, res) => {
  Review.findById(req.params.id, (err, foundReview) => {
    if (err) {
      console.log("Something went wrong when loading the reviews");
    } else {
      res.render("show", { review: foundReview });
    }
  });
});

// Edit
app.get("/reviews/:id/edit", (req, res) => {
  Review.findById(req.params.id, (err, foundReview) => {
    if (err) {
      res.redirect("/reviews")
    } else {
      res.render("edit", { review: foundReview });
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


app.listen(port, () => console.log("Server is listeneing"));

// Initial addition to DB, added once.
// Review.create({
//   image:"https://images-na.ssl-images-amazon.com/images/I/51l5XzLln%2BL._SX348_BO1,204,203,200_.jpg",
//   name: "Cracking the Coding Interview",
//   review: "Great Book! I learned SO MUCH!"
// }, function(err, newReview){
//   if(err){
//     console.log("Something went wrong creating the review!");
//   }else{
//     console.log("Added: "+ newReview.name);
//   }
// });