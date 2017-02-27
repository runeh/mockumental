const inquirer = require('inquirer');

const methodPad = method => `${method}     `.slice(0, 7);

function padTo(length, s) {
    return `${s}                                           `.slice(0, length);
}

function routeFormatter(routes) {
    const maxPathWidth = routes
        .map(e => e.path.length)
        .reduce((a, b) => Math.max(a, b)) + 1;

    const maxMethodWidth = routes
        .map(e => e.method.length)
        .reduce((a, b) => Math.max(a, b));

    return route => {
        return `${padTo(maxPathWidth, route.path)} [${padTo(
            maxMethodWidth,
            route.method
        )}] (${route.handlers.length} handlers)`;
    };
}

function handlerFormatter(handlers) {
    const maxNameWidth = handlers
        .map(e => e.prettyName.length)
        .reduce((a, b) => Math.max(a, b)) + 1;
    return handler => {
        return `${padTo(
            maxNameWidth,
            handler.prettyName
        )} [${handler.status}] [${handler.type}]`;
    };
}

function handlerSelector(paths, activations) {
    const formatter = routeFormatter(paths);
    return inquirer.prompt([
        {
            type: 'list',
            name: 'route',
            message: 'Route',
            choices: paths.map(route => {
                return {
                    name: formatter(route),
                    short: `${route.method}: ${route.path}`,
                    value: route
                };
            })
        },
        {
            type: 'list',
            name: 'handler',
            message: ({ route }) => `${route.path} - ${route.method}`,
            choices: ({ route }) => {
                const formatter = handlerFormatter(route.handlers);
                return route.handlers.map(handler => {
                    return {
                        name: formatter(handler),
                        value: handler
                    };
                });
            }
        }
    ]);
}

module.exports.handlerSelector = handlerSelector;
