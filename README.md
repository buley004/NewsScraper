# NewsScraper

This app allows a user to view the latest news articles from the Seattle newspaper The Stranger, and leave comments on the article, as well as view comments that others have written.

Technologies used include Mongoose, jQuery, Node.JS, Express, and Cheerio.  Articles are scraped from The Stranger using Cheerio, and stored in a MongoDB via Mongoose.  Each comment is stored as a subdocument associated with an article in the MongoDB.

Deployed application can be viewed at https://newsscraperproject.herokuapp.com/ 

To add new articles to the deployed app, visit https://newsscraperproject.herokuapp.com/scrape 