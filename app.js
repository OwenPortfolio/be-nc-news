const express = require('express');
const app = express();

app.use(express.json());

const {getTopics} = require('./controllers/topics.controller.js');

app.get('/api/topics', getTopics);


app.use((req, res, next) => {
    res.status(404);
    res.send({msg: 'Not Found'})
});


module.exports = app;