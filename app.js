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
  User = require("./models/user"),
  flash = require("connect-flash");

// =================
// Require Routes
// =================
const reviewRoutes = require("./routes/reviews"),
      commentRoutes = require("./routes/comments"),
      indexRoutes = require("./routes/index");

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

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This makes req.user is available to all of our templates as currentUser.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// =================
// Use Routes
// =================
app.use("/reviews",reviewRoutes);
app.use("/reviews/:id/comments",commentRoutes);
app.use(indexRoutes);

app.listen(port, () => console.log("Server is listeneing"));
