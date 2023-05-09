const connection = require('../db/connection');

exports.fetchTopics = () => {
    return connection.query('SELECT * FROM topics;').then((topics) => {
        return topics.rows;
    });
};
