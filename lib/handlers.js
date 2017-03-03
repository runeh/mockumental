const { basename, extname } = require('path');

const mime = require('mime-types');

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

function handlersFromPath(path) {
    const name = basename(path);
    const methods = inferMethods(name);
    const handler = {
        name,
        path,
        prettyName: prettyName(name),
        isDefaultHandler: inferDefault(name),
        status: inferStatusCode(name),
        type: inferType(name),
        mimeType: inferMimeType(name),
    };
    return methods.map(method => Object.assign({method}, handler));
}

function inferMethods(filename, defaultMethod = 'GET') {
    // fixme: infers filename "head.js" is a HEAD request etc
    // maybe fixed with required uppercase
    // fixme: should handler support multiple methods? Probably
    const knownMethods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
    const methods = filename.split('.').filter(e => knownMethods.includes(e))
    return methods.length ? methods : [defaultMethod];
}

function inferMimeType(filename) {
    return mime.lookup(filename);
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
    handlersFromPath,
    isAllowedHandler,
};
