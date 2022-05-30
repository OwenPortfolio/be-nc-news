const { readEndpoints } = require('../models/api.js');

exports.getEndpoints = (req, res, next) => {
    readEndpoints().then((endpoints) => {
        res.status(200).send(endpoints);
    }).catch((err) => {
        next(err);
    })
}