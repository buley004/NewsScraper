// Dependencies
var express = require("express");
var logger = require("morgan");
var path = require("path");
var mongoose = require("mongoose");
var axios = require("axios");
var expshb = require("express-handlebars");
var cheerio = require("cheerio");

var app = express();

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
  date: String
});

var Article = db.model("Article", newsSchema);

// Routes
// ======

//scrape for articles
app.get("/scrape", function (req, res) {
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://www.thestranger.com/news").then(function (response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // For each element with a "title" class
    $(".section-article").each(function (i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children(".col-xs-9").children(".headline").children("a").text();
      var url = $(element).children(".col-xs-9").children(".headline").children("a").attr("href");
      var author = $(element).children(".col-xs-9").children(".byline").text().trim();
      var date = $(element).children(".col-xs-9").children(".article-post-date").text();

      Article.create({
        title: title,
        url: url,
        author: author,
        date: date
      }, function (err, inserted) {
        if (err) {
          // Log the error if one is encountered during the query
          console.log(err);
        }
        else {
          // Otherwise, log the inserted data
          console.log(inserted);
        }
      });

    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});


// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});