const { crawl } = require('./lib/crawler');
const { resolve } = require('path');

const tree = crawl(resolve('./example'));

const { flatten } = require('./lib/flattener');

console.log(JSON.stringify(flatten(tree)));
