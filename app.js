const express = require('express');
const app = express();

app.use(express.json());

const {getTopics} = require('./controllers/topics.controller.js');
const {getArticles, getArticleById, getArticleComments, patchArticleVotes} = require('./controllers/articles.controller.js');
const {getUsers} = require('./controllers/users.controller.js')

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getArticleComments)
app.patch('/api/articles/:article_id', patchArticleVotes);

app.get('/api/users', getUsers);

app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Not Found'});
  });

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    else if (err.code === '22P02'){
       res.status(400)
       res.send({msg: 'Bad Request'}) 
    }
    else if (!err) {
        res.status(404)
        res.send({msg: 'Not Found'})
    }
});

module.exports = app;