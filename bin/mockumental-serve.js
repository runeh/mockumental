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
    .option('-a, --address <adress>', 'address to bind to (default localhost', 'localhost')
    .option('-m, --mount <path>', 'mount point', '/')
    .option('-c, --cors', 'enable CORS')
    .option('-i, --nocli','don\'t show interactive CLI', false)
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

const server = app.listen(program.port, program.address, () => {
    const { address, port } = server.address();
    console.log(`Hosting ${ mockRootDir } on http://${ address }:${ port }${ mountPoint }`);
    console.log(`Admin UI on http://${ address }:${ port }${ mountPoint }__admin`);
    if (!program.nocli) {
        aquireGuiSelection();
    }
});
