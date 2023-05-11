const {
    selectArticleById,
    selectCommentsByArticleId,
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

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id)
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch((err) => next(err));
};
