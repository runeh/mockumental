#!/usr/bin/env node

const program = require('commander');
const { Mockumental } = require('../lib/index');

program
    .option('-j, --json', 'dump as json')
    .parse(process.argv);

const mockRootDir = program.args.shift() || './';
const mocker = new Mockumental(mockRootDir);
const routes = mocker.getRoutes();

if (program.json) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(routes, null, 4));
}
else {
    for (const {path, method, handlers} of routes) {
        // eslint-disable-next-line no-console
        console.log(path, method);
        for (const handler of handlers) {
            // eslint-disable-next-line no-console
            console.log('    ', handler.prettyName, handler.status, handler.mimeType,
                handler.isDefaultHandler ? 'default' : '');
        }
    }
}
