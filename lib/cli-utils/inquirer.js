const inquirer = require('inquirer');
const chalk = require('chalk');
const pad = require('pad/lib/colors');

function routeFormatter(routes) {
    const maxPathWidth = routes
        .map(e => e.path.length)
        .reduce((a, b) => Math.max(a, b)) + 1;

    const maxMethodWidth = routes
        .map(e => e.method.length)
        .reduce((a, b) => Math.max(a, b));

    return route => {
        const method = route.method;
        const handlerString = route.handlers.length > 1
            ? ` (${ route.handlers.length } handlers)`
            : ' (1 handler)';

        return `${ pad(
            route.path,
            maxPathWidth
        ) } [${ (pad(colorMethod(method), maxMethodWidth)) }] ${ handlerString }`;
    };
}

function colorStatus(status, str) {
    str = str || status;
    if (str === 'ANY') {
        return chalk.magenta(str);
    }
    else if (status < 400) {
        return chalk.green(str);
    }
    else if (status < 500) {
        return chalk.yellow(str);
    }
    else {
        return chalk.red(str);
    }
}

function colorMethod(method, str) {
    str = method || str;
    const idempotent = ['OPTIONS', 'GET', 'HEAD', 'PUT', 'DELETE'];
    if (idempotent.includes(method)) {
        return chalk.green(str);
    }
    else {
        return chalk.yellow(str);
    }
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
    return (handler) => {
        const mime = handler.handlerType === 'proxy' ? 'ANY' : handler.mimeType;
        const status = handler.handlerType === 'proxy' ? 'ANY' : handler.status
        return `${ pad(
            handler.prettyName,
            maxNameWidth
        ) } [${ colorStatus(status) }] [${ mime }] ${ handler.current ? '(active)' : '' }`;
    };
}

function handlerSelector(routes) {
    const formatter = routeFormatter(routes);
    return inquirer.prompt([
        {
            type: 'list',
            name: 'route',
            message: 'Route',
            choices: routes.map(route => {
                return {
                    name: formatter(route),
                    short: `${ colorMethod(route.method) }: ${ route.path }`,
                    value: route,
                };
            }),
        },
        {
            type: 'list',
            name: 'handler',
            message: ({ route }) => `${ route.path } - ${ colorMethod(route.method) }`,
            choices: ({ route }) => {
                const formatter = handlerFormatter(route.handlers);
                return route.handlers.map(handler => {
                    return {
                        name: formatter(handler),
                        value: handler,
                        selected: handler.current,
                    };
                });
            },
        },
    ]);
}

module.exports.handlerSelector = handlerSelector;
