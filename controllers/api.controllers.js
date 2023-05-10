const endpoints = require('../endpoints.json');

exports.getStatus = (req, res) => {
    res.status(200).send(endpoints);
};
