const { readFileSync } = require('fs');
const { parse: parseUrl } = require('url');

const rp = require('request-promise-native');

// fixme: where to do cache? In every handler? Before? Skip memo in favor
// of a dedicated cache thingy then presumably?

// fixme: where do we put the header and status and stuff on the
// response object? In which case can it be overridden?

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
        .then(body => {
            if (body == null) {
                return null;
            }
            else if (typeof body === 'string') {
                return Object.assign(response, { body });
            }
            // fixme more safety checks
            else {
                return Object.assign({}, response, body);
            }
        });
}

// fixme: calling convention for 
function executeStaticHandler(handler) {
    return readFileSync(handler.path, 'utf-8');
}

function executeScriptHandler(handler, routeParams, req, memo) {
    const module = require(handler.path);
    const modType = typeof module;
    if (modType === 'function') {
        return module(req, routeParams, memo);
    }
    else if (modType === 'string') { // fixme: also buffer
        return modType;
    }
    else {
        throw new Error(`Don't know how to execute script handler "${ modType }"`);
    }
}

function executeProxyHandler(handler, routeParams, req) {
    const url = parseUrl(req.url, true);
    return rp({
        method: 'GET',
        uri: handler.proxyUrl,
        headers: req.headers,
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
