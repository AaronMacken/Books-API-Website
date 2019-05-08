let express = require("express");
let app = express();
let port = 3000;
let request = require("request");
let bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


let reviews = [
  {
    image: "https://images-na.ssl-images-amazon.com/images/I/51l5XzLln%2BL._SX348_BO1,204,203,200_.jpg",
    name: "Cracking the Coding Interview",
    review: "Great Book! I learned SO MUCH!"
  }
];


app.get("/", (req, res) => {
  res.render("landing");
});


app.get("/searchbook", (req, res) => {
  key = req.query.key;
  let URL = "https://api.itbook.store/1.0/search/" + key;

  request(URL, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.render("searchbook", { info: info });
    }
  });
});


app.get("/reviews", (req, res) => {
  res.render("reviews", { reviews: reviews });
});

app.get("/reviews/new", (req, res) => {
  res.render("postbook");
});

app.post("/reviews", (req, res) => {
  let review = {
    image: req.body.image,
    name: req.body.title,
    review: req.body.review
  }
  reviews.push(review);
  res.redirect("reviews");
});

app.listen(port, () => console.log("Server is listeneing"));
