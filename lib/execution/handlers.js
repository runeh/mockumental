const { readFileSync } = require('fs');

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
    case 'dynamic':
        body = executeDynamicHandler(handler, routeParams, request, memo);
        break;
    case 'proxy':
        body = executeProxyHandler(handler, routeParams, request, memo);
        break;
    default:
        throw new Error(`Don't know how to run handler of type "${ handlerType }"`);
    }

    return Promise
        .resolve(body)
        .then(body => {
            if (body == null) {
                return null;
            }
            else {
                return {
                    body,
                    status: handler.status,
                    mimeType: handler.mimeType,
                    delay: handler.delay,
                    headers: {},
                };
            }
        });
}

// fixme: calling convention for 
function executeStaticHandler(handler) {
    return readFileSync(handler.path, 'utf-8');
}

function executeDynamicHandler(handler, routeParams, request, memo) {
    const module = require(handler.path);
    const modType = typeof module;
    if (modType === 'function') {
        return module(request, routeParams, memo);
    }
    else if (modType === 'string') { // fixme: also buffer
        return modType;
    }
    else {
        throw new Error(`Don't know how to execute dynamic handler "${ modType }"`);
    }
}

function executeProxyHandler(handler, routeParams, request) {
    // fixme: should use headers and things from `request`
    return rp({
        method: 'GET',
        uri: handler.proxyUrl,
        resolveWithFullResponse: true,
    })
    .then(response => {
        // should be object with headers etc.
        return response.body;
    });
}

module.exports.executeHandler = executeHandler;
