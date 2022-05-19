const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

require('jest-sorted');

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
            expect(body.article).toEqual(expect.objectContaining({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100
              }))
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

describe('4. GET /api/users', () => {
    test('status: 200, returns an object containing an array of user objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body}) => {
            expect(body).toBeInstanceOf(Object)
            expect(body.user).toBeInstanceOf(Array)
            expect(body.user).toHaveLength(4)
            body.user.forEach((user) => {
                expect(typeof(user.username)).toBe('string')
                expect(typeof(user.name)).toBe('string')
                expect(typeof(user.avatar_url)).toBe('string')
            })
        })
    })
    test('status: 404, returns error when passed a non existent path', () => {
        return request(app)
        .get('/api/doozers')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
})

describe('5. GET /api/articles/:article_id comment count', () => {
    test('status: 200 article objects now contain comment counts', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toBeInstanceOf(Object)
            expect(body.article).toEqual(expect.objectContaining({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                comment_count: '11'
              }))
        })
    })
})

describe('6. GET /api/articles - Retrieve all articles with comment count', () => {
    test('status: 200, should retrieve all articles and comment counts in array', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body).toBeInstanceOf(Object)
            expect(body.articles).toHaveLength(12)
            body.articles.forEach((article) => {
                expect(typeof(article.article_id)).toBe('number')
                expect(typeof(article.author)).toBe('string')
                expect(typeof(article.title)).toBe('string')
                expect(typeof(article.topic)).toBe('string')
                expect(typeof(Date.parse(article.created_at))).toBe('number')
                expect(typeof(article.votes)).toBe('number')
                expect(typeof(article.comment_count)).toBe('string')
                expect(typeof(article.body)).toBe('undefined')
            })
        })
    })
    test('article author should be username', () => {
        let usernames = ['rogersop', 'icellusedkars', 'butter_bridge', 'lurker']
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            body.articles.forEach((article) =>{
                expect(usernames.includes(article.author)).toBe(true);
            })
        })
    })
    test('articles should be sorted by date', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            let lastDate = Date.parse('2020-11-03T09:12:00.001Z');
            body.articles.forEach((article) => {
                expect(Date.parse(article.created_at)).toBeLessThan(lastDate);
                lastDate = Date.parse(article.created_at)
            })
        })
    })
})

describe('7. GET /api/articles/:article_id/comments', () => {
    test('status: 200, should retrieve an array of comments from a given article id', () => {
        let usernames = ['rogersop', 'icellusedkars', 'butter_bridge', 'lurker']
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toBeInstanceOf(Array)
            expect(body.comments).toHaveLength(11)
            body.comments.forEach((comment) => {
                expect(typeof(comment.comment_id)).toBe('number')
                expect(typeof(comment.body)).toBe('string')
                expect(typeof(comment.votes)).toBe('number')
                expect(typeof(Date.parse(comment.created_at))).toBe('number')
                expect(usernames.includes(comment.author)).toBe(true);
            })
            expect()
        })
    })
    test('status: 200, should return an empty array when no comments found', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments.length).toBe(0);
        })
    })
    test('status: 404, should return error when no such article_id', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
    test('status: 400, should return an error when bad request made', () => {
        return request(app)
        .get('/api/articles/three/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})

describe('8. POST /api/articles/:article_id/comments', () => {
    test('status: 201, should create a new comment from passed username and body', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({username: 'butter_bridge', body: 'Magnificent'})
        .expect(201)
        .then(({body}) => {
            expect(body.comment.author).toBe('butter_bridge');
            expect(body.comment.body).toBe('Magnificent');
            expect(body.comment.votes).toBe(0);
            expect(typeof(body.comment.created_at)).toBe('string');
            expect(body.comment.comment_id).toBe(19)
            expect(body.comment.article_id).toBe(2);
        })
    })
    test('status: 404, should return error when no article with that id', () => {
        return request(app)
        .post('/api/articles/99/comments')
        .send({username: 'butter_bridge', body: 'Magnificent'})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article Not Found')
        })
    })
    test('status: 400, should return error when invalid path', () => {
        return request(app)
        .post('/api/articles/nine/comments')
        .send({username: 'butter_bridge', body: 'Magnificent'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('status: 404, should return an error when username does not exist', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({username: 'MrHandsome', body: 'Even Better'})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('No Such User')
        })
    })
    test('status: 400, should return an error when body is invalid', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({username: 'butter_bridge', body: null  })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})

describe('9. GET /api/articles Queries', () => {
    test('Status 200; should return all articles sorted by topic', () => {
        return request(app)
        .get('/api/articles?sort_by=topic&order=desc')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('topic', { descending: true })
        });
    })
    test('status 200, should return all articles with chosen topic', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toEqual([{"article_id": 5, "author": "rogersop", "comment_count": "2", "created_at": "2020-08-03T13:14:00.000Z", "title": "UNCOVERED: catspiracy to bring down democracy", "topic": "cats", "votes": 0}])
        })
    }) 
    test('status 204, should return an empty array when topic does not exist', () => {
        return request(app)
        .get('/api/articles?topic=batman')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBe(0)
        })
    })
    test('status 400, should return bed request when invalid order chosen', () => {
        return request(app)
        .get('/api/articles?order=up')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    }
    )
})