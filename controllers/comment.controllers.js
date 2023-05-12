const { createComment, removeComment } = require('../models/comment.models');

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    createComment({ article_id, username, body })
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => next(err));
};
