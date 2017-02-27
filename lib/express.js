const { resolve } = require('path');
const express = require('express');

const { crawl } = require('./crawler');
const { flatten } = require('./flattener');

function initActivations(paths) {
    const ret = {};
    paths.forEach(({ routeId, handlers }) => {
        ret[routeId] = handlers[0].handlerId;
    });
    return ret;
}

function attachMockRoutes(router, paths) {
    paths.forEach(({ method, path, handlers }) => {
        router[method.toLowerCase()](path, (req, res, next) => {
            console.log('jau', path, method, req.activations);
            // use activations from req?
            res.status(200).send(`${method} : ${path}`);
        });
    });
}

function middleware(path) {
    const paths = flatten(crawl(resolve(path)));
    const activations = initActivations(paths);
    const router = express.Router();
    router.use((req, res, next) => {
        req.activations = activations;
        next();
    });
    attachMockRoutes(router, paths);
    return {
        router,
        paths,
        activations
    };
}

module.exports.middleware = middleware;
