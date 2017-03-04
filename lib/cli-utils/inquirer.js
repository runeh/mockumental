const inquirer = require('inquirer');

/**
 * Returns an array of all the values in an object.
 * Same as `Object.values(obj)` in node 7 +
 * @param {object} obj 
 * @returns {*[]}
 */
function objectValues(obj) {
    return Object.keys(obj).map(e => obj[e]);
}

/**
 * Right pad a string up to `length`
 * @param {number} length 
 * @param {string} s
 * @returns {string}
 */
function padTo(length, s) {
    return `${ s }                                           `.slice(0, length);
}

function routeFormatter(routes) {
    const maxPathWidth = routes
        .map(e => e.path.length)
        .reduce((a, b) => Math.max(a, b)) + 1;

    const maxMethodWidth = routes
        .map(e => e.method.length)
        .reduce((a, b) => Math.max(a, b));

    return route => {
        const disabled = route.handlers.length <= 1;
        const handlerString = disabled ? '' :
                    ` (${ route.handlers.length } handlers)`;

        return `${ disabled ? '' : '- ' } ${ padTo(maxPathWidth, route.path) } [${ padTo(
            maxMethodWidth,
            route.method
        ) }] ${ handlerString }`;
    };
}

/**
 * 
 * 
 * @param {any} handlers 
 * @returns 
 */
function handlerFormatter(handlers) {
    const maxNameWidth = handlers
        .map(e => e.prettyName.length)
        .reduce((a, b) => Math.max(a, b)) + 1;
    return handler => {
        return `${ padTo(
            maxNameWidth,
            handler.prettyName
        ) } [${ handler.status }] [${ handler.type }]`;
    };
}

function handlerSelector(routes, activations) {
    const formatter = routeFormatter(routes);
    const selectedHids = objectValues(activations);
    return inquirer.prompt([
        {
            type: 'list',
            name: 'route',
            message: 'Route',
            choices: routes.map(route => {
                return {
                    disabled: route.handlers.length === 1 ? '1 handler' : false,
                    name: formatter(route),
                    short: `${ route.method }: ${ route.path }`,
                    value: route,
                };
            }),
        },
        {
            type: 'list',
            name: 'handler',
            message: ({ route }) => `${ route.path } - ${ route.method }`,
            choices: ({ route }) => {
                const formatter = handlerFormatter(route.handlers);
                return route.handlers.map(handler => {
                    return {
                        name: formatter(handler),
                        value: handler,
                        selected: selectedHids.includes(handler.handlerId),
                    };
                });
            },
        },
    ]);
}

module.exports.handlerSelector = handlerSelector;
