const connection = require('../db/connection');

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

exports.fetchArticles = (sort_by = 'created_at', order = 'desc') => {
    const validSortQueries = ['created_at'];
    const validOrderQueries = ['asc', 'desc'];
    if (!validSortQueries.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'invalid sort query' });
    }
    if (!validOrderQueries.includes(order)) {
        return Promise.reject({ status: 400, msg: 'invalid order query' });
    }
    return connection
        .query(
            `SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at,articles.votes,articles.article_img_url,COUNT(comments.comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`
        )
        .then((articles) => {
            return articles.rows;
        });
};
