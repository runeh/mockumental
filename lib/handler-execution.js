
// FIXME: rename to just 'handler' or something when the current file
// with that name is renamed

// fixme: where to do cache? In every handler? Before? Skip memo in favor
// of a dedicated cache thingy then presumably?

// fixme: where do we put the header and status and stuff on the
// response object? In which case can it be overridden?

// takes obj, queryString, body, headers, memo

function executeHandler(handler, routeParams, opts = {}) {
    const { body, queryString, headers, memo } = opts;

    const handlerType = handler.handlerType;

    switch (handlerType) {
    case 'static':
        return executeStaticHandler(handler, memo);
    default:
        console.log(`Unknown handler type: "${ handlerType }"`);
    }
}

function executeStaticHandler() {
    console.log('execute static');
    return null;
}

module.exports.executeHandler = executeHandler;
