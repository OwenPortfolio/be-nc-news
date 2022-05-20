const db = require('../db/connection.js');

exports.selectArticles = (sort_by, order, topic) => {

    const validOrder = ['asc', 'desc'];
    const validSort = ['author', 'title', 'topic', 'created_at', 'votes', 'comment_count']

    const queries = []
    let queryStr = 'SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ';

    if(topic !== undefined){
        queries.push(topic);
        queryStr += ' WHERE articles.topic = $1'
    }
 
    queryStr += ' GROUP BY articles.article_id'
    
    if(sort_by !== undefined && validSort.includes(sort_by)){
        queryStr += ' ORDER BY ' + sort_by + ' ';
    } else {
        if(sort_by === undefined){
        queryStr += ' ORDER BY created_at '
        }
    }

    if(order !== undefined && validOrder.includes(order)){
        queryStr+= '' + order + ' ';
    } else {
        if(order === undefined){
        queryStr += 'DESC;'
        }
        else{
            return Promise.reject({
                status: 400,
                msg: 'Bad Request'
            }) 
        }
    }

    return db
    .query(queryStr, queries)
    .then((articles) => {
        if(!articles.rows[0]){
            return Promise.reject({
                status: 404,
                msg: 'Not Found'
            })
        }
        else {
            return articles.rows;
        }
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
    const {username, body, article_id} = commentData;
    return db.query('INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;', [username, body, article_id])
    .then((result) => {
        return result.rows[0];
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