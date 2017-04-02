
const { load: loadDir } = require('./dirparser');
const { matchersFromRoutes, matchRequest } = require('./execution/matching');
const { executeHandler } = require('./execution/handlers');


// immutabilize?
function selectHidForRoute(routes, hid) {
    let updated = false;
    routes.forEach(route => {
        const handler = route.handlers.find(e => e.handlerId === hid);
        if (handler) {
            route.handlers.forEach(e => e.current = false);
            handler.current = true;
            updated = true;
        }
    });
    return updated;
}

/**
 * @typedef {Object} MockResponse
 * @property {string} body - Response body
 * @property {number} status - HTTP status code
 * @property {number} delay - number of MS to delay response
 * @property {string} mimeType - the MIME type of the response
 * @property {object} headers - map of headers
 */



class Mockumental {
    /**
     * Creates an instance of Mockumental.
     * @param {any} rootPath - Path to mock directory
     * @param {any} [options={}] - Options object
     * @param {any} [options.memo = {}] - initial memo object passed to script handlers 
     * 
     * @memberOf Mockumental
     */
    constructor(rootPath, options = {}) {
        this._routes = loadDir(rootPath);
        this._matchers = matchersFromRoutes(this._routes);
        this._memo = options.memo || {};
    }

    /**
     * Handle a request
     * @param {string} path - path for the requiest
     * @param {string} [method='GET'] - method for the requoest
     * @param {any} [httpReq={}] - Node request object
     * @returns {MockResponse} - object containing response data
     * 
     * @memberOf Mockumental
     */
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

    /**
     * Makes a handler the currently active handler
     * 
     * @param {string} hid 
     * @returns {boolean} True if a handler was activated. Otherwise false.
     * 
     * @memberOf Mockumental
     */
    activateHandler(hid) {
        return selectHidForRoute(this._routes, hid);
    }

}

module.exports.Mockumental = Mockumental;
