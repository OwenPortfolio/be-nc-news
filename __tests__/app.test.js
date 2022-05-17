const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const { forEach } = require('../db/data/test-data/articles');

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
    test('status 404, returns an error when passed a non-existent id', () => {
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

describe('3. PATCH /api/articles/:article_id', () => {
    test('status: 200, successfully updates specified article votes', () => {
        return request(app)
        .patch('/api/articles/3')
        .send({inc_votes: 100})
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toBeInstanceOf(Object);
            expect(body.article).toEqual( {
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 100,
              })
        })
    })
    test('status 404, returns error when non existent id is passed', () => {
        return request(app)
        .patch('/api/articles/99999')
        .send({inc_votes: 100})
        .expect(404)
        .then(({body}) =>{
            expect(body.msg).toBe('No article with that ID');
        })
    })
    test('status 400, returns error when invalid id is passed', () => {
        return request(app)
        .patch('/api/articles/batman')
        .send({inc_votes: 100})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status 400, returns an error when invalid patch made', () => {
        return request(app)
        .patch('/api/articles/3')
        .send({hello: 'code checker'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status 400, returns an error when patch data is formated correctly but data type is wrong', () => {
        return request(app)
        .patch('/api/articles/3')
        .send({inc_votes: 'hotdogs'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})

describe.only('4. GET /api/users', () => {
    test('status: 200, returns an object containing an array of user objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body}) => {
            console.log(body)
            expect(body).toBeInstanceOf(Object)
            expect(body.user).toBeInstanceOf(Array)
            expect(body.user).toHaveLength(4)
            body.user.forEach((user) => {
                expect(typeof(user.username)).toBe('string')
            })
        })
    })
})