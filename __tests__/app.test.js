const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const index = require('../db/data/test-data/index');
const connection = require('../db/connection');
const fs = require('fs/promises');

beforeEach(() => {
    return seed(index);
});

afterAll(() => {
    return connection.end();
});

describe('/api/topics', () => {
    test('GET - status: 200 - returns the correct information', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(response.body.topics.length).toBe(3);
                response.body.topics.forEach((topic) => {
                    expect(typeof topic.slug).toBe('string');
                    expect(typeof topic.description).toBe('string');
                });
            });
    });
});

describe('/api', () => {
    test('GET - status: 200 - returns a JSON object with all available endpoints', () => {
        return fs
            .readFile(`${__dirname}/../endpoints.json`, 'utf8')
            .then((data) => {
                const expectedResponse = JSON.parse(data);
                return request(app)
                    .get('/api')
                    .expect(200)
                    .then((response) => {
                        expect(response.body).toEqual(expectedResponse);
                    });
            });
    });
    test('get - status: 404 - returns a error when endpoint is not found', () => {
        return request(app)
            .get('/api/nonsense')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('not found!');
            });
    });
});

describe('/api/articles/:article_id', () => {
    test('GET - status: 200 - responds with article with specified id', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const article = response.body.article;
                expect(article.article_id).toBe(1);
                expect(article.title).toBe(
                    'Living in the shadow of a great man'
                );
                expect(article.topic).toBe('mitch');
                expect(article.author).toBe('butter_bridge');
                expect(article.body).toBe('I find this existence challenging');
                expect(article.created_at).toBe('2020-07-09T20:11:00.000Z');
                expect(article.votes).toBe(100);
                expect(article.article_img_url).toBe(
                    'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                );
            });
    });
    test('GET - status: 400 - requested id is not valid', () => {
        return request(app)
            .get('/api/articles/nonsense')
            .expect(400)
            .then((response) => {
                expect(response.body).toEqual({ msg: 'bad request!' });
            });
    });
    test('GET - status: 404 - request is valid but not found', () => {
        return request(app)
            .get('/api/articles/100')
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual({ msg: 'article not found!' });
            });
    });
});

describe('/api/articles', () => {
    test('GET - status: 200 - returns the correct information', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                expect(response.body.articles.length).toBe(12);
            });
    });
    test('GET - status: 200 - all required columns are returned', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                response.body.articles.forEach((article) => {
                    expect(typeof article.author).toBe('string');
                    expect(typeof article.title).toBe('string');
                    expect(typeof article.article_id).toBe('number');
                    expect(typeof article.topic).toBe('string');
                    expect(typeof article.created_at).toBe('string');
                    expect(typeof article.votes).toBe('number');
                    expect(typeof article.article_img_url).toBe('string');
                    expect(typeof article.comment_count).toBe('number');
                });
            });
    });
    test('GET - status: 200 - sort by created_at', () => {
        return request(app)
            .get('/api/articles?sort_by=created_at')
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toBeSortedBy('created_at', {
                    descending: true,
                });
            });
    });
    test('GET - status: 200 - sort by created_at in descending order', () => {
        return request(app)
            .get('/api/articles?sort_by=created_at&order=desc')
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toBeSortedBy('created_at', {
                    descending: true,
                });
            });
    });
    test('GET - status: 400 - invalid sort criteria', () => {
        return request(app)
            .get('/api/articles?sort_by=DROP_TABLE')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('invalid sort query');
            });
    });
    test('GET - status: 400 - invalid order criteria', () => {
        return request(app)
            .get('/api/articles?order=nonsense')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('invalid order query');
            });
    });
});

describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        test('GET - status: 200 - responds with an array of comments for the given article_id', () => {
            return request(app)
                .get('/api/articles/3/comments')
                .expect(200)
                .then((response) => {
                    const comment = response.body.comment[0];
                    expect(comment.article_id).toBe(3);
                    expect(comment.comment_id).toBe(10);
                    expect(comment.votes).toBe(0);
                    expect(comment.created_at).toBe('2020-06-20T07:24:00.000Z');
                    expect(comment.author).toBe('icellusedkars');
                    expect(comment.body).toBe('git push origin master');
                    expect(response.body.comment).toBeSortedBy('created_at', {
                        descending: false,
                    });
                });
        });
        test('GET - status: 200 - responds with an empty array for an article_id that has no comments', () => {
            return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then((response) => {
                    expect(response.body.comment).toEqual([]);
                });
        });
        test('GET - status: 404 - request is valid but not found', () => {
            return request(app)
                .get('/api/articles/100/comments')
                .expect(404)
                .then((response) => {
                    expect(response.body).toEqual({
                        msg: 'article not found!',
                    });
                });
        });
        test('GET - status: 400 - requested id is not valid', () => {
            return request(app)
                .get('/api/articles/nonsense/comments')
                .expect(400)
                .then((response) => {
                    expect(response.body).toEqual({ msg: 'bad request!' });
                });
        });
    });
    describe('POST', () => {
        test('POST - status: 201 - responds with newly created comment', () => {
            const testComment = {
                username: 'icellusedkars',
                body: 'this is the best news ever!',
            };
            return request(app)
                .post('/api/articles/6/comments')
                .send(testComment)
                .expect(201)
                .then((response) => {
                    const postedComment = response.body.comment;
                    expect(postedComment.comment_id).toBe(19);
                    expect(postedComment.body).toBe(
                        'this is the best news ever!'
                    );
                    expect(postedComment.author).toBe('icellusedkars');
                    expect(postedComment.votes).toBe(0);
                    expect(typeof postedComment.created_at).toBe('string');
                });
        });
        test('POST - status: 404 - request is valid but not found', () => {
            const testComment = {
                username: 'icellusedkars',
                body: 'this is the best news ever!',
            };
            return request(app)
                .post('/api/articles/100/comments')
                .send(testComment)
                .expect(404)
                .then((response) => {
                    expect(response.body).toEqual({
                        msg: 'article not found!',
                    });
                });
        });
        test('POST - status: 400 - requested id is not valid', () => {
            const testComment = {
                username: 'icellusedkars',
                body: 'this is the best news ever!',
            };
            return request(app)
                .post('/api/articles/nonsense/comments')
                .send(testComment)
                .expect(400)
                .then((response) => {
                    expect(response.body).toEqual({ msg: 'bad request!' });
                });
        });
        test('POST - status: 400 - username is not valid', () => {
            const testComment = {
                username: 'jon123',
                body: 'this is the best news ever!',
            };
            return request(app)
                .post('/api/articles/6/comments')
                .send(testComment)
                .expect(400)
                .then((response) => {
                    expect(response.body).toEqual({
                        msg: 'user does not exist!',
                    });
                });
        });
    });
});

