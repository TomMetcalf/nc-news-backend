# Northcoders News API

## Project Summary

This API provides endpoints to access and manipulate data related to articles, comments, topics, and users.

The API also includes error handling middleware to handle 404 and 500 errors, as well as specific error types, such as bad requests and customized error messages.

## Hosted Version of API

https://nc-news-r5n7.onrender.com/api

Note: This may take a short while to load, due to hosting service restrictions.

## Setup Requirements

The minimum versions of Node.js and PostgreSQL needed to run the project are:

Node.js: version 16.0.0 or higher
PostgreSQL: version 9.6 or higher

It is recommended to use the latest stable versions of Node.js and PostgreSQL to ensure maximum compatibility and security.

## Setup Instructions

1. Clone the repository: git clone https://github.com/northcoders/be-nc-news.git

2. Install dependencies: npm install

3. Set up the database: npm run setup-dbs

4. Seed the database: npm run seed

5. Start the server: npm start

6. Run the tests: npm test

## Creating Environment Variables to run project locally

To be able to run this project locally, you'll need to set up the correct environment variables in order to connect to the required test and development databases.

You will need to set up two .env files at root level as follows.

.env.development

This should contain the following line of code...

PGDATABASE=nc_news

.env.test

This should contain the following line of code...

PGDATABASE=nc_news_test

## Current Working API Endpoints

The API currently supports the following endpoints:

-   /api/topics: retrieves all topics.
-   /api: retrieves API status information.
-   /api/articles/:article_id: retrieves an article by its ID.
-   /api/articles: retrieves all articles, which can be filtered by query parameters such as topic, author, and sort criteria.
-   /api/articles/:article_id/comments: retrieves all comments for a given article.
-   /api/articles/:article_id/comments: allows users to post a new comment to an article.
-   /api/articles/:article_id: allows users to update an article's vote count.
-   /api/comments/:comment_id: allows users to delete a comment by its ID.
-   /api/users: retrieves all users.
