const {selectArticleById, updateArticleVotes} = require('../models/articles.model.js');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => res.status(200).send({ article }))
        .catch(next)
    }

exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    const votes = req.body.inc_votes
    updateArticleVotes(article_id, votes)
        .then((updatedArticle) => res.status(200).send({article: updatedArticle}))
        .catch(next)

    }