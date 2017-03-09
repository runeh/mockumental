function handler(req, routeParams, memo) {
    memo.counter = memo.counter || 0;
    memo.counter++;
    return `
        Script handler yo!
        ${ JSON.stringify(routeParams) }
        ${ JSON.stringify(memo) }
    `;
}

module.exports = handler;
 