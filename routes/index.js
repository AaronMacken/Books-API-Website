

var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    request = require("request");

var User = require("../models/user");

// Landing Page
router.get("/", (req, res) => {
  res.render("reviews/landing");
});

// API Index
router.get("/searchbook", (req, res) => {
  key = req.query.key;
  let URL = "https://api.itbook.store/1.0/search/" + key;

  request(URL, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.render("reviews/apiIndex", { info: info, key: key});
    } else {
      console.log(error);
    }
  });
});

// ================
// Register Routes
// ================

// Show register form
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// Register POST route
router.post("/register", (req, res) => {
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
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Login POST route
router.post(
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
router.get("/logout", (req, res) => {
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

module.exports = router;