const db = require('../db/connection.js');

exports.selectArticles = () => {
    return db
    .query('SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;')
    .then((articles) => {
            return articles.rows;
    })
}

exports.selectArticleById = (article_id) => {
    return db
    .query('SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id HAVING articles.article_id = $1;', [article_id])
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

exports.insertComment = (commentData) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [commentData.article_id])
    .then((articles) => {
        if(!articles.rows[0]){
            return Promise.reject({
                status: 404,
                msg: 'Not Found'
            })
        }
    })
    .then(() => {
        return db.query('SELECT * FROM users WHERE username = $1', [commentData.username])
        .then((users) => {
            if(!users.rows[0]){
                return Promise.reject({
                    status: 404,
                    msg: 'No Such User'
                })
            }
        })
    })
    .then(() => {
        const {username, body, article_id} = commentData;
        return db.query('INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;', [username, body, article_id])
        .then((result) => {
            return result.rows[0];
        })
    })

}

exports.selectArticleComments = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((articles) => {
        if(!articles.rows[0]){
            return Promise.reject({
                status: 404,
                msg: 'Not Found'
            })
        }
    })
    .then(() => {
        return db
        .query('SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id = $1', [article_id])
    .then((comments) => {
        return comments.rows;
        })
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