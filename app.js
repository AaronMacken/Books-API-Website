// =================
// Require Variables
// =================
const express = require("express"),
  app = express(),
  port = 3000,
  request = require("request"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  seedDB = require("./seeds"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  Review = require("./models/review"),
  Comment = require("./models/comment"),
  User = require("./models/user");

// Run this function once then comment out to prevent new data being seeded each time.
 // seedDB();

// =============
// App Configure
// =============
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  require("express-session")({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false
  })
);

// ================
// Connect mongodb
// ================
mongoose.connect("mongodb://localhost:27017/barneys", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// ===============
// Passport Setup
// ===============
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This makes req.user is available to all of our templates as currentUser.
// Used to manipulate which auth options the header EJS file shows.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ============
// Main Routes
// ============

// Landing Page
app.get("/", (req, res) => {
  res.render("reviews/landing");
});

// API Index
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

// Review Index
app.get("/reviews", (req, res) => {
  Review.find({}, function(err, reviews) {
    if (err) {
      console.log("Something went wrong when trying to fetch the reviews.");
    } else {
      res.render("reviews/index", { reviews: reviews });
    }
  });
});

// New - Show new review form
app.get("/reviews/new", isLoggedIn, (req, res) => {
  res.render("reviews/new", {currentUser: req.user});
});

// Create - new review POST route
app.post("/reviews", isLoggedIn, (req, res) => {
  Review.create(req.body.post, function(err, newReview) {
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
app.get("/reviews/:id", (req, res) => {
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
app.get("/reviews/:id/edit", isLoggedIn, (req, res) => {
  Review.findById(req.params.id, (err, foundReview) => {
    if (err) {
      res.redirect("/reviews");
    } else {
      res.render("reviews/edit", { review: foundReview });
    }
  });
});

// Update - Edit review PUT route
app.put("/reviews/:id", isLoggedIn, (req, res) => {
  Review.findByIdAndUpdate(
    req.params.id,
    req.body.post,
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
app.delete("/reviews/:id", isLoggedIn, (req, res) => {
  Review.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/reviews");
    } else {
      res.redirect("/reviews");
    }
  });
});

// ================
// Comment Routes
// ================

// Comment - Show new comment form
app.get("/reviews/:id/comments/new", isLoggedIn, (req, res) => {
  Review.findById(req.params.id, (err, foundReview) => {
    if (err) console.log(err);
    else {
      console.log(req.user);
      res.render("comments/new", {
         review: foundReview,
         currentUser: req.user
       });
    }
  });
});

// Comment - New comment POST route
app.post("/reviews/:id/comments", isLoggedIn, (req, res) => {
  Review.findById(req.params.id, (err, review) => {
    if (err) console.log(err);
    else {
      Comment.create(req.body.comment, (err, comment) => {
        review.comments.push(comment);
        review.save();
        res.redirect("/reviews/" + review._id);
      });
    }
  });
});

// ================
// Register Routes
// ================

// Show register form
app.get("/register", (req, res) => {
  res.render("auth/register");
});

// Register POST route
app.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("auth/register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/");
    });
  });
});

// =============
// Login Routes
// =============

// Show login form
app.get("/login", (req, res) => {
  res.render("auth/login");
});

// Login POST route
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

// =============
// Login Routes
// =============

// Logout route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Middleware for verifying a logged in user
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(port, () => console.log("Server is listeneing"));
