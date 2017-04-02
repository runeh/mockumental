const { resolve } = require('path');

const express = require('express');
const request = require('supertest');

const { ExpressMockumental } = require('../lib/cli-utils/express');

const mockRootDir = resolve(__dirname, 'trees', 'express');

function setup() {
    const app = express();
    const mocker = new ExpressMockumental(mockRootDir);
    app.use('/mocks', mocker.router);
    return [app, mocker];
} 

test('Get route info with admin HTTP request', async () => {
    const [app, mocker] = setup();
    mocker.activateHandler('1');

    const response = await request(app)
        .get('/mocks/__admin')
        .expect('Content-Type', /json/)
        .expect(200);

    const route = response.body.find(e => e.path === '/');
    expect(route).toBeTruthy();
    const handler = route.handlers.find(e => e.handlerId === '1');
    expect(handler).toBeTruthy();
    expect(handler.current).toBe(true);
});

test('Set handler with admin HTTP request', async () => {
    const [app, mocker] = setup();
    mocker.activateHandler('1');

    const response = await request(app)
        .post('/mocks/__admin')
        .send('hid=3')
        .expect('Content-Type', /json/)
        .expect(200);

    const route = response.body.find(e => e.path === '/');
    expect(route).toBeTruthy();
    const handler = route.handlers.find(e => e.handlerId === '3');
    expect(handler).toBeTruthy();
    expect(handler.current).toBe(true);
});

test('Try setting an invalid handler with admin HTTP request', async () => {
    const [app] = setup();

    return request(app)
        .post('/mocks/__admin')
        .send('hid=3123123123123123123')
        .expect('Content-Type', /json/)
        .expect(400);
});
