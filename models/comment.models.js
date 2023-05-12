const connection = require('../db/connection');

exports.createComment = (newComment) => {
    const { article_id, username, body } = newComment;

    if (!article_id || !username || !body) {
        return Promise.reject({
            status: 400,
            msg: 'missing required field!',
        });
    }

    return connection
        .query('SELECT * FROM users WHERE username = $1', [username])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'user does not exist!',
                });
            }
            return connection
                .query('SELECT * FROM articles WHERE article_id = $1', [
                    article_id,
                ])
                .then((result) => {
                    if (result.rows.length === 0) {
                        return Promise.reject({
                            status: 404,
                            msg: 'article not found!',
                        });
                    }
                    return connection.query(
                        'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *',
                        [article_id, username, body]
                    );
                })
                .then((result) => {
                    return result.rows[0];
                });
        });
};
