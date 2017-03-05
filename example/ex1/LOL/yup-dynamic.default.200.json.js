
function handler(routeParams, request, memo) {
    return `
        Dynamic handler yo!
        ${ JSON.stringify(routeParams) }
        ${ JSON.stringify(request) }        
        ${ JSON.stringify(memo) }        
        
    `;
}

module.exports = handler;
 