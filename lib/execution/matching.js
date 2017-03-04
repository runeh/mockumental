const pathRegexp = require('path-to-regexp');

function makeMatcher(route) {
    const keys = [];
    const regexp = pathRegexp(route.path, keys);

    return {
        method: route.method,
        regexp,
        keys,
        route,
    };
}

function matchersFromRoutes(routes) {
    return routes.map(makeMatcher);
}

function evaluateMatcher(matcher, path, method) {
    if (method !== matcher.method) {
        return null;
    }

    const [matchedPath, ...values] = matcher.regexp.exec(path) || [];
    
    if (matchedPath) {
        const routeParams = {};
        values.forEach((value, index) => {
            routeParams[matcher.keys[index].name] = value;
        });
        return {
            route: matcher.route,
            routeParams,
        };
    }
    else {
        return null;
    }
}

/**
 * 
 * @param {[matcher]} matchers 
 * @param {string} path 
 * @param {string} method 
 */
function matchRequest(matchers, path, method) {
    method = method.toString();
    for (const matcher of matchers) {
        const match = evaluateMatcher(matcher, path, method);
        if (match) {
            return match;
        }
    }
    return null;
}

module.exports.matchersFromRoutes = matchersFromRoutes;
module.exports.makeMatcher = makeMatcher;
module.exports.matchRequest = matchRequest;
