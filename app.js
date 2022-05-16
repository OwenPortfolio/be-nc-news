const express = require('express');
const app = express();

app.use(express.json());

const {getTopics} = require('./controllers/topics.controller.js');
const {getArticleById} = require('./controllers/articles.controller.js');


app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Not Found'});
  });

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    else if (!err) {
        res.status(404)
        res.send({msg: 'Not Found'})
    }
});

module.exports = app;