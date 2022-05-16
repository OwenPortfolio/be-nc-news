const res = require('express/lib/response');
const db = require('../db/connection.js');

exports.selectArticleById = (article_id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
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