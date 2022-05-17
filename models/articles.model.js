const res = require('express/lib/response');
const db = require('../db/connection.js');

exports.selectArticleById = (article_id) => {
    return db
    .query(`SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id HAVING articles.article_id = $1;`, [article_id])
    .then((article) => {
        if(!article.rows[0]){
            return Promise.reject({
                status: 404,
                msg: 'No article with that ID'
            })
        }
        else {
            return article.rows[0];
        }
    })
}

exports.updateArticleVotes = (article_id, votes) => {
    if(Number.isInteger(votes)){
        return db
        .query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [votes, article_id])
        .then((article) => {
            if(!article.rows[0]){
                return Promise.reject({
                    status: 404,
                    msg: 'No article with that ID'
                })
            }
            else {
                return article.rows[0];
            }
        })
    } else {
        return Promise.reject({
            status: 400,
            msg: 'Bad Request'
        })
    }
}