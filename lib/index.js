
const { load: loadDir } = require('./dirparser');
const { matchersFromRoutes, matchRequest } = require('./execution/matching');
const { executeHandler } = require('./execution/handlers');


// immutabilize?
function selectHidForRoute(routes, hid) {
    routes.forEach(route => {
        const handler = route.handlers.find(e => e.handlerId === hid);
        if (handler) {
            route.handlers.forEach(e => e.current = false);
            handler.current = true;
        }
    });
}

class Mockumental {
    /**
     * 
     * @param {string} rootPath 
     */
    constructor(rootPath) {
        this._routes = loadDir(rootPath);
        this._matchers = matchersFromRoutes(this._routes);
        this._memo = {};
    }

    handle(path, method = 'GET', httpReq = {}) {
        method = method.toUpperCase();
        const matchEntry = matchRequest(this._matchers, path, method);
        if (matchEntry) {
            const { route, routeParams } = matchEntry;
            
            const handler = route.handlers.find(e => e.current);
            return executeHandler(handler, routeParams, httpReq, this._memo);
        }
        else {
            return Promise.resolve(null);
        }
    }

    getRoutes() {
        return this._routes;
    }

    activateHandler(hid) {
        selectHidForRoute(this._routes, hid);
    }

}

module.exports.Mockumental = Mockumental;
