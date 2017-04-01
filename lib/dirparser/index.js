const { resolve } = require('path');
const { statSync } = require('fs');

const { crawl } = require('./crawler');
const { flatten } = require('./flattener');


function verifyUniqueHandlerIds(routes) {
    const seen = {};
    routes.forEach(route => {
        route.handlers.forEach(handler => {
            const seenHandler = seen[handler.handlerId];
            if (seenHandler) {
                throw new Error(`Handler "${ handler.handlerId }" already defined in "${ seenHandler.path }"`);
            }
            else {
                seen[handler.handlerId] = handler;
            }
        });
    });
}


function load(dirPath) {
    const fullPath = resolve(dirPath);
    const stat = statSync(fullPath);

    if (!stat.isDirectory()) {
        throw new Error(`Directory doesn't exist: "${ fullPath }"`);
    }
    const routes = flatten(fullPath, crawl(fullPath));
    verifyUniqueHandlerIds(routes);
    return routes;
}

module.exports.load = load;
