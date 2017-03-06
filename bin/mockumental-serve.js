#!/usr/bin/env node

const { resolve } = require('path');

const express = require('express');
const program = require('commander');
const cors = require('cors');

const { ExpressMockumental } = require('../lib/cli-utils/express');
const { handlerSelector } = require('../lib/cli-utils/inquirer');

program
    .usage('[options] <directory>')
    .option('-u, --interactive', 'show interactive cli ui')
    .option('-p, --port <port>', 'port to bind to (default 3031)', parseInt, 3031)
    .option('-i, --ip <ip>', 'host / ip to bind to (default 0.0.0.0', '0.0.0.0')
    .option('-m, --mount <path>', 'mount point', '/')
    .option('-c, --cors', 'enable CORS')
    .parse(process.argv);

const mockRootDir = resolve(program.args.shift() || './');
let mountPoint = program.mount;

if (mountPoint !== '/') {
    if (!mountPoint.startsWith('/')) {
        mountPoint = `/${ mountPoint }`;
    }
    
    if (!mountPoint.endsWith('/')) {
        mountPoint = `${ mountPoint }/`;
    }    
}

const app = express();
const mocker = new ExpressMockumental(mockRootDir);

function aquireGuiSelection() {
    handlerSelector(mocker.getRoutes()).then(function(answers) {
        const { handler: { handlerId } } = answers;
        mocker.activateHandler(handlerId);
        return aquireGuiSelection();
    });
}

if (program.cors) {
    app.use(cors());
}

app.use(mountPoint, mocker.router);

const listener = app.listen(program.port, program.ip, function() {
    console.log(`Hosting ${ mockRootDir } on http://localhost:${ program.port }${ mountPoint }`);
    console.log(`Admin UI on http://localhost:${ program.port }${ mountPoint }__admin`);
    aquireGuiSelection();
});
