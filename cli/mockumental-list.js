#!/usr/bin/env node

const { resolve } = require('path');
const { crawl } = require('../lib/crawler');
const { flatten } = require('../lib/flattener');
const program = require('commander');

program
    .option('-j, --json', 'dump as json')
    .parse(process.argv);

const srcPath = '../ex2';
const routes = flatten(crawl(resolve(srcPath)));

if (program.json) {
    console.log(JSON.stringify(routes, null, 4));
}
else {
    for (const {path, method, handlers} of routes) {
        console.log(path, method);
        for (const handler of handlers) {
            console.log('  ', handler.prettyName, handler.status, handler.type,
                handler.isDefaultHandler ? 'default' : '');
        }
    }
}
