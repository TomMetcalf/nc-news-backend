const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getStatus } = require('./controllers/api.controllers');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getStatus);

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'not found!' });
});

module.exports = app;
