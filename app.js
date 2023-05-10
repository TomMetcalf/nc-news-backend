const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getStatus } = require('./controllers/api.controllers');
const { getArticleById } = require('./controllers/articles.controllers');
const app = express();

app.get('/api/topics', getTopics);
app.get('/api', getStatus);
app.get('/api/articles/:article_id', getArticleById);

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request' });
    } else next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg });
    next(err);
});

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'not found!' });
});

module.exports = app;
