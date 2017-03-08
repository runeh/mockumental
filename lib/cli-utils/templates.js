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

                    th {
                        text-align: left;
                        padding-top: 2ex;
                        font-size: 80%;
                    }

                    tr.handler {
                    }

                    tr.handler > td {
                        padding-left: 1em;
                        padding-right: 1em;
                        text-align: left;
                    }

                    .method {
                        display: inline-block;
                        width: 7ex;
                    }

                    .mOPTIONS, .mGET, .mHEAD, .mPUT, .mDELETE {
                        color: black;
                    }
                    
                    .mPOST {
                        color: black;
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
            <table>
                ${ routes.map(routeItem).join('\n') }
            </table>
    `;
}

function routeItem(route) {
    return `
        <tr>
            <th colspan=3>
                <span class="method ${ mClass(route) }">${ route.method }</span>
                <span>${ route.path }</span>
            </th>
        </tr>
        ${ route.handlers.map(handlerItem).join('\n') }
        
        `;
}

function handlerItem(handler) {
    return `
        <tr class=handler>
            <td>
                <strong><code class="${ sClass(handler) }">
                    ${ handler.status }
                </code></strong>
            </td>
            <td>
                ${ handler.prettyName }
            </td>
            <td>
                ${ activationMarkup(handler) }
            </td>
        </tr>
        <tr>
            <td></td>
            <td colspan=2>
                ${ handlerExplanation(handler) }
            </td>
        </tr>
    `;
}

function handlerExplanation(handler) {
    if (handler.handlerType === 'static') {
        return `
            <span>
                <span class="handler type">Static:<span>
                <span>Sends "${ handler.relPath }" as "${ handler.mimeType }"<span>
            </span>
        `;
    }
    else if (handler.handlerType === 'dynamic') {
        return `
            <span>
                <span class="handler type">Dynamic:<span>
                <span>Calls the function in "${ handler.relPath }".
                    Sends the return value as "${ handler.mimeType }"<span>
            </span>
        `;
    }
    else if (handler.handlerType === 'proxy') {
        return `
            <span>
                <span class="handler type">Proxy:<span>
                <span>Forwards the request to "${ handler.proxyUrl }".
            </span>
        `;       
    }
    else {
        return `
            <span>
                <span class="handler type">Unknown handler type: "${ handler.handlerType }"<span>
            </span>
        `;       
    }
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
