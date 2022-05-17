const {selectUsers} = require('../models/users.model.js');

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((user) => res.status(200).send({user}))
    .catch(next)
}