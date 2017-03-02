#!/usr/bin/env node

const { resolve } = require('path');

const express = require('express');
const program = require('commander');
const cors = require('cors');

const { middleware } = require('../lib/express');
const { handlerSelector } = require('../lib/inquirer');

program
    .usage('[options] <directory>')
    .option('-u, --interactive', 'show interactive cli ui')
    .option('-p, --port <n>', 'port to bind to (default 3031)', parseInt)
    .option('-i, --ip <ip>', 'host / ip to bind to (default 0.0.0.0')
    .option('-m, --mount <path>', 'mount point')
    .option('-c, --cors', 'enable CORS')
    .parse(process.argv);

const mockRootDir = resolve(program.args.shift() || './');
let mountPoint = program.mount || '/';

if (mountPoint[0] !== '/') {
    mountPoint = `/${ mountPoint }`;
}

const port = program.port || 3031;
const ip = program.ip || '0.0.0.0';

const app = express();

// fixme: assert that dir exists
const mock = middleware(mockRootDir);

// fixme: move cli utils into separate package
function aquireGuiSelection() {
    handlerSelector(mock.routes, mock.activations).then(function(answers) {
        const { handler: { routeId, handlerId } } = answers;
        mock.setHandler(routeId, handlerId);
        return aquireGuiSelection();
    });
}

if (program.cors) {
    app.use(cors());
}

app.use(mountPoint, mock.router);

const listener = app.listen(port, ip, function() {
    console.log(`Hosting ${ mockRootDir }  on http://localhost:${ port }${ mountPoint }`);
    aquireGuiSelection();
});
