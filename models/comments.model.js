const res = require('express/lib/response')
const db = require('../db/connection.js')

exports.removeComment = (comment_id) => {
    return db.query('DELETE FROM comments where comment_id = $1', [comment_id])
    .then((result) => {
        if(result.rowCount === 0){
            return Promise.reject({
                status: 404,
                msg: 'Not Found'
            })
        }
    })
}