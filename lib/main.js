const { resolve } = require('path');

const { crawl } = require('./crawler');
const { flatten } = require('./flattener');
const { matchersFromRoutes, matchRequest } = require('./matching');
const { executeHandler } = require('./handler-execution');

// fixme: copied from express. Can be removed from there?
function initActivations(routes) {
    const ret = {};
    routes.forEach(({ routeId, handlers }) => {
        ret[routeId] = (handlers.find(e => e.isDefaultHandler) ||
            handlers[0]).handlerId;
    });
    return ret;
}

class Mockumental {
    /**
     * 
     * @param {string} rootPath 
     */
    constructor(rootPath) {
        this._routes = flatten(crawl(resolve(rootPath)));
        this._matchers = matchersFromRoutes(this._routes);
        this._selectedHandlers = initActivations(this._routes);
    }

    handle(path, method = 'GET') {
        method = method.toUpperCase();
        const matchEntry = matchRequest(this._matchers, path, method);
        if (matchEntry) {
            const { route, routeParams } = matchEntry;
            const handlerId = this._selectedHandlers[route.routeId];
            const handler = route.handlers.find(e => e.handlerId === handlerId);
            console.log('wooo. will handle');
            executeHandler(handler, routeParams);
        }
        else {
            console.log('nooo');
        }
    }

    getRoutes() {
        // fixme: do a deep copy?
        return this._routes;
    }

    // fixme: allow omit route id? handlers can only belong to one route.
    setSetHandler(routeId, handlerId) {

    }

}

module.exports.Mockumental = Mockumental;
