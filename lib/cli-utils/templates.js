function adminPage(routes, mountPoint) {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Mockumental admin</title>
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
                Mock is mounted on <a href="${ mountPoint }">${ mountPoint }</a>
            </p>
            <p>
                Choose a handler for any of the available paths.
            </p>
            <ol>
                ${ routes.map(routeItem).join('\n') }
            </ol>
    `;
}

function routeItem(route) {
    return `
        <li>
            <strong><code>${ route.path }</code></strong>
            <strong class="${ mClass(route) }"><code>${ route.method }</code></strong>
            <ol>
                ${ route.handlers.map(handlerItem).join('\n') }
            </ol>
        </li>`;
}

function handlerItem(handler) {
    return `
        <li>
            <strong><code class="${ sClass(handler) }">
                ${ handler.status }
            </code></strong> - ${ handler.prettyName } 
            ${ activationMarkup(handler) }
        </li>
    `;
}

function activationMarkup(handler) {
    if (handler.current) {
        return '<strong>active</strong>';
    }
    else {
        return `
            <form method=post>
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

module.exports.adminPage = adminPage;
