
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
                        padding-left: 1.5em;
                        list-style: none;
                    }
                    .mOPTIONS, .mGET, .mHEAD, .mPUT, .mDELETE {
                        color: green
                    }
                    .mPOST {
                        color: gold;
                    }

                    .s2xx, .s3xx {
                        color: green;
                    }

                    .s4xx {
                        color: gold;
                    }

                    .s5xx {
                        color: red;
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
            <ol>
                ${ routes.map(e => routeItem(e, selectedHandlers)).join('\n') }
            </ol>
    `;
}

function routeItem(route, selectedHandlers) {
    return `
        <li>
            <strong><code>${ route.path }</code></strong>
            <strong class="${ mClass(route) }"><code>${ route.method }</code></strong>
            <ol>
                ${ route.handlers.map(e => handlerItem(e, selectedHandlers)).join('\n') }
            </ol>
        </li>`;
}

function handlerItem(handler, selectedHandlers) {
    return `
        <li>
            <strong><code class="${ sClass(handler) }">
                ${ handler.status }
            </code></strong> - ${ handler.prettyName } 
            ${ activationMarkup(handler, selectedHandlers) }
        </li>
    `;
}

function activationMarkup(handler, selectedHandlers) {
    if (selectedHandlers.includes(handler.handlerId)) {
        return '<strong>active</strong>'
    }
    else {
        return `
            <form method=post>
                <input type=hidden name=rid value="${ handler.routeId }">
                <input type=hidden name=hid value="${ handler.handlerId }">
                <button type=submit>Activate</button>
            </form>
        `;
    }
}

function mClass(route) {
    return `m${ route.method }`;
}

function sClass(handler) {
    return `s${ String(handler.status)[0] }xx`;
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
