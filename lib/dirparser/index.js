const { resolve } = require('path');
const { statSync } = require('fs');

const { crawl } = require('./crawler');
const { flatten } = require('./flattener');

function load(dirPath) {
    const fullPath = resolve(dirPath);
    const stat = statSync(fullPath);

    if (!stat.isDirectory()) {
        throw new Error(`Directory doesn't exist: "${ fullPath }"`);
    }
    return flatten(crawl(fullPath));
}

module.exports.load = load;
