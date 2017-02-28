const { basename, extname } = require('path');

const handlerExtensionWhitelist = [
    '.css',
    '.csv',
    '.gif',
    '.html',
    '.jpg',
    '.js',
    '.json',
    '.jsonl',
    '.jsonp',
    '.png',
    '.svg',
    '.txt',
    '.xml',
    '.yaml',
];

function isAllowedHandler(path) {
    return handlerExtensionWhitelist.includes(extname(path));
}

function prettyName(fullName) {
    const base = fullName.split('.').shift();
    return base.replace(/[_-]/g, ' ');
}

function handlerFromPath(path) {
    const name = basename(path);
    return {
        name,
        path,
        prettyName: prettyName(name),
        isDefaultHandler: inferDefault(name),
        status: inferStatusCode(name),
        method: inferMethod(name),
        type: inferType(name),
    };
}

function inferMethod(filename, defaultMethod = 'GET') {
    // fixme: infers filename "head.js" is a HEAD request etc
    // maybe fixed with required uppercase
    // fixme: should handler support multiple methods? Probably
    const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
    const parts = filename.split('.');
    for (let part of parts) {
        if (methods.includes(part)) {
            return part;
        }
    }
    return defaultMethod;
}

function inferStatusCode(filename, defaultStatus = 200) {
    const match = filename.match(/\.(\d{3})(?:\.|$)/);
    return match ? Number(match[1]) : defaultStatus;
}

function inferType(filename, defaultType = 'text') {
    const parts = filename.split('.');
    const extension = parts.pop();
    return extension || defaultType;
}

function inferDefault(filename) {
    return /\.default(?:\.|$)/.test(filename);
}

module.exports = {
    handlerFromPath,
    isAllowedHandler,
};
