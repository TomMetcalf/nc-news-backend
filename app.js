const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getStatus } = require('./controllers/api.controllers');
const {
    getArticleById,
    getArticles,
    getCommentsByArticleId,
} = require('./controllers/articles.controllers');
const { postComment } = require('./controllers/comment.controllers');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getStatus);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'bad request!' });
    } else next(err);
});


app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
});

app.use((err, req, res, next) => {
    console.log(err);
    console.log(err.code);
    res.status(500).send({ msg: 'Internal Server Error!' });
});

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'not found!' });
});

module.exports = app;
