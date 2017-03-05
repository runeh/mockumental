
function handler(routeParams, request, memo) {
    memo.counter = memo.counter || 0;
    memo.counter++;
    return `
        Dynamic handler yo!
        ${ JSON.stringify(routeParams) }
        ${ JSON.stringify(request) }
        ${ JSON.stringify(memo) }
    `;
}

module.exports = handler;
 