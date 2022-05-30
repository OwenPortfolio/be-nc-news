const express = require('express');
const app = express();

app.use(express.json());

const {getTopics} = require('./controllers/topics.controller.js');
const {getArticles, getArticleById, getArticleComments, postComment, patchArticleVotes} = require('./controllers/articles.controller.js');
const {getUsers} = require('./controllers/users.controller.js')
const {deleteComment} = require('./controllers/comments.controller.js')
const {getEndpoints} = require('./controllers/api.controller.js')

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getArticleComments);
app.post('/api/articles/:article_id/comments', postComment);
app.patch('/api/articles/:article_id', patchArticleVotes);

app.delete('/api/comments/:comment_id', deleteComment);

app.get('/api/users', getUsers);

app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Not Found'});
  });

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    } 
    else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.code === '22P02'){
        res.status(400)
        res.send({msg: 'Bad Request'}) 
     }
     else {
         next(err);
     }
});

app.use((err, req, res, next) => {
    if(err.code === '23503'){
        res.status(404)
        if(err.detail.endsWith('not present in table "users".')){
            res.send({msg: 'No Such User'})
        }
        else {
        res.send({msg: 'Article Not Found'})
        }
    }
    next(err);
})

app.use((err, req, res, next) => {
    if(err.code === '23502'){
        res.status(400)
        res.send({msg: 'Bad Request'})
    }
    next(err);
})

app.use((err, req, res, next) => {
    if(err.code === '42601'){
        res.status(400)
        res.send({msg: 'Bad Request'})
    }
    next(err);
})


module.exports = app;