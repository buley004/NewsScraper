// Dependencies
var express = require("express");
var logger = require("morgan");
var path = require("path");
var mongoose = require("mongoose");
var axios = require("axios");
var expshb = require("express-handlebars");
var cheerio = require("cheerio");

var app = express();
var PORT = process.env.PORT || 3000;

// Set the app up with morgan.
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Database configuration
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("it worked!");
});

//set up db schema
var newsSchema = mongoose.Schema({
  title: { type: String, unique: true },
  author: String,
  url: String,
  date: String,
  comments: [{ comment: { type: String, required: true }, commentDate: { type: Date, default: Date.now } }]
});

var Article = db.model("Article", newsSchema);

// Routes
// ======
//index route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

//api route to return articles
app.get("/api/articles", function (req, res) {
  Article.find({}, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

//return comments for a given article
app.get("/api/comments/:id", function (req, res) {
  Article.find({
    _id: req.params.id
  }, "comments", function (error, comments) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(comments);
    }
  });
});

//add a comment to an article
app.post("/api/comments", function (req, res) {
  
  Article.findOneAndUpdate(
    { _id: req.body.id },
    { $push: { comments: { comment: req.body.comment } } },
    function (err, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(res);
      }
    }
    );
    res.send(200);
});

//delete comment
app.get("/api/delete/:id", function (req, res) {
  console.log(req.params.id);
  //Delete the comment
  Article.update(
    {},
    { $pull: { comments: { _id: req.params.id } } },
    function (err, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(res);
      }
    }
  )
  res.send(200);
})

//scrape for articles
app.get("/scrape", function (req, res) {
  axios.get("https://www.thestranger.com/news").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".section-article").each(function (i, element) {
      // grab the info for each article
      var title = $(element).children(".col-xs-9").children(".headline").children("a").text();
      var url = $(element).children(".col-xs-9").children(".headline").children("a").attr("href");
      var author = $(element).children(".col-xs-9").children(".byline").text().trim().slice(3);
      var date = $(element).children(".col-xs-9").children(".article-post-date").text();

      //create new db document
      Article.create({
        title: title,
        url: url,
        author: author,
        date: date
      }, function (err, inserted) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(inserted);
        }
      });

    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});


// Listen
app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});