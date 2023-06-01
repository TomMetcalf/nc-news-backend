const connection = require('../db/connection');
const { checkArticleExists } = require('../db/seeds/utils');

exports.selectArticleById = (article_id) => {
    return connection
        .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'article not found!',
                });
            }
            return result.rows[0];
        });
};

exports.fetchArticles = (
    topic = null,
    sort_by = 'created_at',
    order = 'desc'
) => {
    const validSortQueries = ['created_at', 'comment_count', 'votes'];
    const validOrderQueries = ['asc', 'desc'];
    const validTopics = [
        'mitch',
        'cats',
        'paper',
        'coding',
        'football',
        'cooking',
    ];
    if (!validSortQueries.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'invalid sort query' });
    }
    if (!validOrderQueries.includes(order)) {
        return Promise.reject({ status: 400, msg: 'invalid order query' });
    }
    if (topic && !validTopics.includes(topic)) {
        return Promise.reject({ status: 400, msg: 'invalid topic' });
    }
    let query = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

    if (topic) {
        query += ` WHERE articles.topic = '${topic}'`;
    }

    query += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

    return connection.query(query).then((articles) => {
        return articles.rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
    let queryStr =
        'SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE comments.article_id = $1 ORDER BY comments.article_id DESC;';

    return checkArticleExists(article_id)
        .then(() => {
            return connection.query(queryStr, [article_id]);
        })
        .then((result) => {
            return result.rows;
        });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
    if (!article_id || !inc_votes) {
        return Promise.reject({
            status: 400,
            msg: 'missing required field!',
        });
    }
    return connection
        .query(
            `
            UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *
            `,
            [inc_votes, article_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'article not found!',
                });
            }
            return result.rows[0];
        });
};
