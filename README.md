# CNNscraper

Collect articles and review them from CNN!  This application will allow you to save, comment and manage articles for CNN website.

You can goto the deplyed app via heroku using the URL: https://dry-retreat-39633.herokuapp.com/

## Description

This application implements a express, mongoose, cheerio and node to provide a user friendly GUI that allows for a management of current articles from CNN. 

You can refresh the articles by using the "Scrape articles button"

## Install

To install the application, first clone this repository:

	https://github.com/peraltot/CNNscraper.git
	
Then install the for command line interaction.

	npm install --save

    Dependencies contain:
    "author": "Thomas Peralto",
    "body-parser": "^1.15.0",
    "cheerio": "^0.20.0",
    "express": "^4.13.4",
    "mongoose": "^4.4.6",
    "morgan": "^1.7.0",
    "request": "^2.69.0"

## Run

To run the application locally execute the following command:

	node server.js
    and 
    mongod in another terminal first
	
**Enjoy!**