let express = require("express");
let app = express();
let port = 3000;
let request = require("request");
let bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/searchbook", (req, res) => {
  key = req.query.key;
  let URL = "https://api.itbook.store/1.0/search/" + key;

  request(URL, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info);
      res.render("searchbook", { info: info });
    }
  });
});

app.get("/reviews", (req, res) => {
  res.render("reviews");
});

app.get("/postbook", (req, res) => {
  res.render("postbook");
});

app.listen(port, () => console.log("Server is listeneing"));
