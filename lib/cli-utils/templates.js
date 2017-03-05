
function objectValues(obj) {
    return Object.keys(obj).map(e => obj[e]);
}

function adminPage(title, routes, activationMap) {
    const selectedHandlers = objectValues(activationMap);
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${ title }</title>
                <style>
                    body {
                        font-family: sans-serif;
                    }
                    ol {
                        padding-left: 1em;
                        list-style: none;
                    }
                    form {
                        display: inline-block;
                    }
                </style>
            </head>
            <body>
            <h1>mockumental admin</h1>
            <p>
                Choose a handler for any of the available paths.
            </p>
            <p>
                Todo: activations   
            </p>
            <ol>
                ${ routes.map(e => routeItem(e, selectedHandlers)).join('\n') }
            </ol>
    `;
}

function routeItem(route, selectedHandlers) {
    return `
        <li>
            <strong><code>${ route.path }</code></strong>
            <strong><code>${ route.method }</code></strong>
            <ol>
                ${ route.handlers.map(e => handlerItem(e, selectedHandlers)).join('\n') }
            </ol>
        </li>`;
}

function handlerItem(handler, selectedHandlers) {
    return `
        <li>
            ${ handler.status } - ${ handler.prettyName } ${ selectedHandlers.includes(handler.handlerId) }
            <form method=post>
                <input type=hidden name=rid value="${ handler.routeId }">
                <input type=hidden name=hid value="${ handler.handlerId }">
                <button type=submit>Activate handler</button>
            </form>
        </li>
    `;
}

const x = {
    'method': 'GET',
    'name': 'index.json',
    'path': '/Users/runeh/Dropbox/prosjekter/mockumental/example/ex2/index.json',
    'prettyName': 'index',
    'isDefaultHandler': false,
    'status': 200,
    'type': 'json',
    'handlerType': 'static',
    'mimeType': 'application/json',
    'routeId': 'r1',
    'handlerId': 'r1h1',
};

module.exports.adminPage = adminPage;
