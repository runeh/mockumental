const { resolve } = require('path');
const express = require('express');

const { crawl } = require('./crawler');
const { flatten } = require('./flattener');

function initActivations(paths) {
    const ret = {};
    paths.forEach(({ routeId, handlers }) => {
        // fixme: sort handlers by default, then status, then alpha?
        ret[routeId] = (handlers.find(e => e.isDefaultHandler) ||
            handlers[0]).handlerId;
    });
    return ret;
}

function attachMockRoutes(router, paths) {
    paths.forEach(({ method, path, handlers, routeId }) => {
        router[method.toLowerCase()](path, (req, res) => {
            const handlerId = req.activations[routeId];
            const handler = handlers.find(e => e.handlerId === handlerId);
            // fixme: handle .json.js etc
            // fixme: error handling?
            res.status(handler.status).sendFile(handler.path);
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
        activations,
        setHandler: (rid, hid) => activations[rid] = hid,
    };
}

module.exports.middleware = middleware;
