const express = require('express');

const { middleware } = require('./lib/express');

const app = express();

app.get('/', function(req, res) {
    res.send('Hello World!');
});

const mock = middleware('./example');

app.use(mock.router);

app.listen(3000, function() {
    console.log('Example app listening on http://localhost:3000');
});
