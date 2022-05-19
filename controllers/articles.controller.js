const {selectArticles, selectArticleComments, selectArticleById, insertComment, updateArticleVotes} = require('../models/articles.model.js');

exports.getArticles = (req, res, next) => {
    let {sort_by, order, topic} = req.query;
    
    if(sort_by === undefined){
        sort_by ='created_at';
        }
    if(order === undefined){
        order = 'DESC'
        }
    if(topic === undefined){
        topic = ''
        }
    else{
        topic = `WHEN topic = ${topic}`
        }
    selectArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({ articles })
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => res.status(200).send({ article }))
        .catch(next)
    }

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleComments(article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const commentData = req.body;
    commentData.article_id = req.params.article_id;
    insertComment(commentData)
    .then((comment) => {
        res.status(201).send( { comment })
    })
    .catch((err) => {
        next(err)
    })
};
exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    const votes = req.body.inc_votes
    updateArticleVotes(article_id, votes)
        .then((updatedArticle) => res.status(200).send({article: updatedArticle}))
        .catch(next)

    }