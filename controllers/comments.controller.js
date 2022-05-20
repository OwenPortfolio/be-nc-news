const {removeComment} = require('../models/comments.model.js')

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params;
    return removeComment(comment_id)
        .then(() => {res.status(204)
        .send({})
    }).catch(next)
}