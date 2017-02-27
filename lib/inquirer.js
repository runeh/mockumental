const inquirer = require('inquirer');

const methodPad = method => `${method}     `.slice(0, 7);

function handlerSelector(paths, activations) {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'route',
            message: 'Route',
            choices: paths.map(route => {
                return {
                    name: (
                        `${route.path} [${route.method}] ${route.handlers.length} handlers`
                    ),
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
                return route.handlers.map(handler => {
                    return {
                        name: handler.name,
                        value: handler
                    };
                });
            }
        }
    ]);
}

module.exports.handlerSelector = handlerSelector;
