const {
    selectArticleById,
    fetchArticles,
    selectCommentsByArticleId,
    updateArticleVotes,
} = require('../models/articles.models');
const { checkArticleExists } = require('../db/seeds/utils');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
    const { sort_by, order } = req.query;
    fetchArticles(sort_by, order)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id)
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch((err) => next(err));
};

exports.patchArticleVotesByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateArticleVotes(article_id, inc_votes)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => next(err));
};
