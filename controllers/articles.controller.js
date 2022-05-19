const {selectArticles, selectArticleComments, selectArticleById, updateArticleVotes} = require('../models/articles.model.js');

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
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
exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    const votes = req.body.inc_votes
    updateArticleVotes(article_id, votes)
        .then((updatedArticle) => res.status(200).send({article: updatedArticle}))
        .catch(next)

    }