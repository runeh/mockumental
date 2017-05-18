const { resolve } = require('path');

const express = require('express');
const request = require('supertest');

const { ExpressMockumental } = require('../lib/cli-utils/express');

const mockRootDir = resolve(__dirname, 'trees', 'express');

function setup() {
    const app = express();
    const mocker = new ExpressMockumental(mockRootDir);
    app.use('/mocks', mocker.router);
    return { app, mocker };
} 

test('smoke test 1', () => {
    const { app } = setup();
    return request(app)
        .get('/mocks/')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/All good get/)
});

test('smoke test 2', () => {
    const { app, mocker } = setup();
    mocker.activateHandler('2');
    return request(app)
        .get('/mocks/')
        .expect('Content-Type', /html/)
        .expect(500)
        .expect(/internal server error/)
});

test('smoke test 3', () => {
    const { app } = setup();
    return request(app)
        .post('/mocks/')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/All good post data/)
});

test('smoke test 4', () => {
    const { app, mocker } = setup();
    mocker.activateHandler('3');
    return request(app)
        .get('/mocks/')
        .expect('Content-Type', /text/)
        .expect(200)
        .expect(/hello world/)
});

// .then(response => {
//           assert(response.body.email, 'foo@bar.com')
//       })