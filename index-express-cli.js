const express = require('express');

const { middleware } = require('./lib/express');
const { handlerSelector } = require('./lib/inquirer');

const app = express();

// app.get('/', function(req, res) {
//     res.send('Hello World!');
// });

const mock = middleware('./ex2');
// const mock = middleware('./example');

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
