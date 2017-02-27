const { resolve } = require('path');
const express = require('express');

const { crawl } = require('./crawler');
const { flatten } = require('./flattener');

function initActivations(paths) {
    return [];
}

function attachMockRoutes(router, paths) {
    paths.forEach(({ method, path, handlers }) => {
        router[method.toLowerCase()](path, (req, res, next) => {
            console.log('jau', path, method);
            // use activations from req?
            res.status(200).send(`${method} : ${path}`);
        });
    });
}

function middleware(path) {
    const paths = flatten(crawl(resolve(path)));
    const router = express.Router();
    const activationMap = initActivations(paths);
    attachMockRoutes(router, paths);
    return {
        router,
        paths
    };
}

module.exports.middleware = middleware;
