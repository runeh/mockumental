const { crawl } = require('./lib/crawler');
const { resolve } = require('path');

// console.log(JSON.stringify(crawl(resolve('./example'))))

const { MockServer } = require('./lib/middleware');

const tree = crawl(resolve('./ex2'));
const server = new MockServer(tree);

const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.use(server.router());
console.log(server.routes);

app.listen(3000, function() {
    console.log('Example app listening on http://localhost:3000');
});

// var prettyjson = require('prettyjson');
// console.log(JSON.stringify(parseFileSystem(resolve('./example'))))
// const router = createRouter('./example');
// router('/example', 1111);
// router('/example/searches', 1112);
// router('/example/what', 1113);
// router('/example/searches/foobar', 1114);
// router('/example/unreadcount_json', 1114);
// router('/example/user/rune/nokia', 1114);
