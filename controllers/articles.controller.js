const {selectArticles, selectArticleComments, selectArticleById, insertComment, updateArticleVotes} = require('../models/articles.model.js');

exports.getArticles = (req, res, next) => {
    let {sort_by, order, topic} = req.query;
    const validQueries = ['sort_by', 'order', 'topic']
    const queries = Object.keys(req.query);

    if(queries.length > 0){
        queries.forEach((query) => {
            if(validQueries.includes(query) === false){
            return res.status(400).send({msg: 'Bad Request'})
            }
        })
    }

    selectArticles(sort_by, order, topic)
        .then((articles) => res.status(200).send({ articles }))
        .catch(next)
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