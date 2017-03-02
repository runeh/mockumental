#!/usr/bin/env node

const express = require('express');
const program = require('commander');

const { middleware } = require('../lib/express');
const { handlerSelector } = require('../lib/inquirer');


program
    .usage('[options] <file ...>')
    .option('-i, --interactive', 'show interactive cli ui')
    .option('-p, --port <n>', 'port to bind to', parseInt)
    .option('-h, --host', 'host / ip to bind to')
    .option('-m, --mount', 'mount point')
    .parse(process.argv);



const app = express();


const mock = middleware('../ex2');

function aquireGuiSelection() {
    handlerSelector(mock.paths, mock.activations).then(function(answers) {
        const { handler: { routeId, handlerId } } = answers;
        mock.setHandler(routeId, handlerId);
        return aquireGuiSelection();
    });
}

app.use(mock.router);

const port = process.env.PORT || 3000;
const ip = process.env.IP || '0.0.0.0';

const listener = app.listen(port, ip, function() {
    console.log(`Example app listening on http://localhost:${port}`);
    aquireGuiSelection();
});
