const { readFileSync } = require('fs');
const { parse: parseUrl } = require('url');

const rp = require('request-promise-native');

function delayValue(ms) {
    if (ms === 0) {
        return val => val;
    }
    else {
        return val => new Promise(resolve => setTimeout(resolve, ms, val));
    }
}

function executeHandler(handler, routeParams, request, memo) {
    const handlerType = handler.handlerType;
    let body = null;

    switch (handlerType) {
    case 'static':
        body = executeStaticHandler(handler);
        break;
    case 'script':
        body = executeScriptHandler(handler, routeParams, request, memo);
        break;
    case 'proxy':
        body = executeProxyHandler(handler, routeParams, request, memo);
        break;
    default:
        throw new Error(`Don't know how to run handler of type "${ handlerType }"`);
    }

    const response = {
        status: handler.status,
        mimeType: handler.mimeType,
        delay: handler.delay,
        headers: {},
    }

    return Promise
        .resolve(body)
        .then(delayValue(handler.delay))
        .then(body => {
            if (body == null) {
                return null;
            }
            else if (typeof body === 'string') {
                return Object.assign(response, { body });
            }
            else {
                return Object.assign({}, response, body);
            }
        });
}

function executeStaticHandler(handler) {
    return readFileSync(handler.path, 'utf-8');
}

function executeScriptHandler(handler, routeParams, req, memo) {
    const module = require(handler.path);
    const modType = typeof module;
    if (modType === 'function') {
        return module(req, routeParams, memo);
    }
    else if (modType === 'string') {
        return modType;
    }
    else {
        throw new Error(`Don't know how to execute script handler "${ modType }"`);
    }
}

function cleanHeaders(headers) {
    const blacklist = ['host', 'connection'];
    const ret = {};
    Object
        .keys(headers)
        .filter(e => !blacklist.includes(e))
        .forEach(e => {
            ret[e] = headers[e];
        });
    return ret;
}

function executeProxyHandler(handler, routeParams, req) {
    const url = parseUrl(req.url, true);
    const headers = cleanHeaders(req.headers);
    return rp({
        method: 'GET',
        uri: handler.proxyUrl,
        headers,
        resolveWithFullResponse: true,
        qs: Object.assign({}, url.query),
    })
    .then(response => {
        return {
            headers: response.headers,
            body: response.body,
            status: response.statusCode,
        };
    });
}

module.exports.executeHandler = executeHandler;
