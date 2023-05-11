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
                    .then((response) => {
                        expect(response.status).toBe(200);
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
                expect(response.body).toEqual({ msg: 'Bad Request' });
            });
    });
    test('GET - status: 404 - request in valid but not found', () => {
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
