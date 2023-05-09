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
