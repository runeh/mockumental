const { resolve } = require('path');

const { load: loadDir } = require('./dirparser')
const { matchersFromRoutes, matchRequest } = require('./execution/matching');
const { executeHandler } = require('./execution/handlers');

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
        this._routes = loadDir(rootPath);
        this._matchers = matchersFromRoutes(this._routes);
        this._selectedHandlers = initActivations(this._routes);
        this._memo = {};
    }

    handle(path, method = 'GET') {
        method = method.toUpperCase();
        const matchEntry = matchRequest(this._matchers, path, method);
        if (matchEntry) {
            const { route, routeParams } = matchEntry;
            const request = {
                path,
                qs: null,
                method,
                headers: {},
                body: null,
            };
            const handlerId = this._selectedHandlers[route.routeId];
            const handler = route.handlers.find(e => e.handlerId === handlerId);
            console.log('wooo. will handle');
            // fixme: also pass cache?
            return executeHandler(handler, routeParams, request, this._memo);
        }
        else {
            console.log('nooo');
            return null;
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
