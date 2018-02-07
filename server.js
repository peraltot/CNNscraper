// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var Saved = require("./models/Saved.js");
var request = require("request");
var cheerio = require("cheerio");

var path = require("path");

mongoose.Promise = Promise;

var port = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

var port = process.env.PORT || 3000;

// Database configuration with mongoose
// ======
var databaseUri = "mongodb://localhost/CNNscraper";

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function () {
    console.log("Mongoose connection successful.");
});

// Routes
// ======

app.post("/saved:id", function (req, res) {
    // Create a new saved and pass the req.body to the entry
    var newSaved = new Saved(req.body);

    // And save the new note the db
    newSaved.save(function (error, doc) {
        // Log any errors
        if (error) {
            console.log(error // Otherwise
            );
        } else {
            // Use the article id to find and update it's note
            Article.findOneAndUpdate({
                "_id": req.params.id
            }, { "saved": true })
                // Execute the above query
                .exec(function (err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    } else {
                        // Or send the document to the browser
                        console.log("saved the article");
                        res.send(doc);
                    }
                });
        }
    });

});

app.post("/delete/:id", function (req, res) {
    // Delete or remove a saved article

    // Use the article id to find and update it's saved property
    Article.findOneAndUpdate({
        "_id": req.params.id
    }, { "saved": false })
        // Execute the above query
        .exec(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            } else {
                // Or send the document to the browser
                console.log("deleted the article");
                res.send(doc);
            }
        });
}

);


// A GET request to scrape the echojs website
app.get("/scrape", function (req, res) {

    request("https://www.cnn.com/articles/", function (error, response, html) {
        var $ = cheerio.load(html);
        $("h3.cd__headline").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children().text();
            result.link = $(this).children().attr("href");
            result.saved = false;

            // Passes the result object to the entry (and the title and link)
            var entry = new Article(result);

            // Now, save that entry to the db
            entry.save(function (err, doc) {
                // Log any errors
                if (err) {
                    console.log(err
                    );
                } else {

                    console.log(doc);

                }
            });

        });

        res.send("test");
    });
});



// This will get the articles we scraped from the mongoDB
app.get("/articles", function (req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function (error, doc) {
        // Log any errors
        if (error) {
            console.log(error // Or send the doc to the browser as a json object
            );
        } else {
            res.json(doc);
        }
    });
});

//Grab all saved articles
app.get("/saved", function (req, res) {
    // Grab every doc in the Articles array
    Article.find({ "saved": true }, function (error, doc) {
        // Log any errors
        if (error) {
            console.log(error // Or send the doc to the browser as a json object
            );
        } else {
            res.json(doc);
        }
    });
});

// Grab an article by it's ObjectId
app.get("/savedArticles/:id", function (req, res) {
    console.log("Req.params.id: " + req.params.id);
    Article.findOne({ "_id": req.params.id })
        .populate("note")
        .exec(function (error, doc) {
            // Log any errors
            if (error) {
                console.log(error 
                );
            } else {
                res.json(doc);
            }
        });
});

// Create a new note or replace an existing note
app.post("/savedArticles/:id", function (req, res) {
    var newNote = new Note(req.body);

    // And save the new note the db
    newNote.save(function (error, doc) {
        // Log any errors
        if (error) {
            console.log(error // Otherwise
            );
        } else {
            // Use the article id to find and update it's note
            Article.findOneAndUpdate({
                "_id": req.params.id
            }, { "note": doc._id })
                // Execute the above query
                .exec(function (err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(doc);
                    }
                });
        }
    });
});

app.get("/savedArticles", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/savedArticles.html"));
});

app.listen(port, function () {
    console.log("App running on port 3000 !");
});
