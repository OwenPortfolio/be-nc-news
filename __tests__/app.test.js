const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data')

afterAll(() => {
return db.end();
});

beforeEach(() => seed(testData))

describe('1. GET /api/topics', () => {
    test('status: 200, returns an object containing an array of topic objects with slug and description properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeInstanceOf(Object)
            expect(body.topics).toHaveLength(3)
            body.topics.forEach((topic) => {
                expect(Object.keys(topic)).toEqual(['slug', 'description'])
            })
        })
    })
    test('status: 404, returns not found for an unknown path', () => {
        return request(app)
        .get('/api/blahblah')
        .expect(404)
        .then(( { body }) => {
            expect( body.msg ).toBe('Not Found');
        })
    })
})

describe('2. GET /api/articles/:article_id', () => {
    test('status: 200, returns an article according to chosen id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body).toBeInstanceOf(Object);
            expect(body.article).toEqual({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100
              })
        })
    })
    test('status 404, returns an error when pass a non-existent id', () => {
        return request(app)
        .get('/api/articles/2675')
        .expect(404)
        .then(({body}) =>{
            expect(body.msg).toBe('No article with that ID');
        })
    })
    test('status 400, returns an error when passed an invalid ID', () => {
        return request(app)
        .get('/api/articles/badid')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})