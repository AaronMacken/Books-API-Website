let express = require("express");
let app = express();
let port = 3000;
let request = require("request");
let bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/searchbook", (req, res) => {
    res.render("searchbook");
});

app.get("/reviews", (req, res) => {
    res.render("reviews");
});

app.get("/postbook", (req, res) => {
    res.render("postbook");
});



app.listen(port, () => console.log("Server is listeneing"));