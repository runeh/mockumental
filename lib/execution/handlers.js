const { readFileSync } = require('fs');

// fixme: where to do cache? In every handler? Before? Skip memo in favor
// of a dedicated cache thingy then presumably?

// fixme: where do we put the header and status and stuff on the
// response object? In which case can it be overridden?

function executeHandler(handler, routeParams, request = {}, memo = {}) {
    const handlerType = handler.handlerType;
    let body = null;

    switch (handlerType) {
    case 'static':
        body = executeStaticHandler(handler);
        break;
    default:
        throw new Error(`Don't know how to run handler of type "${ handlerType }"`);
    }

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
}

// fixme: calling convention for 
function executeStaticHandler(handler) {
    console.log('execute static', handler.path);
    return readFileSync(handler.path, 'utf-8');
}

module.exports.executeHandler = executeHandler;
