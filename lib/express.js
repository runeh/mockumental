const { resolve } = require('path');
const express = require('express');

const { crawl } = require('./crawler');
const { flatten } = require('./flattener');

function initActivations(routes) {
    const ret = {};
    routes.forEach(({ routeId, handlers }) => {
        ret[routeId] = (handlers.find(e => e.isDefaultHandler) ||
            handlers[0]).handlerId;
    });
    return ret;
}

function attachMockRoutes(router, routes) {
    routes.forEach(({ method, route, handlers, routeId }) => {
        router[method.toLowerCase()](route, (req, res) => {
            const handlerId = req.activations[routeId];
            const handler = handlers.find(e => e.handlerId === handlerId);
            // fixme: handle .json.js etc
            // fixme: error handling?
            res.status(handler.status).sendFile(handler.path);
        });
    });
}

function middleware(path) {
    const routes = flatten(crawl(resolve(path)));
    const activations = initActivations(routes);
    const router = express.Router();
    router.use((req, res, next) => {
        req.activations = activations;
        next();
    });
    attachMockRoutes(router, routes);
    return {
        router,
        routes,
        activations,
        setHandler: (rid, hid) => activations[rid] = hid,
    };
}

module.exports.middleware = middleware;
